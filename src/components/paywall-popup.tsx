"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Lock, Sparkles, X, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { startCheckout } from "@/lib/start-checkout";

interface PaywallPopupProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
}

export function PaywallPopup({ isOpen, onClose, featureName }: PaywallPopupProps) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
    try {
      await startCheckout();
    } catch (error: any) {
      toast.error(error.message || "Erro ao iniciar checkout.");
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ y: 50, scale: 0.95, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 50, scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-white rounded-[2rem] p-8 md:p-10 w-full max-w-lg shadow-2xl relative overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-[#9CA3AF] hover:text-[#1F2937] transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none -translate-y-4 translate-x-4">
              <Lock className="w-48 h-48" />
            </div>

            <div className="relative z-10 text-center space-y-6">
              <div className="mx-auto w-20 h-20 bg-[#1F2937] rounded-3xl flex items-center justify-center shadow-xl mb-6">
                <Lock className="h-10 w-10 text-[#84A59D]" />
              </div>

              <h2 className="text-3xl font-black text-[#1F2937] tracking-tight leading-tight">
                Seu limite grátis no <br />
                <span className="text-[#84A59D]">{featureName}</span> acabou.
              </h2>

              <p className="text-[#64748B] font-medium leading-relaxed max-w-sm mx-auto">
                Para continuar utilizando as ferramentas terapêuticas e de foco ilimitadas,
                torne-se um membro Premium do TDAH Constante.
              </p>

              <div className="bg-[#F8F9FA] rounded-2xl p-5 text-left space-y-3 border border-[#E5E7EB]">
                {[
                  "Módulo Foco Ilimitado",
                  "Diário e Mente (Brain Dump) livre",
                  "Acesso total à Inteligência Artificial",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="h-6 w-6 bg-[#84A59D]/20 rounded-full flex items-center justify-center shrink-0">
                      <Check className="h-3 w-3 text-[#84A59D] font-bold" />
                    </div>
                    <span className="text-sm font-bold text-[#1F2937]">{item}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-[#1F2937] hover:bg-black text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-70"
              >
                {loading ? (
                  "Redirecionando..."
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 text-[#84A59D]" />
                    Desbloquear Acesso Premium
                  </>
                )}
              </button>

              <p className="text-[10px] text-[#9CA3AF] font-semibold uppercase tracking-wider">
                Pagamento seguro e cancelamento fácil.
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
