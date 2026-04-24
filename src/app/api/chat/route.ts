import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// ── Groq client (using OpenAI SDK compatibility) ──────────────────────────────
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ── Knowledge base loader ──────────────────────────────────────────────────────
let knowledgeBaseCache: string | null = null;

function getKnowledgeBase(): string {
  if (knowledgeBaseCache) return knowledgeBaseCache;
  try {
    const filePath = path.join(process.cwd(), 'public', 'llms.txt');
    knowledgeBaseCache = fs.readFileSync(filePath, 'utf8');
    return knowledgeBaseCache;
  } catch {
    return '(Base de conhecimento indisponível)';
  }
}

// ── System prompt builder ──────────────────────────────────────────────────────
function buildSystemPrompt(knowledgeBase: string, userName: string | null): string {
  const userContext = userName ? `Você está falando com ${userName}. Use o nome dele(a) ocasionalmente para ser mais pessoal.` : "";

  return `
Você é o TC Assistant, um assistente baseado nos materiais de neuroplasticidade, constância leve, foco e rotina para pessoas com TDAH.
${userContext}

Sua função é ajudar o usuário a sair da paralisia e voltar para o próximo passo possível com leveza, sem culpa e com clareza.

PRINCÍPIOS CENTRAIS:
- Constância > Perfeição
- Microação > Plano Ideal
- Visibilidade > Depender da Memória
- Regulação antes de Produtividade
- Adaptação > Abandono
- Foco no próximo passo, não na vida inteira

ESTILO DE RESPOSTA:
- Responda SEMPRE em português do Brasil.
- Tom acolhedor, humano e objetivo.
- Frases curtas.
- Uma orientação por vez.
- Sempre que possível, transforme a resposta em ação prática.
- Faça no máximo UMA pergunta por resposta.

FLUXO DE RESPOSTA:
1. RECONHEÇA a dificuldade sem dramatizar.
2. IDENTIFIQUE a trava principal (Foco, Sobrecarga, Culpa, Emoção, Energia, Organização ou Decisão).
3. ESCOLHA uma estratégia simples:
   - Respiração 4-2-6
   - Regra dos 3 itens
   - Micro-passo
   - Timer de 10 ou 15 minutos
   - Tirar estímulos visuais
   - Escrever no papel
   - Pausa sensorial
   - Ancoragem visual
   - Recompensa consciente
4. CONVIDE o usuário para um próximo passo imediato.

BASE DE CONHECIMENTO ESPECÍFICA (llms.txt):
${knowledgeBase}

LIMITES E ÉTICA:
- Não faça diagnóstico.
- Não substitua tratamento médico ou psicológico.
- Se houver sinais de risco, sofrimento intenso ou crise, oriente busca de ajuda profissional.
- Não prometa cura.
- Respostas curtas para evitar fadiga cognitiva.
  `.trim();
}

export async function POST(req: Request) {
  try {
    const { message, history = [], userName = null } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia.' }, { status: 400 });
    }

    // Force key check - if missing, use the fallbackResponse
    if (!process.env.GROQ_API_KEY || process.env.GROQ_API_KEY === 'sk-...') {
      return NextResponse.json({ 
        response: fallbackResponse(message, userName) 
      });
    }

    const knowledgeBase = getKnowledgeBase();
    const systemPrompt = buildSystemPrompt(knowledgeBase, userName);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 500,
      temperature: 0.6,
    });

    const response = completion.choices[0]?.message?.content ?? 'Não consegui processar sua mensagem.';

    return NextResponse.json({ response });

  } catch (error) {
    console.error('[TC Assistant] Groq Chat error:', error);
    // Even if it fails, try the fallback to not break user experience
    return NextResponse.json({ 
      response: fallbackResponse(message, userName) 
    });
  }
}

function fallbackResponse(message: string, userName: string | null): string {
  const name = userName ? `, ${userName}` : "";
  const msg = message.toLowerCase();

  if (msg.includes("nome")) {
    return userName ? `Sim, eu sei seu nome! Você se chama **${userName}**. Como posso te ajudar hoje?` : "Ainda não tive o prazer de saber seu nome. Como você se chama?";
  }
  
  if (/oi|ol[aá]|bom dia|boa tarde|boa noite|ajuda/.test(msg)) {
    return `Olá${name}! Estou aqui para calibrar seu foco. Como posso te ajudar com o **Método 1-2-3** ou com sua **Zona de Fluxo** hoje?`;
  }
  if (/sos|trav|paralisi|n[aã]o consigo|difícil|cansad/.test(msg)) {
    return `Entendo${name}. Dias assim acontecem. Ative o **SOS**: escolha uma micro-ação tão pequena que seja impossível não fazer. O que seria o menor passo possível agora?`;
  }

  return `Essa é uma boa pergunta${name}. Com base no **TDAH Constante**, o melhor caminho é uma micro-ação de cada vez. Quer que eu explique como o **Método 1-2-3** ou o **SOS** podem ajudar nisso?`;
}
