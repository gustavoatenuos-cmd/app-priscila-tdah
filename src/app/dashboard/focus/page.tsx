"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, Play, Square, Timer, Sidebar as SidebarIcon, Droplet, Wind, Music, Sparkles, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";

export default function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [microStep, setMicroStep] = useState("");
  const [distractions, setDistractions] = useState(0);
  const [selectedTask, setSelectedTask] = useState("");

  const startFocus = () => {
    if (!selectedTask) return alert("Selecione uma tarefa primeiro.");
    setShowRitual(true);
  };

  const completeRitual = () => {
    setShowRitual(false);
    setIsRunning(true);
  };

  const stopFocus = () => {
    setIsRunning(false);
    setShowSummary(true);
  };

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans">
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col min-h-screen">
        <header className="h-20 border-b border-[#E5E7EB] flex items-center px-8 md:px-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
             <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Zona de Fluxo (Deep Work)</h1>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">
           
           <AnimatePresence mode="wait">
             {showSummary ? (
               <motion.div 
                 key="summary-card"
                 initial={{ scale: 0.9, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }} 
                 className="bg-white rounded-[40px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 w-full max-w-xl text-center"
               >
                 <div className="h-20 w-20 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#84A59D]">
                    <CheckCircle2 className="h-10 w-10" />
                 </div>
                 <h2 className="text-3xl font-black text-[#1F2937] mb-2">Sessão Finalizada!</h2>
                 <p className="text-[#64748B] font-medium mb-10 text-lg">Como você se sentiu saindo dessa sessão?</p>
                 
                 <div className="grid grid-cols-3 gap-4 mb-10">
                    <button className="p-4 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-2">
                      <span className="text-2xl">✨</span>
                      <span className="text-[10px] font-black uppercase text-[#9CA3AF]">Leve</span>
                    </button>
                    <button className="p-4 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-2">
                      <span className="text-2xl">⚡</span>
                      <span className="text-[10px] font-black uppercase text-[#9CA3AF]">Focada</span>
                    </button>
                    <button className="p-4 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-2">
                      <span className="text-2xl">😴</span>
                      <span className="text-[10px] font-black uppercase text-[#9CA3AF]">Cansada</span>
                    </button>
                 </div>

                 <button 
                    onClick={() => { setShowSummary(false); setSelectedTask(""); }} 
                    className="w-full bg-[#333333] text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all"
                 >
                    Salvar e Voltar
                 </button>
               </motion.div>
             ) : !showRitual ? (
               <motion.div 
                 key="focus-card"
                 initial={{ scale: 0.95, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }} 
                 exit={{ scale: 0.95, opacity: 0 }}
                 className="flex flex-col items-center w-full max-w-lg"
               >
                 <div className="bg-white rounded-[40px] p-12 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 flex flex-col items-center w-full relative overflow-hidden">
                    <div className="absolute top-6 left-6 h-8 w-8 rounded-full bg-[#64748B]/10 flex items-center justify-center">
                       <Target className="h-4 w-4 text-[#64748B]" />
                    </div>
                    
                    {!isRunning ? (
                      <div className="w-full mb-10">
                        <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-3 text-center">O que vamos focar agora?</label>
                        <select 
                          value={selectedTask}
                          onChange={(e) => setSelectedTask(e.target.value)}
                          className="w-full p-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm font-bold text-[#1F2937] focus:outline-none focus:border-[#64748B]"
                        >
                          <option value="">Selecione uma tarefa...</option>
                          <option value="relatorio">Finalizar Relatório</option>
                          <option value="emails">Responder E-mails</option>
                          <option value="agenda">Planejar Semana</option>
                        </select>
                      </div>
                    ) : (
                      <div className="text-center mb-10">
                        <h3 className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Focando em:</h3>
                        <p className="text-xl font-bold text-[#1F2937]">Finalizar Relatório</p>
                      </div>
                    )}
                    
                    {/* Giant Timer */}
                    <div className={`text-[100px] md:text-[120px] font-mono leading-none tracking-tighter text-[#1F2937] mb-12 flex items-center tabular-nums ${isRunning ? '' : 'opacity-20'}`}>
                      50<span className="text-[#9CA3AF] opacity-50 mx-2 animate-pulse">:</span>00
                    </div>

                    {isRunning && (
                      <div className="w-full mb-10">
                         <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-3 text-center">Seu micro-passo atual:</label>
                         <input 
                           type="text"
                           value={microStep}
                           onChange={(e) => setMicroStep(e.target.value)}
                           placeholder="Ex: Abrir o documento no Chrome"
                           className="w-full p-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm font-medium text-center focus:outline-none"
                         />
                      </div>
                    )}

                    {/* Controls */}
                    <div className="flex items-center gap-6 w-full">
                      {!isRunning ? (
                        <button 
                          onClick={startFocus} 
                          className="w-full bg-[#333333] hover:bg-[#000000] text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-black/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                          <Play className="h-6 w-6" /> Iniciar Sessão
                        </button>
                      ) : (
                        <div className="flex flex-col gap-4 w-full">
                           <button 
                            onClick={stopFocus} 
                            className="w-full bg-[#84A59D] hover:bg-[#6c8c84] text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-[#84A59D]/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                          >
                            <Square className="h-6 w-6" /> Concluir
                          </button>
                          <button 
                            onClick={() => setDistractions(d => d + 1)}
                            className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest hover:text-[#333333] transition-colors"
                          >
                            Fui distraída ({distractions})
                          </button>
                        </div>
                      )}
                    </div>
                 </div>
                 
                 <p className="mt-8 text-[#9CA3AF] font-bold text-center uppercase tracking-widest text-[10px]">Total hoje: <span className="text-[#333333] ml-1">1h 20m</span></p>
               </motion.div>
             ) : (
               <motion.div 
                 key="ritual-card"
                 initial={{ y: 20, opacity: 0 }} 
                 animate={{ y: 0, opacity: 1 }} 
                 exit={{ y: -20, opacity: 0 }}
                 className="bg-white rounded-[40px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 w-full max-w-xl text-center"
               >
                 <div className="h-16 w-16 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#84A59D]">
                    <Sparkles className="h-8 w-8" />
                 </div>
                 <h2 className="text-2xl font-black text-[#1F2937] mb-4">Ritual de Foco (20s)</h2>
                 <p className="text-[#64748B] font-medium mb-10 leading-relaxed">Prepare seu corpo. O ritual reduz a inércia e avisa ao cérebro que agora é hora de fluxo.</p>
                 
                 <div className="grid grid-cols-2 gap-4 mb-10">
                    <RitualOption icon={<Droplet />} label="Água" />
                    <RitualOption icon={<Wind />} label="Respiração" />
                    <RitualOption icon={<Music />} label="Onda Alpha" />
                    <RitualOption icon={<SidebarIcon />} label="Mesa Limpa" />
                 </div>

                 <button 
                    onClick={completeRitual} 
                    className="w-full bg-[#333333] text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-black transition-all"
                 >
                    Estou pronta 🚀
                 </button>
               </motion.div>
             )}
           </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

function RitualOption({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="p-4 rounded-2xl border-2 border-[#E5E7EB] hover:border-[#84A59D] transition-all cursor-pointer flex flex-col items-center gap-3 group">
       <div className="text-[#9CA3AF] group-hover:text-[#84A59D] transition-colors">{icon}</div>
       <span className="text-xs font-bold text-[#64748B] group-hover:text-[#333333] uppercase tracking-wider">{label}</span>
    </div>
  );
}

