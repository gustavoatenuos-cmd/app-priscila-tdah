"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RefreshCcw, Heart } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Props = {
  /** Optional visual variant — "inline" for a chip-style button, "bare" for a text link. */
  variant?: "inline" | "bare";
  label?: string;
};

/**
 * "Recomeçar" — soft restart with no negative reset. Just an acknowledgment
 * that the user is back, plus logging for future analytics.
 */
export function RecomecarButton({ variant = "inline", label = "Recomeçar" }: Props) {
  const [open, setOpen] = useState(false);

  async function fire() {
    setOpen(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("recomeco_logs").insert({ user_id: user.id });
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      {variant === "inline" ? (
        <button
          onClick={fire}
          className="inline-flex items-center gap-2 bg-white border border-[#E5E7EB] hover:border-[#84A59D] text-[#1F2937] px-4 py-2 rounded-full text-sm font-bold transition-all"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          {label}
        </button>
      ) : (
        <button
          onClick={fire}
          className="text-sm font-bold text-[#84A59D] hover:text-[#1F2937] inline-flex items-center gap-1"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          {label}
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          >
            <motion.div
              className="bg-[#F5F5F0] rounded-3xl max-w-sm w-full p-8 text-center"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-16 w-16 bg-[#84A59D]/15 rounded-full flex items-center justify-center mx-auto mb-5">
                <Heart className="h-7 w-7 text-[#84A59D]" />
              </div>
              <h3 className="text-2xl font-display font-black text-[#1F2937] mb-3 leading-tight">
                Você voltou.
              </h3>
              <p className="text-[#64748B] leading-relaxed mb-8">
                Não importa quantos dias passaram. Recomeçar é a sua maior habilidade.
                Hoje é o seu dia, do jeito que ele couber.
              </p>
              <button
                onClick={() => setOpen(false)}
                className="bg-[#1F2937] hover:bg-black text-white px-8 py-3 rounded-2xl font-bold w-full"
              >
                Continuar
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
