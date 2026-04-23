"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, Home, CheckSquare, Target, BarChart2, BookOpen, Search, Pause, Brain, Zap } from "lucide-react";
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
         
         <header className="mb-10">
           <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2937] uppercase">Dashboard de Produtividade</h1>
           <p className="text-[#64748B] font-medium text-sm mt-1">{currentDate}</p>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT BIG COLUMN */}
            <div className="lg:col-span-8 flex flex-col gap-8">
               
               {/* PRÓXIMA MELHOR AÇÃO (DYNAMIC) */}
               <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#FFFFFF] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.02)] border border-[#84A59D]/20 border-l-[12px] border-l-[#84A59D] relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                     <Brain className="h-24 w-24" />
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                     <div className="h-8 w-8 rounded-xl bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
                        <Zap className="h-4 w-4" />
                     </div>
                     <span className="text-[10px] font-black text-[#84A59D] uppercase tracking-widest">Recomendado Agora</span>
                  </div>

                  <h2 className="text-2xl font-black text-[#1F2937] mb-2 leading-tight">
                    {planoB ? "Vamos fazer apenas 2 minutos de foco?" : "Hora de revisar o projeto plan."}
                  </h2>
                  <p className="text-[#64748B] font-medium text-sm max-w-md">
                    {planoB 
                      ? "Sua energia está baixa, então não force. Um micro-passo é melhor que paralisia." 
                      : "Sua energia está alta agora e você não tem nada agendado pelos próximos 30 minutos."}
                  </p>

                  <div className="mt-8">
                    <button className="bg-[#333333] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-black/10">
                      Aceitar Sugestão
                    </button>
                  </div>
               </motion.div>

               {/* DAILY FOCUS PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#FFFFFF] rounded-3xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Foco Diário</h2>
                    <span className="text-[#9CA3AF] tracking-widest font-bold">•••</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-12">
                     {/* Circular Progress SVG */}
                     <div className="relative w-40 h-40 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#F1F5F9" strokeWidth="12" fill="none" />
                          <circle cx="50" cy="50" r="40" stroke="#64748B" strokeWidth="12" fill="none" strokeDasharray="251" strokeDashoffset="62" strokeLinecap="round" />
                        </svg>
                        <div className="absolute flex flex-col items-center">
                          <span className="text-3xl font-extrabold text-[#333333] font-mono tracking-tighter">75%</span>
                          <span className="text-[10px] uppercase font-bold text-[#64748B] tracking-wider">Concluído</span>
                        </div>
                     </div>

                     {/* Stats */}
                     <div className="flex flex-col gap-6">
                        <div>
                          <h3 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">Tarefas Feitas:</h3>
                          <span className="text-3xl font-black text-[#333333] font-mono tracking-tighter">12/16</span>
                        </div>
                        <div>
                          <h3 className="text-[11px] font-bold text-[#9CA3AF] uppercase tracking-widest">Minutos de Foco:</h3>
                          <span className="text-3xl font-black text-[#333333] font-mono tracking-tighter">180m</span>
                        </div>
                     </div>
                  </div>
               </motion.div>

               {/* UPCOMING SCHEDULE PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#FFFFFF] rounded-3xl p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex-1">
                  <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase mb-8">Agenda do Dia</h2>
                  
                  <div className="relative pl-6 border-l-2 border-[#E5E7EB] space-y-10 ml-4">
                     {/* Item 1 */}
                     <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-[#84A59D] -left-[35px] top-1 border-[4px] border-[#FFFFFF] shadow-sm"></div>
                        <div className="flex items-center gap-6">
                           <span className="text-sm font-bold text-[#9CA3AF] w-20 font-mono">9:00 AM</span>
                           <span className="text-[15px] font-bold text-[#333333]">Revisar Projeto</span>
                        </div>
                     </div>

                     {/* Item 2 */}
                     <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-[#64748B] -left-[35px] top-1 border-[4px] border-[#FFFFFF] shadow-sm"></div>
                        <div className="flex items-center gap-6">
                           <span className="text-sm font-bold text-[#9CA3AF] w-20 font-mono">10:30 AM</span>
                           <span className="text-[15px] font-bold text-[#333333]">Sessão de Foco</span>
                        </div>
                     </div>

                     {/* Item 3 */}
                     <div className="relative">
                        <div className="absolute w-4 h-4 rounded-full bg-[#84A59D] -left-[35px] top-1 border-[4px] border-[#FFFFFF] shadow-sm"></div>
                        <div className="flex items-center gap-6">
                           <span className="text-sm font-bold text-[#9CA3AF] w-20 font-mono">12:00 PM</span>
                           <span className="text-[15px] font-bold text-[#333333]">Alinhamento</span>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* RIGHT SMALL COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-8">
               
               {/* 3 PRIORIDADES PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-[#FFFFFF] rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">As 3 Prioridades</h2>
                      <p className="text-[10px] text-[#9CA3AF] font-bold uppercase mt-1">Menos é Mais</p>
                    </div>
                    
                    <button 
                      onClick={() => setPlanoB(!planoB)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        planoB ? 'bg-orange-100 text-orange-500 border-orange-200' : 'bg-[#F1F5F9] text-[#9CA3AF] border-transparent'
                      } border`}
                    >
                      Plano B {planoB ? 'Ativo' : 'Desligado'}
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                     <PrioridadeItem index={1} title={planoB ? "Ver 1 aba do relatório" : "Finalizar Relatório"} completed={true} />
                     <PrioridadeItem index={2} title={planoB ? "Responder 1 e-mail" : "Enviar E-mails"} completed={true} />
                     <PrioridadeItem index={3} title={planoB ? "Apenas abrir a agenda" : "Planejar Semana"} completed={false} />
                  </div>

                  <div className="mt-8 pt-6 border-t border-[#F1F5F9] text-center">
                    {planoB ? (
                      <p className="text-orange-400 text-xs font-bold italic">"Hoje o mínimo é o seu 100%. Sem culpa."</p>
                    ) : (
                      <p className="text-[#64748B] text-xs font-semibold italic">"Focar em 3 coisas te dá liberdade, não limite."</p>
                    )}
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
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-[#FFFFFF] rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Bem-Estar</h2>
                    <span className="text-[#9CA3AF] tracking-widest font-bold">•••</span>
                  </div>

                  <div className="space-y-4">
                     <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#333333]">Hidratação</span>
                        <div className="w-24 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                           <div className="h-full bg-[#84A59D] w-[60%]"></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#333333]">Passos</span>
                        <div className="w-24 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                           <div className="h-full bg-[#84A59D] w-[80%]"></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#333333]">Humor</span>
                        <div className="w-24 h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                           <div className="h-full bg-[#84A59D] w-[40%]"></div>
                        </div>
                     </div>
                  </div>
               </motion.div>

            </div>
         </div>
      </main>
    </div>
  );
}

function PrioridadeItem({ index, title, completed }: { index: number, title: string, completed: boolean }) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-2xl transition-all ${completed ? 'bg-[#F9FAFB] opacity-60' : 'bg-white'}`}>
       <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${completed ? 'bg-[#84A59D] border-[#84A59D] text-white' : 'border-[#E5E7EB] text-[#9CA3AF]'}`}>
          {completed ? <CheckCircle2 className="h-4 w-4" /> : index}
       </div>
       <span className={`text-[14px] font-bold flex-1 ${completed ? 'text-[#9CA3AF] line-through' : 'text-[#333333]'}`}>
         {title}
       </span>
    </div>
  );
}
