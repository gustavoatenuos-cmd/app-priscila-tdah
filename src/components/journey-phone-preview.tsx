"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Battery, Wind, Target, Zap, Coffee, LineChart, Brain, CheckCircle2, Circle, Clock, ArrowRight, Frown, Meh, Smile } from "lucide-react";

interface PhonePreviewProps {
  activeIndex: number;
}

const UI_STATES = [
  {
    icon: Battery,
    title: "Check-in",
    content: (
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-black text-[#1F2937] leading-tight">Como está sua energia agora?</h4>
        <div className="flex justify-between items-center bg-[#F5F5F0] p-3 rounded-2xl border border-[#E5E7EB]">
          <div className="flex flex-col items-center gap-1 opacity-50"><Frown size={20} className="text-[#64748B]"/><span className="text-[9px] font-bold">Baixa</span></div>
          <div className="flex flex-col items-center gap-1"><Meh size={24} className="text-[#84A59D] drop-shadow-sm"/><span className="text-[10px] font-black text-[#84A59D]">Média</span></div>
          <div className="flex flex-col items-center gap-1 opacity-50"><Smile size={20} className="text-[#64748B]"/><span className="text-[9px] font-bold">Alta</span></div>
        </div>
        <div className="space-y-2 pt-2">
          <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-wider">Humor principal</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-[#84A59D] text-white text-[10px] px-3 py-1.5 rounded-full font-bold shadow-sm">Sobrecarregada</span>
            <span className="bg-white border border-[#E5E7EB] text-[#64748B] text-[10px] px-3 py-1.5 rounded-full font-bold">Ansiosa</span>
            <span className="bg-white border border-[#E5E7EB] text-[#64748B] text-[10px] px-3 py-1.5 rounded-full font-bold">Aérea</span>
          </div>
        </div>
        <button className="w-full mt-4 bg-[#1F2937] text-white rounded-xl py-3 text-[11px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-[#1F2937]/20">
          Iniciar Dia <ArrowRight size={14} />
        </button>
      </div>
    )
  },
  {
    icon: Wind,
    title: "Descarrego",
    content: (
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-black text-[#1F2937] leading-tight">Esvazie a mente</h4>
        <p className="text-[10px] text-[#64748B] leading-relaxed">Não julgue, apenas anote tudo que está zumbindo na sua cabeça.</p>
        
        <div className="h-32 bg-[#FAF9F6] rounded-2xl p-4 border border-[#E5E7EB] relative shadow-inner">
          <p className="text-[11px] text-[#1F2937] italic leading-relaxed">
            Preciso marcar o dentista. Responder o email do João. Comprar ração pro gato. Será que esqueci de pagar a luz? Ligar pra mãe. Terminar o relatório de ontem...
          </p>
          <div className="absolute bottom-3 right-3 text-[9px] font-bold text-[#9CA3AF]">
            Digitando...
          </div>
        </div>

        <div className="flex gap-2">
          <button className="flex-1 bg-[#84A59D] text-white rounded-xl py-3 text-[11px] font-black shadow-md">
            Salvar Tudo
          </button>
          <button className="w-12 bg-[#F3E8E6] text-[#1F2937] rounded-xl flex items-center justify-center">
            <Wind size={16} />
          </button>
        </div>
      </div>
    )
  },
  {
    icon: Target,
    title: "Top 3 do Dia",
    content: (
      <div className="space-y-3 pt-2">
        <h4 className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-3">O Essencial de Hoje</h4>
        
        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-3 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-[#84A59D] mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-[#1F2937] line-through opacity-50">Enviar relatório parcial</p>
          </div>
        </div>

        <div className="bg-[#FAF9F6] rounded-xl shadow-sm border-2 border-[#84A59D] p-3 flex items-start gap-3">
          <Circle size={18} className="text-[#84A59D] mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-bold text-[#1F2937]">Marcar consulta médica</p>
            <p className="text-[10px] text-[#64748B] mt-1">Tempo est: 15 min</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-[#E5E7EB] p-3 flex items-start gap-3">
          <Circle size={18} className="text-[#D1D5DB] mt-0.5 shrink-0" />
          <div>
            <p className="text-[12px] font-medium text-[#475569]">Pagar contas de luz e net</p>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: Zap,
    title: "Em Foco",
    content: (
      <div className="flex flex-col items-center pt-6 space-y-6">
        <p className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider text-center">Marcar consulta médica</p>
        
        <div className="relative h-32 w-32 flex items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="64" cy="64" r="60" fill="transparent" stroke="#F5F5F0" strokeWidth="6" />
            <circle cx="64" cy="64" r="60" fill="transparent" stroke="#84A59D" strokeWidth="6" strokeDasharray="377" strokeDashoffset="120" strokeLinecap="round" className="transition-all duration-1000" />
          </svg>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-display font-black text-[#1F2937] tabular-nums tracking-tighter">14:59</span>
            <span className="text-[9px] font-bold text-[#84A59D] uppercase tracking-widest mt-1">Focando</span>
          </div>
        </div>

        <div className="flex gap-3 w-full">
          <button className="flex-1 bg-[#1F2937] text-white rounded-xl py-3 text-[11px] font-black shadow-lg">
            Pausar
          </button>
          <button className="flex-1 bg-white border border-[#E5E7EB] text-[#1F2937] rounded-xl py-3 text-[11px] font-black">
            Concluir
          </button>
        </div>
      </div>
    )
  },
  {
    icon: Coffee,
    title: "Plano B",
    content: (
      <div className="space-y-4 pt-2">
        <div className="bg-[#FFF9ED] border border-[#FDE68A] p-4 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Battery size={16} className="text-[#F59E0B]" />
            <h4 className="text-[12px] font-black text-[#D97706]">Energia caiu?</h4>
          </div>
          <p className="text-[10px] text-[#B45309] leading-relaxed">
            Tudo bem. Vamos congelar as tarefas que não são vitais para amanhã e focar no mínimo aceitável.
          </p>
        </div>

        <div className="space-y-2 relative">
          {/* Tarefas congeladas */}
          <div className="bg-white/40 rounded-xl border border-[#E5E7EB]/40 p-3 flex items-center gap-3 opacity-50 grayscale transition-all">
            <Clock size={16} className="text-[#9CA3AF]" />
            <p className="text-[11px] font-medium text-[#64748B] line-through">Organizar gavetas</p>
          </div>
          
          {/* Tarefa Sobrevivente */}
          <div className="bg-white rounded-xl shadow-sm border-2 border-[#1F2937] p-3 flex items-start gap-3 relative z-10 scale-105 transition-all">
            <Circle size={18} className="text-[#1F2937] shrink-0" />
            <div>
              <p className="text-[12px] font-black text-[#1F2937]">Mínimo: Pedir Jantar</p>
              <p className="text-[9px] font-bold text-[#84A59D] uppercase tracking-wider mt-1">Sobrevivência</p>
            </div>
          </div>

          <div className="bg-white/40 rounded-xl border border-[#E5E7EB]/40 p-3 flex items-center gap-3 opacity-50 grayscale">
            <Clock size={16} className="text-[#9CA3AF]" />
            <p className="text-[11px] font-medium text-[#64748B] line-through">Responder DM's</p>
          </div>
        </div>
      </div>
    )
  },
  {
    icon: LineChart,
    title: "Insights",
    content: (
      <div className="space-y-4 pt-2">
        <h4 className="text-sm font-black text-[#1F2937]">Sua semana</h4>
        
        <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 pt-8 relative">
          <span className="absolute top-3 left-3 text-[9px] font-bold text-[#9CA3AF] uppercase">Foco vs Energia</span>
          <div className="flex items-end justify-between h-20 gap-1.5">
            {[30, 50, 40, 80, 60, 90, 70].map((h, i) => (
              <div key={i} className="w-full relative flex items-end justify-center group">
                <div className="w-full bg-[#84A59D] rounded-t-sm opacity-90 transition-all hover:opacity-100" style={{ height: `${h}%` }} />
                <div className="absolute -bottom-5 text-[8px] font-bold text-[#9CA3AF]">
                  {['D','S','T','Q','Q','S','S'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#F3E8E6] rounded-xl p-3 flex gap-3 items-start border border-white">
          <Brain size={16} className="text-[#1F2937] shrink-0 mt-0.5" />
          <p className="text-[10px] text-[#475569] leading-relaxed font-medium">
            Você tende a perder o foco na quarta-feira à tarde. Que tal agendar o <strong className="text-[#1F2937]">Plano B</strong> preventivamente?
          </p>
        </div>
      </div>
    )
  },
  {
    icon: Brain,
    title: "Segunda Mente",
    content: (
      <div className="flex flex-col items-center justify-center h-full pb-10 space-y-5">
        <div className="relative">
          <div className="absolute inset-0 bg-[#84A59D]/20 rounded-3xl blur-xl animate-pulse" />
          <div className="h-20 w-20 bg-[#1F2937] rounded-3xl shadow-xl flex items-center justify-center relative z-10 border border-[#374151]">
            <Brain className="h-10 w-10 text-[#F5F5F0]" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-xl font-display font-black text-[#1F2937]">Sua mente, salva.</h3>
          <p className="text-[11px] text-[#64748B] max-w-[180px] mx-auto leading-relaxed">
            Amanhã recomeçamos juntos. Sem culpa, sem cobrança, no seu ritmo.
          </p>
        </div>
        <button className="bg-white border border-[#E5E7EB] shadow-sm text-[#1F2937] rounded-xl px-6 py-2.5 text-[11px] font-black uppercase tracking-widest mt-4">
          Encerrar Dia
        </button>
      </div>
    )
  }
];

export function JourneyPhonePreview({ activeIndex }: { activeIndex: number }) {
  const activeState = UI_STATES[activeIndex] || UI_STATES[0];
  const Icon = activeState.icon;

  return (
    <div className="relative mx-auto w-[280px] h-[580px] bg-[#FAF9F6] rounded-[2.5rem] shadow-2xl shadow-[#1F2937]/10 border-[6px] border-white overflow-hidden flex flex-col">
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-white rounded-b-2xl z-20 shadow-sm" />
      
      {/* App Header */}
      <div className="pt-12 pb-4 px-6 bg-white z-10 border-b border-[#E5E7EB]/50">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            transition={{ duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <div className="h-10 w-10 rounded-xl bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
              <Icon size={18} strokeWidth={2.5} />
            </div>
            <div>
              <h3 className="font-display font-black text-[#1F2937] tracking-tight leading-none mb-1">{activeState.title}</h3>
              <p className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider">TDAH Constante</p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* App Content Body */}
      <div className="flex-1 relative bg-[#FAF9F6] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 px-5 pt-4 pb-20"
          >
            {activeState.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* App Bottom Nav */}
      <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-[#E5E7EB] bg-white flex items-center justify-around px-4 z-20">
        <div className="flex flex-col items-center gap-1 text-[#1F2937]">
          <Target size={20} />
          <div className="h-1 w-1 bg-[#1F2937] rounded-full" />
        </div>
        <div className="flex flex-col items-center gap-1 text-[#D1D5DB]">
          <LineChart size={20} />
        </div>
        <div className="h-12 w-12 bg-[#1F2937] rounded-full shadow-lg flex items-center justify-center -translate-y-4 border-4 border-white text-white">
          <Zap size={20} />
        </div>
        <div className="flex flex-col items-center gap-1 text-[#D1D5DB]">
          <Wind size={20} />
        </div>
        <div className="flex flex-col items-center gap-1 text-[#D1D5DB]">
          <Coffee size={20} />
        </div>
      </div>
    </div>
  );
}
