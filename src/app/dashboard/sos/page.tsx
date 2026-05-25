"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Zap, Loader2, RotateCcw } from "lucide-react";
import Link from "next/link";

export default function SOSPage() {
  const [step, setStep] = useState(0);
  const [task, setTask] = useState("");
  const [microSteps, setMicroSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleBreakdown = async () => {
    if (!task.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: `Estou travado e preciso de ajuda com isso: "${task}". Me dá exatamente 3 micro-passos ridiculamente pequenos para começar. Cada passo deve levar menos de 2 minutos. Responda APENAS com os 3 passos numerados, sem introdução.`,
          history: [],
        }),
      });

      const data = await res.json();

      if (data.response) {
        const linhas = data.response
          .split("\n")
          .map((l: string) => l.replace(/^[\d\.\-\*]+\s*/, "").trim())
          .filter((l: string) => l.length > 5)
          .slice(0, 3);

        setMicroSteps(linhas.length >= 2 ? linhas : [
          "Abrir o arquivo ou ferramenta necessária",
          "Fazer apenas a primeira ação por 2 minutos",
          "Parar e celebrar ter começado",
        ]);
      }
    } catch {
      setMicroSteps([
        "Abrir o arquivo ou ferramenta necessária",
        "Fazer apenas a primeira ação por 2 minutos",
        "Parar e celebrar ter começado",
      ]);
    } finally {
      setLoading(false);
      setStep(2);
    }
  };

  const reiniciar = () => {
    setStep(0);
    setTask("");
    setMicroSteps([]);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-8 min-h-screen">
      <AnimatePresence mode="wait">

        {/* Step 0 — Acolhimento */}
        {step === 0 && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl text-center"
          >
            <div className="h-20 w-20 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="h-10 w-10 text-[#84A59D]" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#1F2937] mb-6">
              Está tudo bem travar.
            </h1>
            <p className="text-[#64748B] text-lg font-medium mb-4 leading-relaxed">
              Seu cérebro só está precisando de um caminho mais simples agora.
              Vamos encontrar a primeira peça do quebra-cabeça juntos?
            </p>
            <p className="text-[#9CA3AF] text-sm font-medium mb-10 leading-relaxed max-w-lg mx-auto">
              O SOS usa IA para transformar qualquer tarefa assustadora em
              micro-passos tão pequenos que é impossível não começar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => setStep(1)}
                className="bg-[#1F2937] text-white px-10 py-5 rounded-[24px] font-bold text-lg shadow-xl shadow-black/10 hover:bg-black transition-all"
              >
                Sim, me ajude a começar
              </button>
              <Link href="/dashboard">
                <button className="bg-white text-[#64748B] px-10 py-5 rounded-[24px] font-bold text-lg border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-all w-full">
                  Só quero descansar agora
                </button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Step 1 — Identificação */}
        {step === 1 && (
          <motion.div
            key="input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl w-full"
          >
            <h2 className="text-2xl md:text-3xl font-black text-[#1F2937] mb-4">
              Qual é o grande &quot;monstro&quot; hoje?
            </h2>
            <p className="text-[#64748B] text-lg font-medium mb-8">
              Escreva apenas uma coisa que está te dando ansiedade.
            </p>
            <input
              type="text"
              placeholder="Ex: Responder os e-mails acumulados..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !loading && task.trim() && handleBreakdown()}
              autoFocus
              className="w-full bg-white border-2 border-[#E5E7EB] p-5 rounded-[20px] text-lg font-bold text-[#1F2937] focus:border-[#84A59D] focus:outline-none mb-6"
            />
            <button
              disabled={!task.trim() || loading}
              onClick={handleBreakdown}
              className="w-full bg-[#84A59D] text-white py-5 rounded-[20px] font-bold text-lg shadow-lg shadow-[#84A59D]/20 hover:bg-[#6c8c84] disabled:opacity-30 transition-all flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  A IA está quebrando sua tarefa...
                </>
              ) : (
                <>
                  Vamos diminuir isso <Zap className="h-5 w-5" />
                </>
              )}
            </button>
            <button
              onClick={() => setStep(0)}
              className="w-full mt-3 text-[#9CA3AF] text-sm font-medium py-2 hover:text-[#64748B] transition-colors"
            >
              ← Voltar
            </button>
          </motion.div>
        )}

        {/* Step 2 — Micro-passos gerados pela IA */}
        {step === 2 && (
          <motion.div
            key="breakdown"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl w-full"
          >
            <p className="text-xs font-black uppercase tracking-widest text-[#84A59D] mb-3 text-center">
              A IA analisou sua tarefa
            </p>
            <h2 className="text-2xl md:text-3xl font-black text-[#1F2937] mb-2 text-center italic">
              &quot;{task}&quot;
            </h2>
            <h3 className="text-base font-bold text-[#64748B] mb-10 text-center">
              é grande demais. Aqui estão os 3 primeiros passos ridículos:
            </h3>

            <div className="space-y-4">
              {microSteps.map((texto, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.12 }}
                  whileHover={{ x: 6 }}
                  className="bg-white p-5 rounded-[24px] border border-[#E5E7EB] shadow-sm flex items-center gap-5"
                >
                  <div className="h-9 w-9 rounded-full bg-[#84A59D]/10 text-[#84A59D] flex items-center justify-center font-black text-base shrink-0">
                    {i + 1}
                  </div>
                  <span className="text-base font-bold text-[#1F2937] leading-snug">
                    {texto}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 flex flex-col items-center gap-4">
              <p className="text-[#9CA3AF] font-medium text-sm">
                Consegue fazer o passo 1 agora?
              </p>
              <Link href="/dashboard" className="w-full max-w-xs">
                <button className="w-full bg-[#1F2937] text-white px-10 py-5 rounded-[28px] font-bold text-lg shadow-2xl hover:scale-105 transition-all">
                  Vou fazer o passo 1! 🚀
                </button>
              </Link>
              <button
                onClick={reiniciar}
                className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#64748B] transition-colors font-medium"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Tentar com outra tarefa
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
