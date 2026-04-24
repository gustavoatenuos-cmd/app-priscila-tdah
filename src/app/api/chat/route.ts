import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

// ── OpenAI client ──────────────────────────────────────────────────────────────
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// ── Knowledge base loader (cached at module level) ─────────────────────────────
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

// ── System prompt ──────────────────────────────────────────────────────────────
function buildSystemPrompt(knowledgeBase: string): string {
  return `
Você é o TC Assistant — o guia pessoal de neuroplasticidade do app TDAH Constante.

PERSONALIDADE:
- Tom: acolhedor, direto e prático. Nunca condescendente.
- Fala como um amigo especialista, não como um chatbot corporativo.
- Valide primeiro, sugira depois. Se o usuário estiver frustrado, reconheça antes de dar dicas.
- Use frases curtas. Evite parágrafos longos (sobrecarga cognitiva).
- Nunca invente funcionalidades que não existem no app.

BASE DE CONHECIMENTO DO APP:
${knowledgeBase}

PILARES DO APP:
1. Esvaziar a Mente (brain dump guiado)
2. Foco Profundo — timer com Thought Sandbox para estacionar distrações
3. Método 1-2-3 — 1 Essencial, 2 Importantes, 3 Opcionais
4. SOS — micro-ação anti-paralisia
5. Power Score — sistema de pontos e gamificação

DIRETRIZES:
- Se não souber algo, admita e ofereça enviar para o suporte humano.
- Use **negrito** para termos-chave do app.
- Máximo 3-4 frases por resposta. Se precisar de mais, use lista.
- Sempre termine com uma pergunta curta ou ação concreta.
- Responda SEMPRE em português do Brasil.
  `.trim();
}

// ── Route handler ──────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const { message, history = [] } = await req.json();

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia.' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-...') {
      // Fallback inteligente enquanto a chave não está configurada
      return NextResponse.json({
        response: fallbackResponse(message),
      });
    }

    const knowledgeBase = getKnowledgeBase();
    const systemPrompt = buildSystemPrompt(knowledgeBase);

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
      // Include conversation history (max 10 turns to control token cost)
      ...history.slice(-10).map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 300,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content ?? 'Não consegui processar sua mensagem.';

    return NextResponse.json({ response });

  } catch (error) {
    console.error('[TC Assistant] Chat error:', error);
    return NextResponse.json(
      { error: 'Erro ao processar mensagem. Tente novamente.' },
      { status: 500 }
    );
  }
}

// ── Smart fallback (used when OPENAI_API_KEY is not configured yet) ────────────
function fallbackResponse(message: string): string {
  const msg = message.toLowerCase();

  if (/oi|ol[aá]|bom dia|boa tarde|boa noite|ajuda/.test(msg)) {
    return "Olá! Estou aqui para calibrar seu foco. Como posso te ajudar com o **Método 1-2-3** ou com sua **Zona de Fluxo** hoje?";
  }
  if (/1.?2.?3|prioridade|organizar|planejar/.test(msg)) {
    return "O **Método 1-2-3** é seu filtro de segurança. Escolha **1 Essencial**, **2 Importantes** e **3 Opcionais**. Isso evita sobrecarga e garante que você complete o que realmente importa. Quer definir sua prioridade agora?";
  }
  if (/sos|trav|paralisi|n[aã]o consigo|difícil|cansad/.test(msg)) {
    return "Entendo. Dias assim acontecem. Ative o **SOS**: escolha uma micro-ação tão pequena que seja impossível não fazer. O objetivo é só começar. O que seria o menor passo possível agora?";
  }
  if (/foco|concentra|zona de fluxo|timer/.test(msg)) {
    return "Na **Zona de Fluxo**, comece com 2 min de respiração para baixar a frequência mental. Se surgir uma distração, jogue no **Thought Sandbox** e continue. Quantos minutos você consegue reservar agora?";
  }
  if (/pontos|n[ií]vel|progresso|gamifica/.test(msg)) {
    return "Cada ação gera **Power Score**! Planejar o dia = +50 pontos. Completar um foco = pontos de constância. Você sobe de nível conforme mantém a sequência. Quer saber como está seu progresso hoje?";
  }
  if (/esvaziar|dump|pensamento|mente cheia|ansiedad/.test(msg)) {
    return "Use o **Esvaziar a Mente** para tirar tudo da cabeça sem julgamento. Escreva tudo, depois o app te ajuda a filtrar o que realmente importa. Quer abrir isso agora?";
  }

  return "Essa é uma boa pergunta. Com base no **TDAH Constante**, o melhor caminho é uma micro-ação de cada vez. Quer que eu explique como o **Método 1-2-3** ou o **SOS** podem ajudar nisso?";
}
