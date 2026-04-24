"use client";

import { motion } from "framer-motion";
import { ArrowRight, Brain, CircleCheck, Sparkles, Zap, Shield, Target, Clock, MessageSquare, Activity } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F8F9FA] text-[#1F2937] font-sans selection:bg-[#1F2937]/10 overflow-x-hidden">
      
      {/* NAVIGATION BAR (PREMIUM) */}
      <nav className="fixed top-0 w-full z-50 px-6 py-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center bg-white/70 backdrop-blur-xl border border-white/20 px-8 py-4 rounded-[32px] shadow-[0_8px_32px_rgba(0,0,0,0.05)]">
           <div className="flex items-center gap-2">
             <div className="h-8 w-8 bg-[#1F2937] rounded-lg flex items-center justify-center">
               <Brain className="h-5 w-5 text-white" />
             </div>
             <span className="font-black tracking-tighter text-xl">TDAH <span className="text-[#84A59D]">Constante</span></span>
           </div>
           <div className="hidden md:flex gap-8 text-[11px] font-black uppercase tracking-widest text-[#64748B]">
             <a href="#metodo" className="hover:text-[#1F2937] transition-colors">O Método</a>
             <a href="#inteligencia" className="hover:text-[#1F2937] transition-colors">Inteligência AI</a>
             <a href="#planos" className="hover:text-[#1F2937] transition-colors">Planos</a>
           </div>
           <Link href="/register">
             <button className="bg-[#1F2937] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-widest transition-all">Começar Agora</button>
           </Link>
        </div>
      </nav>

      {/* HERO SECTION (EDITORIAL STYLE) */}
      <section className="relative px-6 pt-56 pb-32 max-w-7xl mx-auto">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-5xl h-[800px] bg-[radial-gradient(circle_at_center,_#84A59D15_0%,_transparent_70%)]"></div>
        
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 bg-[#84A59D]/10 rounded-full mb-8">
              <Sparkles className="h-4 w-4 text-[#84A59D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#84A59D]">O Futuro da Neuro-Organização</span>
            </div>
            
            <h1 className="text-6xl md:text-[88px] font-black tracking-tight leading-[0.9] mb-10 text-[#1F2937]">
              Seu Assistente <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1F2937] to-[#84A59D]">Cognitivo</span> Pessoal.
            </h1>
            
            <p className="text-xl md:text-2xl text-[#64748B] font-medium leading-relaxed mb-12 max-w-xl">
              Não é apenas um planner. É um ecossistema inteligente desenhado para externalizar sua mente e converter paralisia em fluxo contínuo.
            </p>

            <div className="flex flex-col sm:flex-row gap-6">
              <Link href="/register">
                <button className="bg-[#1F2937] hover:bg-black text-white px-10 py-6 rounded-[28px] font-bold text-lg shadow-2xl shadow-black/10 transition-all flex items-center gap-4 group">
                  Iniciar Mapeamento <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <div className="flex items-center gap-4 px-6 py-4 bg-white rounded-[28px] border border-[#E5E7EB]">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-[#F5F5F0]" />)}
                </div>
                <span className="text-xs font-bold text-[#64748B]">+2.400 Mentes Ativadas</span>
              </div>
            </div>
          </motion.div>

          {/* APP PREVIEW (VISUAL LIFE) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] bg-white rounded-[64px] shadow-[0_40px_100px_rgba(0,0,0,0.08)] border border-[#E5E7EB] relative overflow-hidden group">
               <img 
                 src="/mockup_dashboard_pt.png" 
                 alt="Dashboard TDAH Constante" 
                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Floating Badges */}
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute -top-10 -right-10 bg-[#84A59D] text-white p-6 rounded-[32px] shadow-2xl flex items-center gap-4">
              <Zap className="h-6 w-6" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest opacity-70">Status Atual</span>
                <span className="text-sm font-bold">Hiperfoco Ativado</span>
              </div>
            </motion.div>

            <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, delay: 0.5 }} className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[32px] shadow-2xl border border-[#E5E7EB] flex items-center gap-4">
              <Shield className="h-6 w-6 text-[#1F2937]" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#64748B]">Segurança</span>
                <span className="text-sm font-bold text-[#1F2937]">Zero Culpa</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* HOW IT WORKS (THE NEURO-PROCESS) */}
      <section id="metodo" className="py-40 px-6 bg-[#1F2937] text-white rounded-[80px] -mt-10 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <h2 className="text-5xl font-black tracking-tight leading-[1.1] mb-8">
                Um sistema que evolui <br/> com a sua neuroplasticidade.
              </h2>
              <p className="text-xl text-white/60 font-medium leading-relaxed mb-12">
                Nossa IA não apenas lista tarefas; ela analisa seu comportamento, picos de energia e pontos de fricção para criar uma nova realidade de organização pessoal.
              </p>
              
              <div className="space-y-10">
                <StepItem 
                  num="01" 
                  title="Análise Comportamental" 
                  desc="Mapeamos como seu cérebro inicia e termina processos, identificando gatilhos de inércia e janelas de poder."
                />
                <StepItem 
                  num="02" 
                  title="Configuração do Ecossistema" 
                  desc="O sistema se molda à sua persona. Se você está sobrecarregado, ele simplifica; se está em foco, ele acelera."
                />
                <StepItem 
                  num="03" 
                  title="Acompanhamento Ativo" 
                  desc="Seu assistente pessoal intervém nos momentos de travamento, trazendo você de volta ao fluxo sem julgamentos."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <FeatureCard icon={<Activity />} title="Bio-Feedback" desc="Monitoramento de carga mental." />
              <FeatureCard icon={<MessageSquare />} title="IA Generativa" desc="Criação de micro-passos inteligentes." />
              <FeatureCard icon={<Target />} title="Foco Seletivo" desc="Blindagem contra distrações." />
              <FeatureCard icon={<Clock />} title="Tempo Fluido" desc="Gestão de tempo baseada em energia." />
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION (MORE AGGRESSIVE & DIRECT) */}
      <section className="py-40 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-32">
           <h2 className="text-5xl font-black tracking-tight text-[#1F2937] mb-8 leading-[1.1]">
             Planners tradicionais foram feitos para mentes lineares.
           </h2>
           <p className="text-xl text-[#64748B] font-medium">Você já tentou todos. Nenhum funcionou porque eles ignoram a flutuação da sua bateria mental.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
           <ProblemBox 
             title="Sistemas Rígidos" 
             desc="Mentes TDAH odeiam rotinas estáticas. Nosso sistema é líquido, mudando conforme seu dia acontece." 
           />
           <ProblemBox 
             title="A Ressaca da Culpa" 
             desc="Um erro não deve destruir sua semana. Nossa IA recalcula seu trajeto instantaneamente." 
           />
           <ProblemBox 
             title="Decisões Infinitas" 
             desc="A paralisia de escolha é real. Nós eliminamos o ruído e entregamos apenas o SEU próximo passo." 
           />
        </div>
      </section>

      {/* FINAL CTA (EMPOWERING) */}
      <section className="py-40 px-6 text-center bg-[#F5F5F0] rounded-t-[100px]">
        <div className="max-w-4xl mx-auto">
          <Brain className="h-16 w-16 text-[#84A59D] mx-auto mb-10 opacity-40" />
          <h2 className="text-5xl md:text-7xl font-black text-[#1F2937] tracking-tight mb-12 leading-[1.1]">
            Não lute contra você.<br/> Construa com você.
          </h2>
          <Link href="/register">
            <button className="bg-[#1F2937] hover:bg-black text-white px-16 py-8 rounded-[40px] font-black text-2xl shadow-3xl transition-all transform hover:scale-105 active:scale-95">
              Ativar Meu Assistente Grátis
            </button>
          </Link>
          <p className="mt-10 text-[#9CA3AF] font-bold uppercase tracking-widest text-xs">Comece a sua nova realidade hoje.</p>
        </div>
      </section>
    </main>
  );
}

function StepItem({ num, title, desc }: { num: string, title: string, desc: string }) {
  return (
    <div className="flex gap-8 group">
      <span className="text-4xl font-black text-white/20 group-hover:text-[#84A59D] transition-colors">{num}</span>
      <div>
        <h4 className="text-xl font-bold mb-2">{title}</h4>
        <p className="text-white/50 leading-relaxed max-w-md">{desc}</p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="p-8 bg-white/5 backdrop-blur-lg border border-white/10 rounded-[40px] hover:bg-white/10 transition-all flex flex-col items-center text-center">
      <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-[#84A59D]">
        {icon}
      </div>
      <h5 className="font-bold mb-2">{title}</h5>
      <p className="text-xs text-white/40 leading-relaxed">{desc}</p>
    </div>
  );
}

function ProblemBox({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="p-12 bg-white rounded-[48px] border border-[#E5E7EB] shadow-sm hover:shadow-2xl transition-all">
       <div className="h-8 w-8 bg-red-50 text-red-400 rounded-full flex items-center justify-center mb-8 font-black">!</div>
       <h4 className="text-2xl font-black text-[#1F2937] mb-4">{title}</h4>
       <p className="text-[#64748B] font-medium leading-relaxed">{desc}</p>
    </div>
  );
}
