"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, Play, Square, Timer, Sidebar as SidebarIcon, Droplet, Wind, Music, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";

export default function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const [ritualCompleted, setRitualCompleted] = useState(false);

  const startFocus = () => {
    if (!ritualCompleted) {
      setShowRitual(true);
    } else {
      setIsRunning(true);
    }
  };

  const completeRitual = () => {
    setShowRitual(false);
    setRitualCompleted(true);
    setIsRunning(true);
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
             {!showRitual ? (
               <motion.div 
                 key="focus-card"
                 initial={{ scale: 0.95, opacity: 0 }} 
                 animate={{ scale: 1, opacity: 1 }} 
                 exit={{ scale: 0.95, opacity: 0 }}
                 className="flex flex-col items-center w-full max-w-lg"
               >
                 <div className="bg-white rounded-[40px] p-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 flex flex-col items-center w-full relative overflow-hidden">
                    <div className="absolute top-6 left-6 h-8 w-8 rounded-full bg-[#64748B]/10 flex items-center justify-center">
                       <Target className="h-4 w-4 text-[#64748B]" />
                    </div>
                    
                    <h3 className="text-xs font-bold text-[#9CA3AF] tracking-widest uppercase mb-12">Otimização de Campanhas</h3>
                    
                    {/* Giant Timer */}
                    <div className="text-[100px] md:text-[120px] font-mono leading-none tracking-tighter text-[#1F2937] mb-16 flex items-center tabular-nums">
                      50<span className="text-[#9CA3AF] opacity-50 mx-2 animate-pulse">:</span>00
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-6 w-full">
                      {!isRunning ? (
                        <button 
                          onClick={startFocus} 
                          className="w-full bg-[#333333] hover:bg-[#000000] text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-black/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                          <Play className="h-6 w-6" /> Iniciar Foco
                        </button>
                      ) : (
                        <button 
                          onClick={() => setIsRunning(false)} 
                          className="w-full bg-[#84A59D] hover:bg-[#6c8c84] text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-[#84A59D]/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                          <Square className="h-6 w-6" /> Interromper
                        </button>
                      )}
                    </div>
                 </div>
                 
                 <p className="mt-8 text-[#9CA3AF] font-bold text-center uppercase tracking-widest text-[10px]">Tempo total hoje: <span className="text-[#333333] ml-1">1h 20m</span></p>
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
                 <h2 className="text-2xl font-black text-[#1F2937] mb-4">Ritual de Entrada</h2>
                 <p className="text-[#64748B] font-medium mb-10">Prepare seu corpo e mente para o fluxo. Escolha um pequeno gesto:</p>
                 
                 <div className="grid grid-cols-2 gap-4 mb-10">
                    <RitualOption icon={<Droplet />} label="Beber Água" />
                    <RitualOption icon={<Wind />} label="3 Respirações" />
                    <RitualOption icon={<Music />} label="Som Ambiente" />
                    <RitualOption icon={<SidebarIcon />} label="Organizar Mesa" />
                 </div>

                 <button 
                    onClick={completeRitual} 
                    className="w-full bg-[#333333] text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-black transition-all"
                 >
                    Começar Agora 🚀
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

