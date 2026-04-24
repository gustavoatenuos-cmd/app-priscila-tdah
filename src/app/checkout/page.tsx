"use client";

import { motion } from "framer-motion";
import { CircleCheck, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { supabase } from "@/lib/supabase";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("id", user.id)
          .single();
        if (data?.full_name) {
          setUserName(data.full_name.split(" ")[0]);
        }
      }
    }
    loadUser();
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white rounded-[48px] p-16 shadow-[0_30px_80px_rgba(0,0,0,0.05)] border border-[#E5E7EB]/50 max-w-xl w-full text-center"
      >
        {/* Ícone de sucesso */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", delay: 0.2 }}
          className="h-24 w-24 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto mb-10 text-[#84A59D]"
        >
          <CircleCheck className="h-12 w-12" />
        </motion.div>

        <span className="text-[10px] font-black text-[#84A59D] uppercase tracking-[0.3em] mb-4 block">
          Pagamento Confirmado
        </span>

        <h1 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4 leading-tight">
          {userName ? `${userName}, você é Premium!` : "Você é Premium!"}
        </h1>

        <p className="text-[#64748B] text-lg font-medium leading-relaxed mb-12">
          Seu acesso completo ao TDAH Constante foi liberado. Todos os recursos estão disponíveis agora — sem limites, sem fricção.
        </p>

        {/* O que foi desbloqueado */}
        <div className="bg-[#F9FAFB] rounded-[28px] p-8 text-left mb-12 space-y-4">
          {[
            "Sincronização com Google Agenda",
            "Analytics de Humor e Energia",
            "Sessões de Foco Ilimitadas",
            "Novos Módulos SOS Destravar",
            "Suporte Prioritário por E-mail",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-[#84A59D]/10 flex items-center justify-center shrink-0">
                <Sparkles className="h-3 w-3 text-[#84A59D]" />
              </div>
              <span className="text-sm font-bold text-[#333333]">{item}</span>
            </div>
          ))}
        </div>

        <Link
          href="/dashboard"
          className="w-full bg-[#1F2937] hover:bg-black text-white py-5 rounded-[20px] font-bold text-lg transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
        >
          Ir para o Dashboard <ArrowRight className="h-5 w-5" />
        </Link>

        {sessionId && (
          <p className="mt-6 text-[10px] text-[#9CA3AF] font-mono">
            Ref: {sessionId.slice(0, 20)}...
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#F5F5F0] text-[#64748B] font-bold">Confirmando pagamento...</div>}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
