"use client";

import { motion } from "framer-motion";
import { Check, Sparkles, Zap, Shield, Heart } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

export default function PricingPage() {
  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col items-center py-20 px-8">
        <div className="max-w-4xl w-full text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <span className="text-[#84A59D] font-black tracking-[0.3em] uppercase text-[10px] mb-4 block">Investimento em você</span>
             <h1 className="text-5xl font-black text-[#1F2937] tracking-tight mb-6">A constância não precisa ser cara, mas precisa ser protegida.</h1>
             <p className="text-[#64748B] text-xl font-medium max-w-2xl mx-auto">
               Escolha o plano que melhor se adapta ao seu momento. Comece a construir uma rotina sem culpa hoje.
             </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full px-4">
           {/* Free Plan */}
           <motion.div 
             initial={{ opacity: 0, x: -20 }} 
             animate={{ opacity: 1, x: 0 }} 
             className="bg-white rounded-[40px] p-10 border border-[#E5E7EB] shadow-[0_10px_40px_rgba(0,0,0,0.02)] flex flex-col"
           >
              <h2 className="text-xl font-black text-[#64748B] uppercase tracking-widest mb-2">Modo Grátis</h2>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-[#1F2937]">R$ 0</span>
                <span className="text-[#9CA3AF] font-bold">/sempre</span>
              </div>
              
              <div className="space-y-4 mb-12 flex-1">
                 <FeatureItem text="Planner 1-2-3 Essencial" />
                 <FeatureItem text="Brain Dump (Descarrego)" />
                 <FeatureItem text="Journal de Gratidão" />
                 <FeatureItem text="Até 5 sessões de foco/dia" />
              </div>

              <Link href="/dashboard" className="w-full py-4 rounded-2xl border-2 border-[#E5E7EB] text-[#64748B] font-bold text-center hover:bg-[#F9FAFB] transition-all">
                 Continuar Grátis
              </Link>
           </motion.div>

           {/* Premium Plan */}
           <motion.div 
             initial={{ opacity: 0, x: 20 }} 
             animate={{ opacity: 1, x: 0 }} 
             className="bg-white rounded-[40px] p-10 border-2 border-[#84A59D] shadow-[0_25px_60px_rgba(132,165,157,0.1)] flex flex-col relative overflow-hidden"
           >
              <div className="absolute top-0 right-0 bg-[#84A59D] text-white px-6 py-2 rounded-bl-2xl font-black text-[10px] uppercase tracking-widest">
                 Mais Recomendado
              </div>

              <h2 className="text-xl font-black text-[#84A59D] uppercase tracking-widest mb-2">Modo Premium</h2>
              <div className="flex items-baseline gap-1 mb-8">
                <span className="text-4xl font-black text-[#1F2937]">R$ 29</span>
                <span className="text-[#9CA3AF] font-bold">/mês</span>
              </div>
              
              <div className="space-y-4 mb-12 flex-1">
                 <FeatureItem text="Acesso Ilimitado a tudo" active />
                 <FeatureItem text="Sincronização Google Agenda" active />
                 <FeatureItem text="Analytics de Humor e Energia" active />
                 <FeatureItem text="Novos Módulos SOS Destravar" active />
                 <FeatureItem text="Suporte Prioritário por E-mail" active />
              </div>

              <button 
                onClick={async () => {
                  try {
                    const res = await fetch("/api/checkout", { method: "POST" });
                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      toast.error("Erro ao iniciar checkout: " + (data.error || "Tente novamente."));
                    }
                  } catch (err) {
                    toast.error("Erro de conexão com o servidor.");
                  }
                }}
                className="w-full py-4 rounded-2xl bg-[#1F2937] text-white font-bold text-center shadow-xl shadow-black/10 hover:bg-black transition-all flex items-center justify-center gap-2"
              >
                 <Sparkles className="h-4 w-4" /> Assinar Premium
              </button>
           </motion.div>
        </div>

        <p className="mt-12 text-[#9CA3AF] text-sm font-medium flex items-center gap-2">
           <Shield className="h-4 w-4" /> Pagamento Seguro via Stripe. Cancele quando quiser.
        </p>
      </main>
    </div>
  );
}

function FeatureItem({ text, active = false }: { text: string; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
       <div className={`h-5 w-5 rounded-full flex items-center justify-center ${active ? 'bg-[#84A59D]/10 text-[#84A59D]' : 'bg-[#F9FAFB] text-[#9CA3AF]'}`}>
          <Check className="h-3 w-3" />
       </div>
       <span className={`text-sm font-bold ${active ? 'text-[#333333]' : 'text-[#64748B]'}`}>{text}</span>
    </div>
  );
}

import { toast } from "sonner";
