import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const getAdminSupabase = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
};

export async function POST(req: Request) {
  try {
    const asaasToken = req.headers.get("asaas-access-token");
    const webhookSecret = process.env.ASAAS_WEBHOOK_SECRET;

    // Se o segredo foi configurado na Vercel, validar o token
    if (webhookSecret && asaasToken !== webhookSecret) {
      console.warn("Acesso negado no webhook do Asaas (token inválido).");
      return NextResponse.json({ error: "Acesso negado" }, { status: 403 });
    }

    const payload = await req.json();
    const { event, payment } = payload;

    if (!event || !payment) {
      return NextResponse.json({ error: "Payload inválido" }, { status: 400 });
    }

    console.log(`[Webhook Asaas] Recebido evento: ${event} para cobrança ${payment.id}`);

    // Processa eventos de pagamento concluído
    if (["PAYMENT_RECEIVED", "PAYMENT_CONFIRMED", "PAYMENT_APPROVED_BY_RISK_ANALYSIS"].includes(event)) {
      
      const customerId = payment.customer;
      if (!customerId) {
        return NextResponse.json({ error: "Customer ID não encontrado no pagamento" }, { status: 400 });
      }

      // Busca o e-mail do cliente na API do Asaas
      const asaasApiKey = process.env.ASAAS_API_KEY;
      if (!asaasApiKey) {
        console.error("ASAAS_API_KEY não configurada.");
        return NextResponse.json({ error: "ASAAS_API_KEY não configurada" }, { status: 500 });
      }

      const customerRes = await fetch(`https://api.asaas.com/v3/customers/${customerId}`, {
        headers: {
          "access_token": asaasApiKey
        }
      });

      if (!customerRes.ok) {
        console.error("Erro ao buscar detalhes do cliente no Asaas.");
        return NextResponse.json({ error: "Erro ao buscar cliente no Asaas" }, { status: 500 });
      }

      const customerData = await customerRes.json();
      const customerEmail = customerData.email;

      if (!customerEmail) {
        console.warn(`Cliente Asaas ${customerId} não possui e-mail cadastrado.`);
        return NextResponse.json({ received: true, ignored: true, reason: "No email" });
      }

      // Busca o usuário no Supabase
      const supabase = getAdminSupabase();
      
      const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers({
        perPage: 1000
      });

      if (usersError) {
        console.error("Erro ao listar usuários no Supabase:", usersError);
        return NextResponse.json({ error: "Database error" }, { status: 500 });
      }

      const user = users.find(u => u.email === customerEmail);

      if (user) {
        const { error } = await supabase
          .from("profiles")
          .update({
            is_premium: true,
            subscription_status: "active",
            pagarme_customer_id: customerId, // Reaproveitamos para mapear o id do Asaas
            premium_uses_left: 999999,
          })
          .eq("id", user.id);

        if (error) {
          console.error(`Erro ao liberar Premium para ${customerEmail}:`, error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        console.log(`[Webhook Asaas] Premium liberado com sucesso para: ${customerEmail}`);
      } else {
        console.warn(`[Webhook Asaas] Usuário com e-mail ${customerEmail} não encontrado no sistema.`);
      }
    }

    // Se a assinatura for cancelada ou atrasada
    if (["PAYMENT_DELETED", "PAYMENT_OVERDUE", "PAYMENT_REFUNDED", "PAYMENT_CHARGEBACK_REQUESTED"].includes(event)) {
      console.log(`[Webhook Asaas] Evento de falha ou cancelamento (${event}) para a cobrança ${payment.id}.`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro interno no webhook Asaas:", error);
    return NextResponse.json(
      { error: error.message || "Erro no webhook Asaas." },
      { status: 500 },
    );
  }
}
