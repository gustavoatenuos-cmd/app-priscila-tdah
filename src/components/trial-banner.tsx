"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";

export function TrialBanner() {
  const [daysLeft, setDaysLeft] = useState<number | null>(null);
  const [isPremium, setIsPremium] = useState(true);

  useEffect(() => {
    async function checkTrial() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("trial_expires_at, is_premium")
        .eq("id", user.id)
        .single();

      if (profile) {
        setIsPremium(profile.is_premium || false);
        if (profile.trial_expires_at && !profile.is_premium) {
          const endDate = new Date(profile.trial_expires_at);
          const now = new Date();
          const diffTime = endDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          setDaysLeft(diffDays);
        }
      }
    }
    checkTrial();
  }, []);

  if (isPremium || daysLeft === null) return null;

  const isExpired = daysLeft <= 0;

  return (
    <div className={`w-full text-center py-2 px-4 flex items-center justify-center gap-2 z-50 relative ${isExpired ? "bg-red-500 text-white" : "bg-[#1F2937] text-white"}`}>
      {isExpired ? (
        <>
          <ShieldAlert className="h-4 w-4" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Seu teste grátis acabou. Você perdeu o acesso às ferramentas premium.
          </span>
        </>
      ) : (
        <>
          <Clock className="h-4 w-4 text-[#84A59D]" />
          <span className="text-xs font-bold uppercase tracking-wider">
            Você tem {daysLeft} {daysLeft === 1 ? "dia restante" : "dias restantes"} de teste grátis.
          </span>
        </>
      )}
      <Link href="/dashboard/assinatura" className="ml-4 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-xs font-bold transition-colors">
        Assinar Agora
      </Link>
    </div>
  );
}
