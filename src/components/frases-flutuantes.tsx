"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import { FRASES_ACOLHIMENTO } from "@/lib/frases-data";

const STORAGE_KEY = "tc_last_frase_at";
const MIN_GAP_MINUTES = 90;          // não aparece mais de uma vez a cada 90 min
const FIRST_DELAY_SECONDS = 45;      // delay após carregar a página
const VISIBLE_SECONDS = 9;

/**
 * "Frases flutuantes" — small accent reminders that pop up gently in the
 * corner. They're never blocking, never sound, and respect a cooldown across
 * the whole session (per-browser, via localStorage) to avoid being annoying.
 */
export function FrasesFlutuantes() {
  const [visible, setVisible] = useState(false);
  const [frase, setFrase] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const last = Number(window.localStorage.getItem(STORAGE_KEY) ?? "0");
    const gapMs = MIN_GAP_MINUTES * 60 * 1000;
    if (Date.now() - last < gapMs) return;

    const showTimer = setTimeout(() => {
      const idx = Math.floor(Math.random() * FRASES_ACOLHIMENTO.length);
      setFrase(FRASES_ACOLHIMENTO[idx]);
      setVisible(true);
      window.localStorage.setItem(STORAGE_KEY, String(Date.now()));
    }, FIRST_DELAY_SECONDS * 1000);

    return () => clearTimeout(showTimer);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const hideTimer = setTimeout(() => setVisible(false), VISIBLE_SECONDS * 1000);
    return () => clearTimeout(hideTimer);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-44 left-5 right-5 md:left-auto md:right-8 md:bottom-28 md:max-w-xs z-30"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white border border-[#E5E7EB] rounded-3xl shadow-lg p-4 pr-9 flex items-start gap-3 relative">
            <div className="h-8 w-8 rounded-xl bg-[#84A59D]/15 flex items-center justify-center shrink-0">
              <Sparkles className="h-4 w-4 text-[#84A59D]" />
            </div>
            <p className="text-sm text-[#1F2937] leading-snug italic">{frase}</p>
            <button
              aria-label="Fechar"
              onClick={() => setVisible(false)}
              className="absolute top-2 right-2 text-[#9CA3AF] hover:text-[#1F2937]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
