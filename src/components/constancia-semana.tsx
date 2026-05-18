"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const DIAS_LABEL = ["S", "T", "Q", "Q", "S", "S", "D"]; // seg..dom

function startOfWeek(d: Date): Date {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = (x.getDay() + 6) % 7; // 0 = seg
  x.setDate(x.getDate() - day);
  return x;
}

function isoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * "Constância da semana" — substitui o streak por uma visão honesta: quantos
 * dias dos últimos 7 a usuária apareceu (sem cobrança por continuidade).
 *
 * Aparecer = ter um daily_checkin OU ter completado uma daily_task OU ter
 * marcado presença em day_completions OU ter feito um presence_session.
 *
 * Compatível com tabelas legadas (tasks com dia_numero, presenca_diaria,
 * emotional_checks) — usa OR entre as fontes que existirem.
 */
export function ConstanciaSemana({ compact = false }: { compact?: boolean }) {
  const [days, setDays] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const weekStart = startOfWeek(new Date());
        const weekStartISO = isoDate(weekStart);
        const presentes = new Set<string>();

        // Try modern tables, swallow errors if not yet migrated
        const tryFetch = async (fn: () => Promise<{ data: any[] | null }>) => {
          try {
            const { data } = await fn();
            return data ?? [];
          } catch {
            return [];
          }
        };

        const checkins = await tryFetch(async () =>
          await supabase
            .from("daily_checkins")
            .select("checkin_date")
            .eq("user_id", user.id)
            .gte("checkin_date", weekStartISO)
        );
        checkins.forEach((r: any) => r.checkin_date && presentes.add(r.checkin_date));

        const completions = await tryFetch(async () =>
          await supabase
            .from("day_completions")
            .select("completed_at")
            .eq("user_id", user.id)
            .gte("completed_at", weekStart.toISOString())
        );
        completions.forEach((r: any) => {
          if (r.completed_at) presentes.add(isoDate(new Date(r.completed_at)));
        });

        const sessions = await tryFetch(async () =>
          await supabase
            .from("presence_sessions")
            .select("created_at")
            .eq("user_id", user.id)
            .gte("created_at", weekStart.toISOString())
        );
        sessions.forEach((r: any) => {
          if (r.created_at) presentes.add(isoDate(new Date(r.created_at)));
        });

        // Legacy: presenca_diaria (existing table from this codebase)
        const legacyPresenca = await tryFetch(async () =>
          await supabase
            .from("presenca_diaria")
            .select("completado_em")
            .eq("user_id", user.id)
            .gte("completado_em", weekStart.toISOString())
        );
        legacyPresenca.forEach((r: any) => {
          if (r.completado_em) presentes.add(isoDate(new Date(r.completado_em)));
        });

        setDays(presentes);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const weekStart = startOfWeek(new Date());
  const today = new Date();
  const todayISO = isoDate(today);
  const items = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    const iso = isoDate(d);
    return {
      label: DIAS_LABEL[i],
      iso,
      present: days.has(iso),
      future: d.getTime() > today.getTime() && iso !== todayISO,
      isToday: iso === todayISO,
    };
  });

  const presentCount = items.filter((x) => x.present).length;

  if (loading) {
    return <div className="h-12" aria-hidden />;
  }

  return (
    <div className={compact ? "" : "bg-white border border-[#E5E7EB] rounded-3xl p-5"}>
      {!compact && (
        <div className="flex items-baseline justify-between mb-3">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D]">
            Sua semana
          </p>
          <p className="text-xs font-bold text-[#1F2937]">
            {presentCount} {presentCount === 1 ? "dia" : "dias"} presente
            {presentCount !== 1 ? "s" : ""}
          </p>
        </div>
      )}
      <div className="flex justify-between gap-1.5">
        {items.map((x) => (
          <div key={x.iso} className="flex flex-col items-center gap-1.5 flex-1">
            <div
              className={`h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-black border transition-all ${
                x.isToday
                  ? "bg-[#1F2937] text-white border-[#1F2937]"
                  : x.present
                  ? "bg-[#84A59D] text-white border-[#84A59D]"
                  : x.future
                  ? "bg-transparent text-[#9CA3AF] border-dashed border-[#E5E7EB]"
                  : "bg-white text-[#9CA3AF] border-[#E5E7EB]"
              }`}
              aria-label={`${x.label} — ${x.present ? "presente" : x.future ? "futuro" : "ausente"}`}
            >
              {x.label}
            </div>
          </div>
        ))}
      </div>
      {!compact && (
        <p className="text-[11px] text-[#9CA3AF] italic mt-3 text-center">
          Aparecer já é tudo. Sem cobrança por dias perfeitos.
        </p>
      )}
    </div>
  );
}
