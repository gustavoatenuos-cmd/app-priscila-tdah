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
    const rawBody = await req.text();
    const event = JSON.parse(rawBody);
    const eventType = getEventType(event);
    const eventId = getEventId(event);
    const payload = getEventPayload(event);
    const userId = getUserId(event, payload);
    const customerId = getCustomerId(payload);
    const subscriptionId = getSubscriptionId(payload);

    if (!eventType || !eventId) {
      return NextResponse.json({ error: "Evento Pagar.me inválido." }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    const { error: eventInsertError } = await supabase.from("payment_events").insert({
      stripe_event_id: eventId,
      event_type: eventType,
      user_id: userId,
      stripe_customer_id: customerId,
      payload: event,
    });

    if (eventInsertError) {
      if (eventInsertError.code === "23505") {
        return NextResponse.json({ received: true, duplicate: true });
      }

      console.error("Erro ao registrar evento Pagar.me:", eventInsertError);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    if (["charge.paid", "subscription.created", "subscription.updated"].includes(eventType)) {
      const targetUserId = userId || await findUserIdByPagarmeCustomer(supabase, customerId);

      if (targetUserId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            is_premium: true,
            subscription_status: "active",
            plan: "monthly",
            pagarme_customer_id: customerId,
            pagarme_subscription_id: subscriptionId,
            premium_uses_left: 999999,
          })
          .eq("id", targetUserId);

        if (error) {
          console.error("Erro ao liberar Premium via Pagar.me:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
      }
    }

    if (["charge.payment_failed", "subscription.canceled", "subscription.expired"].includes(eventType)) {
      const targetUserId = userId || await findUserIdByPagarmeCustomer(supabase, customerId);

      if (targetUserId) {
        const { error } = await supabase
          .from("profiles")
          .update({
            is_premium: false,
            subscription_status: eventType,
            pagarme_customer_id: customerId,
            pagarme_subscription_id: subscriptionId,
          })
          .eq("id", targetUserId);

        if (error) {
          console.error("Erro ao bloquear Premium via Pagar.me:", error);
          return NextResponse.json({ error: "Database error" }, { status: 500 });
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Erro no webhook Pagar.me:", error);
    return NextResponse.json(
      { error: error.message || "Erro no webhook Pagar.me." },
      { status: 500 },
    );
  }
}

function getEventType(event: any) {
  return event?.type || event?.event || event?.name || event?.event_type || null;
}

function getEventId(event: any) {
  return event?.id || event?.event_id || event?.data?.id || `${getEventType(event)}-${Date.now()}`;
}

function getEventPayload(event: any) {
  return event?.data?.object || event?.data || event?.payload || event;
}

function getUserId(event: any, payload: any) {
  return event?.metadata?.user_id
    || payload?.metadata?.user_id
    || payload?.order?.metadata?.user_id
    || payload?.subscription?.metadata?.user_id
    || null;
}

function getCustomerId(payload: any) {
  const customer = payload?.customer || payload?.subscription?.customer || payload?.order?.customer;
  if (!customer) return null;
  return typeof customer === "string" ? customer : customer.id || null;
}

function getSubscriptionId(payload: any) {
  const subscription = payload?.subscription;
  if (!subscription) return payload?.subscription_id || payload?.id || null;
  return typeof subscription === "string" ? subscription : subscription.id || null;
}

async function findUserIdByPagarmeCustomer(supabase: any, customerId: string | null) {
  if (!customerId) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("pagarme_customer_id", customerId)
    .maybeSingle();

  return data?.id || null;
}
