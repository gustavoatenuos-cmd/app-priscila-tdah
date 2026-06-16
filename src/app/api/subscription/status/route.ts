import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, is_premium, trial_expires_at, premium_uses_left")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const now = new Date().getTime();
  const trialExpires = profile.trial_expires_at ? new Date(profile.trial_expires_at).getTime() : 0;
  const hasTrial = profile.trial_expires_at && now <= trialExpires;
  const usesLeft = profile.premium_uses_left ?? 3;

  const hasAccess = profile.is_premium || hasTrial || usesLeft > 0;

  let reason = "";
  if (profile.is_premium) {
    reason = "premium";
  } else if (hasTrial) {
    reason = "trial";
  } else if (usesLeft > 0) {
    reason = "free_uses";
  } else {
    reason = "no_access";
  }

  const result = {
    subscription_status: profile.is_premium ? "premium" : hasTrial ? "trial" : "free",
    plan_id: null,
    trial_started_at: profile.trial_expires_at ? new Date(profile.trial_expires_at).toISOString() : null,
    trial_expires_at: profile.trial_expires_at ? new Date(profile.trial_expires_at).toISOString() : null,
    trial_used: profile.trial_expires_at ? now > trialExpires : false,
    payment_url: null,
    has_access: hasAccess,
    reason,
  };

  return NextResponse.json(result);
}
