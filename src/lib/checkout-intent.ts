export type CheckoutPlan = "constante" | "pleno";
export type CheckoutBilling = "monthly" | "yearly";

export type CheckoutIntent = {
  plan: CheckoutPlan;
  billing: CheckoutBilling;
};

const CHECKOUT_INTENT_KEY = "tdah_constante_checkout_intent";

export const normalizeCheckoutIntent = (intent: Partial<CheckoutIntent> = {}): CheckoutIntent => ({
  plan: intent.plan === "pleno" ? "pleno" : "constante",
  billing: intent.billing === "yearly" ? "yearly" : "monthly",
});

export const saveCheckoutIntent = (intent: Partial<CheckoutIntent>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CHECKOUT_INTENT_KEY, JSON.stringify(normalizeCheckoutIntent(intent)));
};

export const getCheckoutIntent = (): CheckoutIntent | null => {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  if (params.get("checkout") === "1") {
    return normalizeCheckoutIntent({
      plan: params.get("plan") === "pleno" ? "pleno" : "constante",
      billing: params.get("billing") === "yearly" ? "yearly" : "monthly",
    });
  }

  const saved = window.localStorage.getItem(CHECKOUT_INTENT_KEY);
  if (!saved) return null;

  try {
    return normalizeCheckoutIntent(JSON.parse(saved));
  } catch {
    return null;
  }
};

export const clearCheckoutIntent = () => {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CHECKOUT_INTENT_KEY);
};

export const getCheckoutAuthUrl = (path: "/login" | "/register", intent: Partial<CheckoutIntent>) => {
  const normalized = normalizeCheckoutIntent(intent);
  const params = new URLSearchParams({
    checkout: "1",
    plan: normalized.plan,
    billing: normalized.billing,
  });

  return `${path}?${params.toString()}`;
};
