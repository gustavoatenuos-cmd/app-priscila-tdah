"use client";

import { TherapeuticShell } from "@/components/therapeutic/therapeutic-shell";
import { motion } from "framer-motion";
import { 
  Sparkles, Calendar, Heart, 
  Brain, Timer, CheckCircle2,
  ArrowRight, Plus
} from "lucide-react";
import Link from "next/link";

export default function TherapeuticPlannerHub() {
  const categories = [
    {
      id: "monthly",
      title: "Planejamento Mensal",
      description: "Prioridades essenciais e hábitos de constância para o seu mês.",
      icon: Calendar,
      color: "bg-[#F8E9E2]",
      textColor: "text-[#A78B95]",
      href: "/dashboard/therapeutic-planner/monthly",
      progress: "Defina suas metas"
    },
    {
      id: "weekly",
      title: "Planejamento Semanal",
      description: "Sua jornada de 7 dias com foco e leveza.",
      icon: CheckCircle2,
      color: "bg-[#D4E2D4]",
      textColor: "text-[#5C7A5C]",
      href: "/dashboard/therapeutic-planner/weekly",
      progress: "Segunda a Domingo"
    },
    {
      id: "dump",
      title: "Descarregar a Mente",
      description: "Espaço seguro para despejar ideias e silenciar o ruído.",
      icon: Brain,
      color: "bg-[#F3E5F5]",
      textColor: "text-[#9C27B0]",
      href: "/dashboard/therapeutic-planner/mind-dump",
      progress: "Limpeza mental"
    },
    {
      id: "focus",
      title: "Treino de Foco",
      description: "Pequenos passos para construir grandes momentos de presença.",
      icon: Timer,
      color: "bg-[#FFF9F0]",
      textColor: "text-[#D97706]",
      href: "/dashboard/therapeutic-planner/focus-training",
      progress: "Timer suave"
    },
    {
      id: "exercises",
      title: "Exercícios Diários",
      description: "Pílulas de autocuidado e presença para o seu dia.",
      icon: Heart,
      color: "bg-[#FFEBEE]",
      textColor: "text-[#E91E63]",
      href: "/dashboard/therapeutic-planner/exercises",
      progress: "Cards práticos"
    }
  ];

  return (
    <TherapeuticShell 
      title="Seu Espaço de Calma" 
      subtitle="Um guia gentil para sua jornada diária."
      activeTab="overview"
    >
      <div className="space-y-12">
        {/* Daily Insight Card */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 md:p-12 border border-white shadow-[0_20px_50px_rgba(0,0,0,0.03)] relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-8">
            <Sparkles className="h-12 w-12 text-[#A78B95]/10" />
          </div>
          
          <div className="relative z-10 max-w-lg">
            <div className="h-10 w-10 bg-[#A78B95]/10 rounded-full flex items-center justify-center text-[#A78B95] mb-6">
              <Heart className="h-5 w-5" />
            </div>
            <h2 className="text-2xl md:text-3xl font-display font-bold text-[#1F2937] mb-4">
              Lembrete de hoje: <br />
              <span className="text-[#A78B95]">Você não precisa ser perfeita.</span>
            </h2>
            <p className="text-[#7A7A7A] leading-relaxed mb-8">
              O objetivo deste planner não é cobrança, mas clareza. Comece pequeno, respire e lembre-se que cada passo conta.
            </p>
            <button className="bg-[#A78B95] hover:bg-[#8E747D] text-white px-8 py-4 rounded-2xl font-bold transition-all flex items-center gap-2 shadow-lg shadow-[#A78B95]/20">
              Começar agora <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.section>

        {/* Grid of Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link href={cat.href} className="block group h-full">
                <div className="bg-white hover:bg-white/80 p-8 rounded-[32px] border border-[#F8E9E2] transition-all duration-500 shadow-sm hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                  <div className={`h-14 w-14 ${cat.color} rounded-2xl flex items-center justify-center ${cat.textColor} mb-6 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                    <cat.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-[#1F2937] mb-2">{cat.title}</h3>
                  <p className="text-[#7A7A7A] text-sm leading-relaxed mb-6 flex-1">
                    {cat.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className={`text-[10px] font-black uppercase tracking-widest ${cat.textColor}`}>{cat.progress}</span>
                    <div className="h-8 w-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#A78B95] group-hover:text-white transition-all">
                       <Plus className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Energy Check-in Section */}
        <section className="bg-[#D4E2D4]/20 rounded-[40px] p-8 border border-[#D4E2D4]/30 flex flex-col md:flex-row items-center gap-8">
           <div className="h-24 w-24 bg-white rounded-full flex items-center justify-center text-[#84A59D] shadow-inner shrink-0">
              <Sparkles className="h-10 w-10" />
           </div>
           <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-display font-bold text-[#1F2937] mb-2">Checklist de Energia</h3>
              <p className="text-sm text-[#5C7A5C] font-medium leading-relaxed">
                Antes de planejar, como está sua bateria mental? <br className="hidden md:block" /> 
                Acesse o checklist de apoio emocional para se reconectar.
              </p>
           </div>
           <Link href="/dashboard/therapeutic-planner/energy-checklist" className="bg-white text-[#84A59D] px-8 py-4 rounded-2xl font-bold border border-[#D4E2D4] hover:bg-[#D4E2D4] hover:text-white transition-all">
             Check-in
           </Link>
        </section>
      </div>
    </TherapeuticShell>
  );
}
