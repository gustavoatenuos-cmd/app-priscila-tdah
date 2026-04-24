import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
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
