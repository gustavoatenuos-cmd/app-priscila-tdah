"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LifeBuoy, X, Target, Play, ShieldCheck, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export function SosModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<"intro" | "breathe" | "task" | "timer" | "success">("intro");
  const [taskName, setTaskName] = useState("");
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutos
  
  // Controle do Timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    if (step === "timer") {
      timerId = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setStep("success");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerId);
  }, [step]);

  const handleOpen = () => {
    setIsOpen(true);
    setStep("intro");
    setTimeLeft(120);
    setTaskName("");
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep("intro");
      setTimeLeft(120);
      setTaskName("");
    }, 500);
  };

  // Funções de formato de tempo
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <>
      {/* O Botão Flutuante SOS */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleOpen}
        className="fixed bottom-8 right-8 h-16 w-16 bg-[#84A59D] rounded-full shadow-lg shadow-[#84A59D]/30 flex items-center justify-center z-40 text-white group"
        aria-label="SOS Destravar"
      >
        <LifeBuoy className="h-7 w-7 group-hover:rotate-12 transition-transform" />
      </motion.button>

      {/* O Painel Imersivo */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#F5F5F0]/95 backdrop-blur-md p-6"
          >
            <button
              onClick={closeModal}
              className="absolute top-8 right-8 text-[#9CA3AF] hover:text-[#333333] transition-colors"
            >
              <X className="h-8 w-8" />
            </button>

            <div className="max-w-xl w-full flex flex-col items-center justify-center text-center">
              
              {/* STEP 1: Introdução */}
              {step === "intro" && (
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}>
                  <div className="h-20 w-20 bg-[#64748B]/10 rounded-full flex items-center justify-center text-[#64748B] mx-auto mb-8">
                     <LifeBuoy className="h-10 w-10" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight mb-4">Acontece nas melhores famílias.</h2>
                  <p className="text-[#64748B] text-lg font-medium mb-10 leading-relaxed max-w-md mx-auto">
                    A montanha parece grande demais agora. Seu cérebro ativou a defesa máxima. Tudo bem. Não precisamos escalar a montanha inteira hoje, nós só vamos apertar o botão de reset.
                  </p>
                  <button onClick={() => setStep("breathe")} className="bg-[#64748B] hover:bg-[#475569] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all transform hover:-translate-y-1">
                     Desativar Alarme Mental 🧘‍♀️
                  </button>
                </motion.div>
              )}

              {/* STEP 2: Exercício Físico */}
              {step === "breathe" && (
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
                  <h2 className="text-2xl font-extrabold text-[#1F2937] tracking-tight mb-16">Sincronize com o círculo</h2>
                  
                  <motion.div 
                    animate={{ scale: [1, 1.8, 1] }} 
                    transition={{ duration: 6, repeat: 3, ease: "easeInOut" }} 
                    onAnimationComplete={() => setTimeout(() => setStep("task"), 1000)}
                    className="w-32 h-32 rounded-full bg-[#84A59D]/20 border-2 border-[#84A59D]"
                  />
                  
                  <p className="text-[#64748B] text-lg font-medium mt-16 animate-pulse">Inspire e expire lentamente... (3 ciclos)</p>
                  
                  <button onClick={() => setStep("task")} className="mt-8 text-[#9CA3AF] text-sm font-bold underline hover:text-[#333333]">
                    Pular respiração
                  </button>
                </motion.div>
              )}

              {/* STEP 3: Decisão */}
              {step === "task" && (
                <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
                  <div className="h-16 w-16 bg-[#84A59D]/10 rounded-2xl flex items-center justify-center text-[#84A59D] mx-auto mb-8">
                     <Target className="h-8 w-8" />
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight mb-4">A Pedra, não a Montanha.</h2>
                  <p className="text-[#64748B] text-lg font-medium mb-8 max-w-md mx-auto">
                    Esqueça o resto. Qual é o primeiro micro passo absoluto que pode ser feito em 2 minutos? (Ex: &quot;Abrir o Word&quot;, &quot;Pegar um copo d&apos;água&quot;, &quot;Ler 1 parágrafo&quot;).
                  </p>
                  
                  <div className="w-full relative">
                    <input 
                      type="text" 
                      value={taskName}
                      onChange={(e) => setTaskName(e.target.value)}
                      placeholder="Minha microação é..." 
                      className="w-full bg-white border-2 border-[#E5E7EB] rounded-2xl p-5 text-xl font-bold text-[#1F2937] focus:outline-none focus:border-[#84A59D] shadow-sm mb-6"
                    />
                  </div>

                  <button 
                     disabled={taskName.trim().length === 0}
                     onClick={() => setStep("timer")} 
                     className="bg-[#84A59D] hover:bg-[#6c8c84] disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-4 w-full rounded-2xl font-bold text-lg shadow-sm transition-all"
                  >
                     Estou com você. Iniciar 2 Minutos.
                  </button>
                </motion.div>
              )}

              {/* STEP 4: TIMER */}
              {step === "timer" && (
                <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center w-full">
                  <span className="text-[#9CA3AF] font-bold tracking-widest uppercase mb-4 text-sm">Apenas isso importa agora</span>
                  <h2 className="text-2xl font-extrabold text-[#333333] mb-12 bg-white px-6 py-4 rounded-xl shadow-sm border border-[#E5E7EB] w-full text-center">
                    &quot;{taskName}&quot;
                  </h2>
                  
                  <div className="text-9xl font-black text-[#1F2937] font-mono tracking-tighter mb-12 tabular-nums">
                    {formatTime(timeLeft)}
                  </div>

                  <button onClick={() => setStep("success")} className="text-xl font-bold text-[#9CA3AF] underline hover:text-[#64748B]">
                    Concluí antes do tempo!
                  </button>
                </motion.div>
              )}

              {/* STEP 5: Vitória */}
              {step === "success" && (
                <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="flex flex-col items-center">
                  <div className="h-24 w-24 bg-[#84A59D]/20 rounded-full flex items-center justify-center text-[#84A59D] mx-auto mb-8 shadow-inner shadow-[#84A59D]/10">
                     <Heart className="h-12 w-12 fill-[#84A59D]" />
                  </div>
                  <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Gelo quebrado.</h2>
                  <p className="text-[#64748B] text-xl font-medium mb-12 max-w-md mx-auto">
                    O primeiro passo foi dado. A inércia acabou! Você pode continuar o embalo de forma gentil ou descansar sabendo que venceu a trava. Sem culpa.
                  </p>
                  
                  <button onClick={closeModal} className="bg-[#64748B] hover:bg-[#475569] text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-sm w-full max-w-sm">
                     Voltar ao meu dia 🌿
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
