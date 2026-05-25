"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function OnboardingGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    async function check() {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_completed, interaction_tone")
        .eq("id", user.id)
        .single();

      // Se o perfil não existe ou onboarding não foi concluído → onboarding
      const concluido =
        profile?.onboarding_completed === true ||
        (profile?.interaction_tone && profile.interaction_tone !== "");

      if (!concluido) {
        router.replace("/onboarding");
        return;
      }

      setChecking(false);
    }

    check();
  }, [router, pathname]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 bg-[#1F2937] rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-xs">TC</span>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-[#84A59D] animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
