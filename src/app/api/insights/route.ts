import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  try {
    const { occupation, main_struggle, energy_level, mindset_profile } = await req.json();

    const prompt = `Você é o Cérebro do TDAH Constante, uma IA neuro-inclusiva. 
O usuário tem a seguinte ocupação: ${occupation || 'Profissional'}. 
O principal desafio dele no TDAH é: ${main_struggle || 'foco'}. 
Nível de energia: ${energy_level || 'média'}. 
Padrão de mindset: ${mindset_profile || 'criativa'}.

Gere um ÚNICO insight curto (máximo 2 frases) de "know-how" para hoje. Como ele pode hackear o cérebro dele no trabalho hoje considerando sua profissão? Seja inteligente, direto, e acolhedor. Não use aspas.`;

    const response = await openai.chat.completions.create({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 150,
    });

    const insight = response.choices[0].message.content?.trim();

    return NextResponse.json({ insight });
  } catch (error: any) {
    console.error("API Insight Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
