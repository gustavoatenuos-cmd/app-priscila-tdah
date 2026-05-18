"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie } from "lucide-react";

const STORAGE_KEY = "tc_consent_v1";

type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decided_at: string;
};

export function ConsentBanner() {
  const [open, setOpen] = useState(false);
  const [granular, setGranular] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) setOpen(true);
  }, []);

  function persist(state: ConsentState) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setOpen(false);
  }

  function acceptAll() {
    persist({ necessary: true, analytics: true, marketing: true, decided_at: new Date().toISOString() });
  }

  function rejectOptional() {
    persist({ necessary: true, analytics: false, marketing: false, decided_at: new Date().toISOString() });
  }

  function saveGranular() {
    persist({ necessary: true, analytics, marketing, decided_at: new Date().toISOString() });
  }

  if (!open) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-[100] bg-white border border-[#E5E7EB] shadow-2xl rounded-3xl p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 bg-[#84A59D]/15 rounded-2xl flex items-center justify-center shrink-0">
          <Cookie className="h-5 w-5 text-[#84A59D]" />
        </div>
        <div>
          <h3 className="text-base font-display font-black text-[#1F2937] mb-1">
            A gente respeita seus dados
          </h3>
          <p className="text-sm text-[#64748B] leading-relaxed">
            Usamos cookies necessários para o app funcionar, e cookies opcionais só com seu
            ok — para entender o uso e melhorar a experiência. Veja nossa{" "}
            <Link href="/legal/privacidade" className="text-[#84A59D] font-bold underline">
              política de privacidade
            </Link>
            .
          </p>
        </div>
      </div>

      {granular && (
        <div className="space-y-3 mb-4 pl-1">
          <label className="flex items-start gap-3 text-sm">
            <input type="checkbox" checked disabled className="mt-1" />
            <span><strong>Necessários</strong> — autenticação, RLS, segurança. Sempre ativos.</span>
          </label>
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1" />
            <span><strong>Medição de produto</strong> — métricas anônimas para entender como o app é usado.</span>
          </label>
          <label className="flex items-start gap-3 text-sm cursor-pointer">
            <input type="checkbox" checked={marketing} onChange={(e) => setMarketing(e.target.checked)} className="mt-1" />
            <span><strong>Comunicação</strong> — e-mails opcionais com novidades e dicas.</span>
          </label>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        {granular ? (
          <button
            onClick={saveGranular}
            className="flex-1 bg-[#1F2937] hover:bg-black text-white px-4 py-3 rounded-2xl font-bold text-sm transition-all"
          >
            Salvar preferências
          </button>
        ) : (
          <>
            <button
              onClick={acceptAll}
              className="flex-1 bg-[#1F2937] hover:bg-black text-white px-4 py-3 rounded-2xl font-bold text-sm transition-all"
            >
              Aceitar tudo
            </button>
            <button
              onClick={rejectOptional}
              className="flex-1 bg-white border border-[#E5E7EB] hover:border-[#1F2937] text-[#1F2937] px-4 py-3 rounded-2xl font-bold text-sm transition-all"
            >
              Só o necessário
            </button>
          </>
        )}
        <button
          onClick={() => setGranular((v) => !v)}
          className="text-xs font-bold uppercase tracking-widest text-[#9CA3AF] hover:text-[#1F2937] px-2 py-1"
        >
          {granular ? "Voltar" : "Personalizar"}
        </button>
      </div>
    </div>
  );
}

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ConsentState) : null;
  } catch {
    return null;
  }
}
