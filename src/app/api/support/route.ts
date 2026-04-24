import { Resend } from 'resend';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      console.error("RESEND_API_KEY is not defined");
      return NextResponse.json({ error: 'Configuração de e-mail ausente' }, { status: 500 });
    }

    const resend = new Resend(apiKey);
    const { message, context } = await req.json();

    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: process.env.SUPPORT_EMAIL || 'suporte@tdahconstante.com.br',
      subject: '🚨 Nova Solicitação de Suporte - IA TDAH Constante',
      html: `
        <h2>Nova dúvida não respondida pela IA</h2>
        <p><strong>Dúvida do Usuário:</strong> ${message}</p>
        <p><strong>Contexto:</strong> ${context}</p>
        <hr />
        <p>Enviado via Ecossistema TDAH Constante</p>
      `,
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}

