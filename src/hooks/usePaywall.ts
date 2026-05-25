import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function usePaywall(featureName: string) {
  const [showPaywall, setShowPaywall] = useState(false);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) setProfile(data);
    }
    loadProfile();
  }, []);

  const checkAccess = async (): Promise<boolean> => {
    if (!profile) return false;

    // Se é premium, passa direto
    if (profile.is_premium) return true;

    // Se o trial acabou (trial_ends_at existe e é menor que agora)
    if (profile.trial_ends_at) {
      const trialEnds = new Date(profile.trial_ends_at).getTime();
      const now = new Date().getTime();
      if (now > trialEnds) {
        setShowPaywall(true);
        return false;
      }
    }

    // Checar se tem usos gratuitos
    const usesLeft = profile.premium_uses_left ?? 3;
    if (usesLeft <= 0) {
      setShowPaywall(true);
      return false;
    }

    // Descontar uso
    const newUses = usesLeft - 1;
    await supabase.from("profiles").update({ premium_uses_left: newUses }).eq("id", profile.id);
    setProfile({ ...profile, premium_uses_left: newUses });

    return true;
  };

  return { showPaywall, setShowPaywall, checkAccess };
}
