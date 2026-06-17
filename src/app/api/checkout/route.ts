import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type CheckoutPlan = "constante" | "pleno";
type CheckoutBilling = "monthly" | "yearly";

const normalizeCheckoutPayload = async (req: Request) => {
  const payload = await req.json().catch(() => ({}));
  const plan: CheckoutPlan = payload?.plan === "pleno" ? "pleno" : "constante";
  const billing: CheckoutBilling = payload?.billing === "yearly" ? "yearly" : "monthly";

  return { plan, billing };
};

const getAsaasLink = (plan: CheckoutPlan, billing: CheckoutBilling) => {
  const specificKey = `ASAAS_LINK_${plan.toUpperCase()}_${billing.toUpperCase()}`;
  const checkoutUrl = process.env[specificKey];

  if (!checkoutUrl) {
    throw new Error(`Link do Asaas não configurado. Configure a variável ${specificKey} na Vercel.`);
  }

  return checkoutUrl;
};

export async function POST(req: Request) {
  try {
    const { plan, billing } = await normalizeCheckoutPayload(req);
    const authHeader = req.headers.get("authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ error: "Faça login antes de assinar." }, { status: 401 });
    }

    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ error: "Sessão expirada. Faça login novamente." }, { status: 401 });
    }

    const checkoutUrl = getAsaasLink(plan, billing);

    return NextResponse.json({ url: checkoutUrl });
  } catch (error: any) {
    console.error("Erro no checkout Asaas:", error);
    return NextResponse.json(
      { error: error.message || "Erro ao iniciar checkout." },
      { status: 500 },
    );
  }
}

