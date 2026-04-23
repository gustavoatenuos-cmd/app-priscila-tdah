"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Home, CheckSquare, Target, BarChart2, BookOpen, Search, Pause, Brain, Zap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sidebar } from "@/components/sidebar";
import { useState } from "react";

export default function NeumorphicDashboard() {
  const currentDate = format(new Date(), "EEEE, MMM dd, yyyy | hh:mm a", { locale: ptBR });
  const [planoB, setPlanoB] = useState(false);

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans selection:bg-[#64748B]/20">
      
      <Sidebar />

      {/* MAIN CONTENT DASHBOARD */}
      <main className="flex-1 px-8 py-10 md:px-14 lg:max-w-7xl mx-auto overflow-y-auto">
         
         <header className="mb-10 flex justify-between items-end">
           <div>
             <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2937] uppercase">Bom dia, Priscila 🌿</h1>
             <p className="text-[#64748B] font-medium text-sm mt-1">Sua mente está calma. {currentDate}</p>
           </div>
           <div className="flex gap-4">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-sm flex flex-col items-center min-w-[80px]">
                 <span className="text-[8px] font-black text-[#9CA3AF] uppercase">Sequência</span>
                 <span className="text-xl font-black text-[#333333]">14 🔥</span>
              </div>
           </div>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT BIG COLUMN */}
            <div className="lg:col-span-8 flex flex-col gap-8">
               
               {/* SEU MELHOR PRÓXIMO PASSO (DYNAMIC) */}
               <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#FFFFFF] rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#84A59D]/20 border-l-[16px] border-l-[#84A59D] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Brain className="h-32 w-32" />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-6">
                     <div className="h-8 w-8 rounded-xl bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
                        <Zap className="h-4 w-4" />
                     </div>
                     <span className="text-[11px] font-black text-[#84A59D] uppercase tracking-widest">Decisão Inteligente</span>
                  </div>

                  <h2 className="text-3xl font-black text-[#1F2937] mb-3 leading-tight">
                    {planoB ? "Vamos fazer apenas 2 minutos de foco?" : "Seu melhor próximo passo"}
                  </h2>
                  <p className="text-[#64748B] font-medium text-lg max-w-xl leading-relaxed">
                    {planoB 
                      ? "Sua energia está baixa, então não force. Um micro-passo agora é melhor do que a paralisia total." 
                      : "Você está em uma boa janela de energia e tem 30 minutos livres. Este é um bom momento para avançar no que mais importa."}
                  </p>

                  <div className="mt-10">
                    <button className="bg-[#333333] hover:bg-black text-white px-8 py-4 rounded-[20px] font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-black/10 flex items-center gap-3">
                      Aceitar Sugestão <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
               </motion.div>

               {/* MONITOR DE DESEMPENHO MINI */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#FFFFFF] rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex flex-col md:flex-row items-center gap-10">
                  {/* Circular Progress SVG */}
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="10" fill="none" />
                       <circle cx="50" cy="50" r="42" stroke="#64748B" strokeWidth="10" fill="none" strokeDasharray="264" strokeDashoffset="66" strokeLinecap="round" />
                     </svg>
                     <div className="absolute flex flex-col items-center">
                       <span className="text-3xl font-black text-[#333333] font-mono tracking-tighter">75%</span>
                       <span className="text-[9px] uppercase font-black text-[#64748B] tracking-widest mt-1">Feito</span>
                     </div>
                  </div>

                  <div className="grid grid-cols-2 gap-8 w-full">
                     <div>
                       <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Tarefas</h3>
                       <span className="text-2xl font-black text-[#333333] font-mono tracking-tighter">12/16</span>
                     </div>
                     <div>
                       <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Foco Real</h3>
                       <span className="text-2xl font-black text-[#333333] font-mono tracking-tighter">180m</span>
                     </div>
                     <div className="col-span-2 pt-4 border-t border-dashed border-[#F1F5F9]">
                        <p className="text-[11px] text-[#64748B] font-medium italic">"Você está acima da média para uma manhã de quarta-feira."</p>
                     </div>
                  </div>
               </motion.div>

               {/* UPCOMING SCHEDULE PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#FFFFFF] rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex-1">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Agenda & Fluxo</h2>
                    <span className="bg-[#84A59D]/10 text-[#84A59D] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Sincronizado</span>
                  </div>
                  
                  <div className="relative pl-8 border-l-2 border-[#F1F5F9] space-y-12 ml-4">
                     {/* Item 1 */}
                     <div className="relative group">
                        <div className="absolute w-5 h-5 rounded-full bg-[#84A59D] -left-[42px] top-1 border-[4px] border-[#FFFFFF] shadow-sm group-hover:scale-125 transition-transform"></div>
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black text-[#9CA3AF] font-mono uppercase tracking-widest leading-none">09:00 - 10:00</span>
                           <span className="text-[16px] font-bold text-[#333333]">Revisar Projeto</span>
                        </div>
                     </div>

                     {/* SUGGESTED WINDOW */}
                     <div className="relative group">
                        <div className="absolute w-5 h-5 rounded-full bg-[#64748B] -left-[42px] top-1 border-[4px] border-[#FFFFFF] shadow-sm ring-4 ring-[#64748B]/10 group-hover:scale-125 transition-transform"></div>
                        <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#64748B]/10">
                           <span className="text-[10px] font-black text-[#64748B] font-mono uppercase tracking-widest block mb-1">Janela Sugerida (60m)</span>
                           <span className="text-[16px] font-bold text-[#1F2937]">Melhor momento para Focar</span>
                           <p className="text-[11px] text-[#64748B] mt-1">Nenhum compromisso detectado até as 12:00.</p>
                        </div>
                     </div>

                     {/* Item 2 */}
                     <div className="relative group opacity-50">
                        <div className="absolute w-5 h-5 rounded-full bg-[#84A59D] -left-[42px] top-1 border-[4px] border-[#FFFFFF] shadow-sm"></div>
                        <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black text-[#9CA3AF] font-mono uppercase tracking-widest leading-none">12:00 - 13:00</span>
                           <span className="text-[16px] font-bold text-[#333333]">Almoço & Descanso</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* RIGHT SMALL COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-8">
               
               {/* 3 PRIORIDADES PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-[#FFFFFF] rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-xl font-black text-[#1F2937] tracking-tight">O Foco de Hoje</h2>
                      <p className="text-xs text-[#9CA3AF] font-bold uppercase mt-1">Três é o número mágico</p>
                    </div>
                    
                    <button 
                      onClick={() => setPlanoB(!planoB)}
                      className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        planoB ? 'bg-orange-100 text-orange-500 border-orange-200' : 'bg-[#F1F5F9] text-[#9CA3AF] border-transparent'
                      }`}
                    >
                      Mudar para Plano B
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                     <PrioridadeItem index={1} label="Essencial" title={planoB ? "Ver 1 aba do relatório" : "Finalizar Relatório"} completed={true} />
                     <PrioridadeItem index={2} label="Importante" title={planoB ? "Responder 1 e-mail" : "Enviar E-mails"} completed={true} />
                     <PrioridadeItem index={3} label="Opcional" title={planoB ? "Apenas abrir a agenda" : "Planejar Semana"} completed={false} />
                  </div>

                  <div className="mt-10 pt-8 border-t border-[#F1F5F9] text-center">
                    <p className="text-[#64748B] text-sm font-medium italic">
                       {planoB ? "✨ Hoje o mínimo é o seu 100%. Sem culpa." : "✨ Focar em 3 coisas te dá liberdade, não limite."}
                    </p>
                  </div>
               </motion.div>

               {/* FOCUS SESSION PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#FFFFFF] rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Deep Work</h2>
                    <span className="text-[#9CA3AF] tracking-widest font-bold">•••</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <button className="w-full bg-[#64748B] hover:bg-[#475569] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all shadow-md shadow-[#64748B]/20">
                      Iniciar / Parar
                    </button>
                    
                    <div className="mt-6 text-center">
                      <span className="text-3xl font-black text-[#333333] font-mono">00:45:00</span>
                      <span className="text-sm font-bold text-[#9CA3AF] font-mono ml-2">/ 01:00:00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#E5E7EB]/50">
                     <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Foco Isolado</span>
                     <div className="h-6 w-10 bg-[#64748B] rounded-full p-1 flex justify-end items-center cursor-pointer">
                        <div className="h-4 w-4 bg-white rounded-full"></div>
                     </div>
                  </div>
               </motion.div>

               {/* WELLNESS CHECK PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-[#FFFFFF] rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Energia & Bem-estar</h2>
                    <Sparkles className="h-5 w-5 text-[#84A59D]" />
                  </div>

                  <div className="space-y-6">
                     <WellnessBar label="Hidratação" value="80%" desc="Você está quase na meta de hoje." />
                     <WellnessBar label="Descanso" value="65%" desc="A qualidade do sono foi moderada." />
                     <WellnessBar label="Humor" value="40%" desc="Detectamos sinais de sobrecarga." />
                  </div>
               </motion.div>

            </div>
         </div>
      </main>
    </div>
  );
}

function WellnessBar({ label, value, desc }: { label: string, value: string, desc: string }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-[#333333]">{label}</span>
        <span className="text-xs font-black text-[#84A59D]">{value}</span>
      </div>
      <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
         <div className="h-full bg-[#84A59D] transition-all duration-1000" style={{ width: value }}></div>
      </div>
      <p className="text-[10px] font-medium text-[#9CA3AF]">{desc}</p>
    </div>
  );
}

function PrioridadeItem({ index, label, title, completed }: { index: number, label: string, title: string, completed: boolean }) {
  return (
    <div className={`flex items-center gap-5 p-5 rounded-[24px] transition-all border ${completed ? 'bg-[#F9FAFB] border-transparent opacity-60' : 'bg-white border-[#E5E7EB]/30 shadow-sm'}`}>
       <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black border-2 shrink-0 ${completed ? 'bg-[#84A59D] border-[#84A59D] text-white' : 'border-[#E5E7EB] text-[#9CA3AF]'}`}>
          {completed ? <CheckCircle2 className="h-5 w-5" /> : index}
       </div>
       <div className="flex-1">
         <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] block mb-1">{label}</span>
         <span className={`text-[16px] font-bold ${completed ? 'text-[#9CA3AF] line-through' : 'text-[#333333]'}`}>
           {title}
         </span>
       </div>
    </div>
  );
}
