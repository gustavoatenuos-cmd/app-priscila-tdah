import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CheckoutPlan = "constante" | "pleno";
type CheckoutBilling = "monthly" | "yearly";

const planLabels: Record<CheckoutPlan, string> = {
  constante: "TDAH Constante - Plano Constante",
  pleno: "TDAH Constante - Plano Pleno",
};

const normalizeCheckoutPayload = async (req: Request) => {
  const payload = await req.json().catch(() => ({}));
  const plan: CheckoutPlan = payload?.plan === "pleno" ? "pleno" : "constante";
  const billing: CheckoutBilling = payload?.billing === "yearly" ? "yearly" : "monthly";

  return { plan, billing };
};

const getPlanId = (plan: CheckoutPlan, billing: CheckoutBilling) => {
  const specificKey = `PAGARME_PLAN_ID_${plan.toUpperCase()}_${billing.toUpperCase()}`;
  const planId = process.env[specificKey] || process.env.PAGARME_PLAN_ID;

  if (!planId) {
    throw new Error(`Plano Pagar.me nao configurado. Configure ${specificKey} ou PAGARME_PLAN_ID na Vercel.`);
  }

  return planId;
};

const getPagarmeConfig = (plan: CheckoutPlan, billing: CheckoutBilling) => {
  const secretKey = process.env.PAGARME_SECRET_KEY;

  if (!secretKey) {
    throw new Error("PAGARME_SECRET_KEY nao configurada.");
  }

  const baseUrl = process.env.PAGARME_BASE_URL
    || (secretKey.startsWith("sk_test_")
      ? "https://sdx-api.pagar.me/core/v5"
      : "https://api.pagar.me/core/v5");

  return { secretKey, planId: getPlanId(plan, billing), baseUrl };
};

const getPagarmeHeaders = (secretKey: string) => ({
  Authorization: `Basic ${Buffer.from(`${secretKey}:`).toString("base64")}`,
  "Content-Type": "application/json",
  "User-Agent": "tdah-constante/1.0",
});

export async function POST(req: Request) {
  try {
    const { plan, billing } = await normalizeCheckoutPayload(req);
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Faca login antes de assinar." }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ error: "Supabase nao configurado." }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Sessao expirada. Faca login novamente." }, { status: 401 });
    }

    const { secretKey, planId, baseUrl } = getPagarmeConfig(plan, billing);
    const checkoutResponse = await fetch(`${baseUrl}/paymentlinks`, {
      method: "POST",
      headers: getPagarmeHeaders(secretKey),
      body: JSON.stringify({
        type: "subscription",
        name: `${planLabels[plan]} ${billing === "yearly" ? "Anual" : "Mensal"}`,
        order_code: `tdah-${plan}-${billing}-${user.id.slice(0, 8)}-${Date.now()}`,
        payment_settings: {
          accepted_payment_methods: ["credit_card", "boleto"],
        },
        cart_settings: {
          recurrences: [
            {
              plan_id: planId,
              start_in: 1,
            },
          ],
        },
        metadata: {
          user_id: user.id,
          user_email: user.email,
          plan,
          billing,
          product: "tdah_constante",
        },
      }),
    });

    const checkout = await checkoutResponse.json().catch(() => ({}));
    const checkoutUrl = checkout.url || checkout.payment_url || checkout.checkout_url;

    if (!checkoutResponse.ok || !checkoutUrl) {
      console.error("Erro Pagar.me checkout:", {
        status: checkoutResponse.status,
        message: checkout?.message,
        errors: checkout?.errors,
        fullResponse: checkout
      });
      return NextResponse.json(
        { error: `Erro Pagar.me: ${JSON.stringify(checkout)}` },
        { status: checkoutResponse.status || 500 },
      );
    }

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error("Erro no checkout Pagar.me:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao iniciar checkout." },
      { status: 500 },
    );
  }
}
