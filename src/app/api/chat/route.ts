import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const KNOWLEDGE_BASE = `
O TDAH Constante é um sistema de apoio focado em constância leve.
PILARES: 1-2-3 (Tarefas), SOS (Micro-ação), Zona de Fluxo (Timer + Sandbox), Esvaziar a Mente, Power Score.
`;

function buildSystemPrompt(profile: any): string {
  const { full_name, occupation, interaction_tone } = profile || {};
  const nameContext = full_name ? `Usuário: ${full_name}.` : "";
  const jobContext = occupation ? `Cargo: ${occupation}.` : "";

  return `
Você é o TC Assistant, guia de neuroplasticidade.
${nameContext} ${jobContext}

DIRETRIZES CRÍTICAS (ANTI-FADIGA):
1. Respostas CURTAS (máximo 2 parágrafos pequenos ou 3 bullets).
2. Não dê respostas prontas. PERGUNTE para entender melhor.
3. Se o usuário quiser criar uma tarefa ou hábito, peça detalhes (nome, prioridade, horário).
4. Tom: ${interaction_tone || 'acolhedor'}.

AÇÕES INTELIGENTES:
Se o usuário confirmar a criação de algo, adicione no final: [ACTION: type=task|habit data={title:"...", priority:"..."}]

${KNOWLEDGE_BASE}
  `.trim();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { message, history = [], profile = null, onboardingMode = false } = body;

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ response: "Chave API não configurada." });
    }

    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const systemPrompt = onboardingMode 
      ? `Você é o TC Assistant no Onboarding. Seja acolhedor e pergunte sobre Profissão e Desafios. Use [DATA: key=value] para extrair info.`
      : buildSystemPrompt(profile);

    const messages: any[] = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-8).map((m: any) => ({
        role: m.role,
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

    let fullResponse = completion.choices[0]?.message?.content ?? '';
    
    // Action detection
    const actionMatch = fullResponse.match(/\[ACTION: ([^\]]+)\]/);
    let smartAction = null;
    if (actionMatch) {
      try {
        const actionStr = actionMatch[1];
        const type = actionStr.split('type=')[1].split(' ')[0];
        const dataStr = actionStr.split('data=')[1];
        // Simple manual parsing of the pseudo-json or just extract strings
        smartAction = { type, data: dataStr };
        fullResponse = fullResponse.replace(/\[ACTION: [^\]]+\]/g, '').trim();
      } catch (e) {
        console.error("Action parsing error", e);
      }
    }

    return NextResponse.json({ 
      response: fullResponse,
      smartAction,
      extractedProfile: onboardingMode ? extractProfileData(fullResponse) : null
    });

  } catch (error: any) {
    return NextResponse.json({ response: "Erro na conexão cerebral." });
  }
}

function extractProfileData(text: string) {
  const extractedProfile: any = {};
  const dataMatches = text.match(/\[DATA: (\w+)=([^\]]+)\]/g);
  if (dataMatches) {
    dataMatches.forEach(match => {
      const [key, value] = match.replace('[DATA: ', '').replace(']', '').split('=');
      extractedProfile[key] = value.trim();
    });
  }
  return Object.keys(extractedProfile).length > 0 ? extractedProfile : null;
}
