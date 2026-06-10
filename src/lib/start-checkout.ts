import {
  clearCheckoutIntent,
  getCheckoutAuthUrl,
  normalizeCheckoutIntent,
  saveCheckoutIntent,
  type CheckoutBilling,
  type CheckoutPlan,
} from "@/lib/checkout-intent";
import { supabase } from "@/lib/supabase";

type StartCheckoutOptions = {
  plan?: CheckoutPlan;
  billing?: CheckoutBilling;
};

export async function startCheckout(options: StartCheckoutOptions = {}) {
  const intent = normalizeCheckoutIntent(options);
  const { data: { session } } = await supabase.auth.getSession();

  if (!session?.access_token) {
    saveCheckoutIntent(intent);
    window.location.href = getCheckoutAuthUrl("/register", intent);
    return;
  }

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(intent),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || !data.url) {
    throw new Error(data.error || "Nao foi possivel iniciar o checkout.");
  }

  clearCheckoutIntent();
  window.location.href = data.url;
}
