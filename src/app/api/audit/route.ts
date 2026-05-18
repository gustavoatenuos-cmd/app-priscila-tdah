import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { tasks, focusSessions, journalEntries, profile } = await req.json();

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "Chave API não configurada" });
    }

    const groq = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const dataSummary = `
DADOS PARA AUDITORIA:
- Perfil: ${profile?.occupation}, desafio: ${profile?.main_struggle}, energia: ${profile?.energy_level}.
- Tarefas Hoje: ${tasks?.length} totais, ${tasks?.filter((t: any) => t.completed).length} concluídas.
- Foco: ${focusSessions?.reduce((acc: number, s: any) => acc + (s.duration_minutes || 0), 0)} minutos totais.
- Diários: ${journalEntries?.length} entradas recentes.
    `.trim();

    const systemPrompt = `
Você é o Auditor Neural do app TDAH Constante. Sua missão é analisar os dados do usuário e trazer descobertas e sugestões pragmáticas.
REGRAS:
1. Seja direto, empático e sem "papo furado".
2. Traga 3 DESCOBERTAS (padrões que você notou).
3. Traga 2 SUGESTÕES de implementação prática para amanhã.
4. Use português do Brasil.
    `;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Analise meus dados e gere meu relatório neural:\n\n${dataSummary}` }
      ],
      max_tokens: 800,
      temperature: 0.5,
    });

    const report = completion.choices[0]?.message?.content ?? 'Não foi possível gerar a auditoria agora.';

    return NextResponse.json({ report });

  } catch (error) {
    return NextResponse.json({ error: "Erro na auditoria" }, { status: 500 });
  }
}
