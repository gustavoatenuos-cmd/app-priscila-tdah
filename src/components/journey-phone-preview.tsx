"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Battery, Wind, Target, Zap, Coffee, LineChart, Brain } from "lucide-react";

interface PhonePreviewProps {
  activeIndex: number;
}

const UI_STATES = [
  {
    icon: Battery,
    title: "Check-in de Energia",
    content: (
      <div className="space-y-3">
        <div className="h-10 bg-[#E8F0EE] rounded-xl flex items-center px-4 gap-3 border border-[#84A59D]/20">
          <div className="h-4 w-4 rounded-full bg-[#84A59D]" />
          <div className="h-2 w-24 bg-[#84A59D]/40 rounded-full" />
        </div>
        <div className="h-10 bg-[#F5F5F0] rounded-xl flex items-center px-4 gap-3 border border-[#E5E7EB]/50">
          <div className="h-4 w-4 rounded-full bg-[#E5E7EB]" />
          <div className="h-2 w-16 bg-[#D1D5DB] rounded-full" />
        </div>
        <div className="h-10 bg-[#F5F5F0] rounded-xl flex items-center px-4 gap-3 border border-[#E5E7EB]/50">
          <div className="h-4 w-4 rounded-full bg-[#E5E7EB]" />
          <div className="h-2 w-20 bg-[#D1D5DB] rounded-full" />
        </div>
      </div>
    )
  },
  {
    icon: Wind,
    title: "Descarrego Mental",
    content: (
      <div className="space-y-4">
        <div className="h-20 bg-[#F5F5F0] rounded-2xl p-4 border border-[#E5E7EB]/50 border-dashed flex items-start">
          <p className="text-[10px] text-[#9CA3AF] italic">"Lembrar de comprar ração pro gato..."</p>
        </div>
        <div className="flex gap-2">
          <div className="h-8 flex-1 bg-[#84A59D] rounded-lg shadow-sm" />
          <div className="h-8 w-8 bg-[#1F2937] rounded-lg shadow-sm" />
        </div>
      </div>
    )
  },
  {
    icon: Target,
    title: "Top 3 Prioridades",
    content: (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-white rounded-xl shadow-sm border border-[#E5E7EB] flex items-center px-4 gap-3">
            <div className={`h-4 w-4 rounded-[4px] border-2 ${i === 1 ? 'border-[#84A59D] bg-[#84A59D]' : 'border-[#D1D5DB]'}`} />
            <div className="h-2 w-32 bg-[#D1D5DB] rounded-full" />
          </div>
        ))}
      </div>
    )
  },
  {
    icon: Zap,
    title: "Ritual de Foco",
    content: (
      <div className="flex flex-col items-center justify-center pt-4">
        <div className="relative h-24 w-24 rounded-full border-4 border-[#F5F5F0] flex items-center justify-center">
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="48" cy="48" r="46" fill="transparent" stroke="#84A59D" strokeWidth="4" strokeDasharray="289" strokeDashoffset="80" strokeLinecap="round" />
          </svg>
          <span className="text-xl font-display font-black text-[#1F2937]">25:00</span>
        </div>
        <div className="mt-6 h-8 w-24 bg-[#1F2937] rounded-full" />
      </div>
    )
  },
  {
    icon: Coffee,
    title: "Plano B do Dia",
    content: (
      <div className="space-y-3 relative">
        {/* Simulating dims for non-essentials */}
        <div className="h-12 bg-white/50 rounded-xl border border-[#E5E7EB]/30 flex items-center px-4 gap-3 opacity-40">
          <div className="h-4 w-4 rounded-[4px] border-2 border-[#D1D5DB]" />
          <div className="h-2 w-24 bg-[#D1D5DB] rounded-full" />
        </div>
        <div className="h-12 bg-[#FFF9ED] rounded-xl border border-[#FDE68A] shadow-sm flex items-center px-4 gap-3 relative z-10">
          <div className="h-4 w-4 rounded-[4px] border-2 border-[#F59E0B] bg-[#F59E0B]" />
          <div className="h-2 w-32 bg-[#D97706] rounded-full" />
        </div>
        <div className="h-12 bg-white/50 rounded-xl border border-[#E5E7EB]/30 flex items-center px-4 gap-3 opacity-40">
          <div className="h-4 w-4 rounded-[4px] border-2 border-[#D1D5DB]" />
          <div className="h-2 w-20 bg-[#D1D5DB] rounded-full" />
        </div>
      </div>
    )
  },
  {
    icon: LineChart,
    title: "Journal + Insights",
    content: (
      <div className="space-y-4">
        <div className="h-24 bg-white rounded-2xl border border-[#E5E7EB] shadow-sm p-4 flex items-end gap-2 justify-between">
          {[40, 70, 45, 90, 60, 80, 50].map((h, i) => (
            <div key={i} className="w-4 bg-[#84A59D] rounded-t-sm opacity-80" style={{ height: `${h}%` }} />
          ))}
        </div>
        <div className="h-12 bg-[#F5F5F0] rounded-xl flex items-center px-4 gap-3">
          <div className="h-6 w-6 rounded-full bg-[#1F2937] shrink-0" />
          <div className="h-2 w-full bg-[#D1D5DB] rounded-full" />
        </div>
      </div>
    )
  },
  {
    icon: Brain,
    title: "Segunda Mente",
    content: (
      <div className="flex flex-col items-center justify-center pt-8 space-y-4">
        <div className="h-16 w-16 bg-[#1F2937] rounded-2xl shadow-lg flex items-center justify-center">
          <Brain className="h-8 w-8 text-[#F5F5F0]" />
        </div>
        <div className="h-2 w-24 bg-[#84A59D] rounded-full" />
        <div className="h-2 w-16 bg-[#D1D5DB] rounded-full" />
      </div>
    )
  }
];

export function JourneyPhonePreview({ activeIndex }: { activeIndex: number }) {
  const activeState = UI_STATES[activeIndex] || UI_STATES[0];
  const Icon = activeState.icon;

  return (
    <div className="relative mx-auto w-[280px] h-[580px] bg-white rounded-[2.5rem] shadow-2xl shadow-[#1F2937]/10 border-[6px] border-[#F5F5F0] overflow-hidden flex flex-col">
      {/* Phone Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-[#F5F5F0] rounded-b-2xl z-20" />
      
      {/* App Header */}
      <div className="pt-12 pb-6 px-6 bg-gradient-to-b from-[#F5F5F0] to-white z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-2"
          >
            <div className="h-8 w-8 rounded-xl bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
              <Icon size={16} strokeWidth={2.5} />
            </div>
            <h3 className="font-display font-black text-[#1F2937] tracking-tight">{activeState.title}</h3>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* App Content Body */}
      <div className="flex-1 px-6 relative bg-white">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 px-6 pt-2"
          >
            {activeState.content}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* App Bottom Nav */}
      <div className="h-16 border-t border-[#E5E7EB]/50 bg-white/80 backdrop-blur-md flex items-center justify-around px-4 z-10">
        <div className="h-4 w-4 bg-[#1F2937] rounded-sm" />
        <div className="h-4 w-4 bg-[#D1D5DB] rounded-sm" />
        <div className="h-10 w-10 bg-[#84A59D] rounded-full shadow-md flex items-center justify-center -translate-y-4">
          <div className="h-4 w-4 border-2 border-white rounded-full" />
        </div>
        <div className="h-4 w-4 bg-[#D1D5DB] rounded-sm" />
        <div className="h-4 w-4 bg-[#D1D5DB] rounded-sm" />
      </div>
    </div>
  );
}
