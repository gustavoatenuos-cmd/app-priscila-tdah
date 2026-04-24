import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// ── Groq client (using OpenAI SDK compatibility) ──────────────────────────────
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

// ── Knowledge base (Inline to avoid fs/path issues on Vercel) ──────────────────
const KNOWLEDGE_BASE = `
O TDAH Constante é um sistema de apoio para neurodivergentes focado em constância leve.
PILARES:
1. Método 1-2-3: 1 prioridade essencial, 2 importantes, 3 opcionais.
2. SOS: técnica de micro-ação para quebrar a paralisia de tarefa.
3. Zona de Fluxo: sessões de foco com timer e Thought Sandbox.
4. Esvaziar a Mente: ferramenta de brain dump para reduzir carga cognitiva.
5. Power Score: sistema de gamificação que premia a constância, não a perfeição.
`;

// ── System prompt builder ──────────────────────────────────────────────────────
function buildSystemPrompt(userName: string | null): string {
  const userContext = userName ? `Você está falando com ${userName}.` : "";

  return `
Você é o TC Assistant, guia de neuroplasticidade do app TDAH Constante.
${userContext}

OBJETIVO: Ajudar o usuário a sair da paralisia com leveza e clareza.
PRINCÍPIOS: Constância > Perfeição | Microação > Plano Ideal | Regulação antes de Produtividade.

ESTILO:
- Português do Brasil.
- Tom acolhedor e objetivo. Frases curtas.
- Uma orientação por vez. Máximo 3-4 frases.
- Máximo UMA pergunta por resposta.

ESTRATÉGIAS: Respiração 4-2-6, Regra dos 3 itens, Micro-passo, Timer de 10min, Escrever no papel, Pausa sensorial.

CONHECIMENTO:
${KNOWLEDGE_BASE}

LIMITES: Não faça diagnóstico. Não substitua médicos. Respostas curtas para evitar fadiga cognitiva.
  `.trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], userName = null } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia.' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        response: `Olá${userName ? `, ${userName}` : ''}! Estou em modo de demonstração. Por favor, configure minha chave API no painel da Vercel para eu poder te ajudar melhor.` 
      });
    }

    const systemPrompt = buildSystemPrompt(userName);

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-6).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 400,
      temperature: 0.6,
    });

    const response = completion.choices[0]?.message?.content ?? 'Não consegui processar sua mensagem agora.';

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error('[TC Assistant] Error:', error);
    return NextResponse.json({ 
      response: "Tive um pequeno curto-circuito neural. Pode tentar de novo em um segundo?" 
    });
  }
}
