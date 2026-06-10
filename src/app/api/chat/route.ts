import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const KNOWLEDGE_BASE = `
O TDAH Constante é um sistema de apoio focado em constância leve.
PILARES: 1-2-3 (Tarefas), SOS (Micro-ação), Zona de Fluxo (Timer + Sandbox), Esvaziar a Mente, Power Score.
`;

const MAIN_STRUGGLE_LABELS: Record<string, string> = {
  inercia: "dificuldade de iniciar",
  memoria: "perda de etapas no meio da execução",
  foco: "paralisia por excesso de opções",
};

const MINDSET_LABELS: Record<string, string> = {
  paralisia: "paralisia defensiva quando há sobrecarga",
  criativa: "hiperfixação errática em assuntos paralelos",
  hiperfoco: "explosão reativa tentando fazer tudo ao mesmo tempo",
};

const FRICTION_LABELS: Record<string, string> = {
  trabalho: "carreira e prazos",
  casa: "gestão doméstica",
  saude: "saúde e rotina",
  financas: "vida financeira",
  social: "social e afetivo",
  projetos: "projetos pessoais e ideias inacabadas",
};

const PEAK_TIME_LABELS: Record<string, string> = {
  manha: "manhã",
  noite: "noite",
};

function buildSystemPrompt(profile: any): string {
  const {
    full_name,
    occupation,
    interaction_tone,
    main_struggle,
    mindset_profile,
    life_friction_areas,
    life_friction,
    energy_level,
    peak_time,
  } = profile || {};
  const nameContext = full_name ? `Usuário: ${full_name}.` : "";
  const jobContext = occupation ? `Cargo: ${occupation}.` : "";
  const frictionAreas = Array.isArray(life_friction_areas) && life_friction_areas.length > 0
    ? life_friction_areas
    : life_friction
      ? [life_friction]
      : [];
  const frictionContext = frictionAreas.length > 0
    ? frictionAreas.map((area: string) => FRICTION_LABELS[area] || area).join(", ")
    : "não informado";
  const struggleContext = main_struggle
    ? MAIN_STRUGGLE_LABELS[main_struggle] || main_struggle
    : "não informado";
  const mindsetContext = mindset_profile
    ? MINDSET_LABELS[mindset_profile] || mindset_profile
    : "não informado";
  const energyContext = energy_level || "não informado";
  const peakTimeContext = peak_time
    ? PEAK_TIME_LABELS[peak_time] || peak_time
    : "não informado";

  return `
Você é o TC Assistant, companheiro diário do app TDAH Constante.
${nameContext} ${jobContext}

PERFIL COGNITIVO DO USUÁRIO:
- Trava principal: ${struggleContext}.
- Reação à sobrecarga: ${mindsetContext}.
- Áreas da vida com maior fricção: ${frictionContext}.
- Energia percebida: ${energyContext}.
- Melhor janela de performance: ${peakTimeContext}.
- Tom preferido: ${interaction_tone || 'acolhedor'}.

DIRETRIZES CRÍTICAS (ANTI-FADIGA):
1. Respostas CURTAS (máximo 2 parágrafos pequenos ou 3 bullets).
2. Comece validando a experiência sem reforçar culpa.
3. Sempre termine com uma próxima ação pequena ou uma pergunta objetiva.
4. Adapte exemplos ao perfil acima; não responda como planner genérico.
5. Evite linguagem clínica diagnóstica. O app é apoio comportamental, não atendimento médico.

AÇÕES INTELIGENTES:
Se o usuário confirmar a criação de algo, adicione no final: [ACTION: type=task|habit data={title:"...", priority:"..."}].

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
      ? `Você é o TC Assistant no Onboarding. Seja acolhedor, faça perguntas curtas sobre profissão, desafios, energia, rotina e estilo de suporte. Use [DATA: key=value] para extrair informações úteis quando aparecerem.`
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
