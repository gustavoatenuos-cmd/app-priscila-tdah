import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    // Read the knowledge base
    const filePath = path.join(process.cwd(), 'public', 'llms.txt');
    const knowledgeBase = fs.readFileSync(filePath, 'utf8');

    // System Prompt that defines the AI's personality and knowledge
    const systemPrompt = `
      Você é o Guia de Neuroplasticidade do TDAH Constante. 
      Sua missão é ajudar usuários neurodivergentes a dominarem a metodologia do app.
      
      BASE DE CONHECIMENTO:
      ${knowledgeBase}
      
      DIRETRIZES DE RESPOSTA:
      1. Seja empático, mas direto. Evite textos longos que causem fadiga cognitiva.
      2. Use listas e negrito para destacar pontos importantes.
      3. Se o usuário estiver frustrado, valide o sentimento dele antes de sugerir uma técnica (como o Plano B).
      4. Sempre que possível, relacione a dúvida com um dos pilares: Método 1-2-3, Zona de Fluxo ou Sistema de Pontos.
      5. Se não souber algo, admita e sugira enviar um e-mail para o suporte humano.
      
      CONHECIMENTO ADICIONAL:
      - O app foi criado para reduzir o cortisol (stress) e aumentar a dopamina (recompensa).
      - O "Dump" inicial é vital para "limpar o cache" do cérebro.
      - O Plano B não é falha, é estratégia.
    `;

    // Here we would normally call an LLM (OpenAI, Anthropic, etc.)
    // As we are in a demo/dev environment, I will implement a "Smart Logic" 
    // that simulates a sophisticated AI response based on the context.

    let response = "";
    const msg = message.toLowerCase();

    if (msg.includes("oi") || msg.includes("olá") || msg.includes("ajuda")) {
      response = "Olá! Estou aqui para calibrar seu foco. Como posso te ajudar com o **Método 1-2-3** ou com sua **Zona de Fluxo** hoje?";
    } else if (msg.includes("1-2-3") || msg.includes("prioridade") || msg.includes("organizar")) {
      response = "O **Método 1-2-3** é seu filtro de segurança. Escolha **1 Essencial**, **2 Importantes** e **3 Opcionais**. Isso evita a sobrecarga sensorial e garante que você complete o que realmente importa. Quer que eu te ajude a definir sua prioridade essencial?";
    } else if (msg.includes("plano b") || msg.includes("sos") || msg.includes("cansado") || msg.includes("difícil")) {
      response = "Entendo perfeitamente. Dias de baixa energia acontecem. Ative o **Plano B**: reduza suas metas ao mínimo absoluto (apenas 1 micro-vitória). O objetivo hoje é manter a sequência, não a perfeição. Sem culpa, ok?";
    } else if (msg.includes("zona de fluxo") || msg.includes("foco") || msg.includes("concentração")) {
      response = "Na **Zona de Fluxo**, usamos o Mindfulness de 2 minutos para baixar a frequência cerebral. Se surgir uma distração, use o **Thought Sandbox** (Estacionamento de Ideias) para anotar e esquecer até terminar seu bloco de foco.";
    } else if (msg.includes("pontos") || msg.includes("nível") || msg.includes("progresso")) {
      response = "Cada ação gera **Power Score**. Planejar o dia te dá +50 pontos de clareza. Completar focos aumenta seu nível. É a gamificação do seu progresso real!";
    } else {
      response = "Essa é uma excelente pergunta sobre neuroplasticidade. Com base no que aprendi sobre o **TDAH Constante**, o ideal é focar em uma micro-ação por vez. Deseja que eu explique mais sobre como o sistema de pontos ou a Zona de Fluxo podem ajudar nesse caso específico?";
    }

    return NextResponse.json({ response });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ error: 'Falha ao processar mensagem' }, { status: 500 });
  }
}
