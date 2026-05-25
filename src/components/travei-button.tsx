"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, X, Timer, Wind, Sparkle } from "lucide-react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type ExitChoice = "um_minuto" | "respirar" | "minimo";

const OPTIONS: { id: ExitChoice; icon: any; title: string; desc: string }[] = [
  {
    id: "um_minuto",
    icon: Timer,
    title: "Começar com 1 minuto",
    desc: "Faça só 60 segundos do que estava travando. Sem mais.",
  },
  {
    id: "respirar",
    icon: Wind,
    title: "Levantar e respirar",
    desc: "Levante. Beba água. Respire fundo 3 vezes. Volte.",
  },
  {
    id: "minimo",
    icon: Sparkle,
    title: "Versão mínima da tarefa",
    desc: "O que daria pra fazer mesmo cansada? Só isso. Hoje basta.",
  },
];

export function TraveiButton() {
  const [open, setOpen] = useState(false);
  const [chosen, setChosen] = useState<ExitChoice | null>(null);
  const pathname = usePathname();

  if (pathname === "/dashboard") return null;

  async function choose(id: ExitChoice) {
    setChosen(id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("travei_logs").insert({
          user_id: user.id,
          exit_chosen: id,
        });
      }
    } catch (e) {
      console.error(e);
    }
  }

  function close() {
    setOpen(false);
    setTimeout(() => setChosen(null), 300);
  }

  return (
    <>
      {/* Floating action button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Travei"
        className="fixed bottom-24 right-5 md:bottom-8 md:right-8 z-40 h-14 w-14 rounded-full bg-[#1F2937] hover:bg-black text-white shadow-2xl flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
      >
        <Zap className="h-6 w-6" />
        <span className="sr-only">Travei</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
          >
            <motion.div
              className="bg-[#F5F5F0] rounded-t-3xl md:rounded-3xl w-full md:max-w-md p-6 md:p-8 max-h-[90vh] overflow-y-auto"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              exit={{ y: 40 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D]">
                  Travei
                </p>
                <button
                  onClick={close}
                  className="text-[#9CA3AF] hover:text-[#1F2937]"
                  aria-label="Fechar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {!chosen ? (
                <>
                  <h2 className="text-xl font-display font-black text-[#1F2937] leading-tight mb-2">
                    Você não está travada.
                  </h2>
                  <p className="text-[#64748B] mb-6 leading-relaxed">
                    Seu cérebro está sobrecarregado. Escolha uma saída e siga só ela.
                  </p>

                  <div className="space-y-3">
                    {OPTIONS.map((o) => (
                      <button
                        key={o.id}
                        onClick={() => choose(o.id)}
                        className="w-full text-left bg-white hover:bg-white/80 border border-[#E5E7EB] hover:border-[#84A59D] rounded-2xl p-4 transition-all flex items-start gap-3"
                      >
                        <div className="h-10 w-10 rounded-xl bg-[#84A59D]/15 flex items-center justify-center shrink-0">
                          <o.icon className="h-5 w-5 text-[#84A59D]" />
                        </div>
                        <div>
                          <p className="font-bold text-[#1F2937] text-sm mb-0.5">
                            {o.title}
                          </p>
                          <p className="text-xs text-[#64748B] leading-relaxed">
                            {o.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-6">
                  <div className="h-16 w-16 bg-[#84A59D]/15 rounded-full flex items-center justify-center mx-auto mb-5">
                    <Sparkle className="h-7 w-7 text-[#84A59D]" />
                  </div>
                  <h3 className="text-xl font-display font-black text-[#1F2937] mb-2">
                    Vai com calma.
                  </h3>
                  <p className="text-[#64748B] mb-8 leading-relaxed max-w-xs mx-auto">
                    {chosen === "um_minuto" && "Só 60 segundos. Quando o minuto acabar, você decide."}
                    {chosen === "respirar" && "Levante agora. Volte quando se sentir um pouco melhor."}
                    {chosen === "minimo" && "Faça a menor versão possível. Pronto. Já valeu o dia."}
                  </p>
                  <button
                    onClick={close}
                    className="bg-[#1F2937] hover:bg-black text-white px-8 py-3 rounded-2xl font-bold"
                  >
                    Fechar
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
