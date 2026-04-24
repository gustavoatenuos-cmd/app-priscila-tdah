import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Força a rota a ser dinâmica para evitar erro de build na Vercel
export const dynamic = 'force-dynamic';

// ── Knowledge base (Inline) ──────────────────────────────────────────────────
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
function buildSystemPrompt(profile: any): string {
  const { 
    full_name, 
    occupation, 
    main_struggle, 
    mindset_profile, 
    life_friction, 
    energy_level, 
    peak_time, 
    interaction_tone,
    bio 
  } = profile || {};

  const nameContext = full_name ? `Você está falando com ${full_name}.` : "";
  const diagnosticContext = `
DADOS DO USUÁRIO PARA PERSONALIZAÇÃO:
- Ocupação: ${occupation || 'Não informado'}
- Principal Dificuldade: ${main_struggle || 'Não informado'}
- Padrão Comportamental: ${mindset_profile || 'Não informado'}
- Maior Fricção: ${life_friction || 'Não informado'}
- Nível de Energia Geral: ${energy_level || 'Não informado'}
- Pico de Performance: ${peak_time || 'Não informado'}
- Tom de Suporte Preferido: ${interaction_tone || 'acolhedor'}
- Bio/Como pensa: ${bio || 'Não informado'}
  `.trim();

  return `
Você é o TC Assistant, guia de neuroplasticidade e companheiro cognitivo do app TDAH Constante.
${nameContext}

${diagnosticContext}

OBJETIVO: Ajudar o usuário a sair da paralisia com leveza e clareza, adaptando as estratégias à realidade dele (cargo, desafios e nível de energia).

PRINCÍPIOS: Constância > Perfeição | Microação > Plano Ideal | Regulação antes de Produtividade.

ESTILO:
- Português do Brasil.
- Tom: ${interaction_tone === 'direto' ? 'direto, pragmático e objetivo' : 'acolhedor, empático e humano'}.
- Frases curtas para evitar fadiga cognitiva.
- Uma orientação por vez. 

ESTRATÉGIAS: Respiração 4-2-6, Regra dos 3 itens, Micro-passo, Timer de 10-15min, Escrever no papel, Pausa sensorial.

CONHECIMENTO:
${KNOWLEDGE_BASE}

LIMITES: Não faça diagnóstico médico. Não substitua tratamento profissional.
  `.trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], profile = null } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia.' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ 
        response: "Estou em modo de demonstração. Configure a GROQ_API_KEY para ativar meu motor cerebral." 
      });
    }

    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const systemPrompt = buildSystemPrompt(profile);

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-10).map((m: any) => ({
        role: m.role,
        content: m.content,
      })),
      { role: 'user', content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 600,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content ?? 'Não consegui processar sua mensagem agora.';

    return NextResponse.json({ response });

  } catch (error: any) {
    console.error('[TC Assistant] Error:', error);
    return NextResponse.json({ 
      response: "Tive um pequeno curto-circuito neural. Tente novamente em instantes." 
    });
  }
}
