"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F5F5F0] text-[#333333] font-sans selection:bg-[#84A59D]/30">
      
      {/* PERSUASIVE HERO SECTION */}
      <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-x-0 top-0 -z-10 h-[600px] bg-[radial-gradient(circle_at_top,_#84A59D20_0%,_transparent_70%)]"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center rounded-full border border-[#84A59D]/30 bg-white/50 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-[#84A59D] mb-10 shadow-sm"
        >
          <Sparkles className="mr-2 h-3 w-3" />
          <span>Onde a constância encontra a leveza</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl md:text-[84px] font-black tracking-tight leading-[0.95] mb-8 text-[#1F2937]"
        >
          Pare de lutar contra<br /> o seu cérebro. <span className="text-[#84A59D]">Colabore</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-xl md:text-2xl text-[#64748B] font-medium leading-relaxed mb-14"
        >
          Você não precisa de mais disciplina. Você precisa de um sistema que te entenda. O <strong className="text-[#1F2937]">TDAH Constante</strong> remove a culpa e organiza seus dias com suavidade.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-6"
        >
          <Link href="/onboarding">
            <button className="bg-[#1F2937] hover:bg-black text-white px-10 py-5 rounded-[24px] font-bold text-lg shadow-2xl shadow-black/20 transition-all transform hover:-translate-y-1 flex items-center gap-3">
              Fazer a minha triagem <ArrowRight className="h-5 w-5" />
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="bg-white hover:bg-[#F9FAFB] text-[#64748B] px-10 py-5 rounded-[24px] font-bold text-lg border border-[#E5E7EB] transition-all flex items-center gap-3 group">
              <Brain className="h-5 w-5 group-hover:scale-110 transition-transform" />
              Ver Dashboard
            </button>
          </Link>
        </motion.div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-center">
           <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-4xl font-black text-[#1F2937] mb-8 leading-tight">O Ciclo de Hiperfoco <br />e Colapso termina aqui.</h2>
              <div className="space-y-8">
                 <PainPoint title="Inércia Paralisante" desc="Aquele sentimento de ter tanto para fazer que você acaba não fazendo nada." />
                 <PainPoint title="A Ressaca da Culpa" desc="Quando um dia não sai como planejado e você desiste da semana inteira." />
                 <PainPoint title="Sistemas Rígidos" desc="Planners que funcionam por 3 dias e depois viram peso de papel." />
              </div>
           </motion.div>
           <div className="bg-white rounded-[48px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 aspect-square flex items-center justify-center relative overflow-hidden">
             <div className="absolute inset-0 bg-[#84A59D]/5 animate-pulse"></div>
             <Brain className="h-40 w-40 text-[#84A59D] opacity-20" strokeWidth={1} />
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black uppercase text-[#84A59D] tracking-widest text-center">Espaço Seguro <br/> Neurodivergente</span>
             </div>
           </div>
        </div>
      </section>

      {/* THREE PILLARS */}
      <section className="py-32 bg-white/50 border-t border-b border-[#E5E7EB]/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <span className="text-[10px] font-black text-[#84A59D] uppercase tracking-[0.3em]">Nossos Pilares</span>
            <h2 className="text-4xl font-black text-[#1F2937] mt-4">Desenhado para como você funciona.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <PillarCard 
              icon={<Zap />} 
              title="Ação por Energia" 
              desc="O sistema reorganiza seu dia baseado no seu nível de bateria mental. Sem esgotamento." 
            />
            <PillarCard 
              icon={<CheckCircle />} 
              title="SOS Destravar" 
              desc="Um botão de pânico terapêutico que te conduz do travamento à primeira micro-vitória." 
            />
            <PillarCard 
              icon={<Sparkles />} 
              title="Resiliência Ativa" 
              desc="Nossos analytics celebram o recomeço, o dado mais importante para a constância real." 
            />
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <footer className="py-32 text-center">
        <h2 className="text-4xl font-black text-[#1F2937] mb-12">Pronta para o seu primeiro dia leve?</h2>
        <Link href="/onboarding">
          <button className="bg-[#84A59D] hover:bg-[#6c8c84] text-white px-12 py-6 rounded-[28px] font-bold text-xl shadow-2xl shadow-[#84A59D]/20 transition-all transform hover:scale-105">
            Começar Gratuitamente
          </button>
        </Link>
      </footer>
    </main>
  );
}

function PainPoint({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="flex gap-4">
      <div className="h-6 w-6 mt-1 rounded-full bg-red-400 flex items-center justify-center text-white text-[10px] shrink-0">✕</div>
      <div>
        <h4 className="font-bold text-[#1F2937] mb-1">{title}</h4>
        <p className="text-sm text-[#64748B] font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function PillarCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-10 rounded-[40px] bg-white border border-[#E5E7EB]/50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all">
      <div className="h-14 w-14 bg-[#F5F5F0] rounded-2xl flex items-center justify-center mb-8 text-[#84A59D]">
        {icon}
      </div>
      <h3 className="text-2xl font-black text-[#1F2937] mb-4">{title}</h3>
      <p className="text-[#64748B] font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
