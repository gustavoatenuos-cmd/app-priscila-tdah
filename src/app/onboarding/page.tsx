"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Heart, Battery, Brain, Sparkles, Sunset, Moon, Sun, Shield, Target, Zap, Clock, CircleCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    executive_dysfunction: "",
    behavioral_pattern: "",
    life_friction: "",
    peak_performance: "",
    support_style: "",
    initial_trigger: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem('onboarding_selections');
    if (saved) {
      try {
        setSelections(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load onboarding state", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onboarding_selections', JSON.stringify(selections));
  }, [selections]);

  const nextStep = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              main_struggle: selections.executive_dysfunction,
              energy_level: selections.behavioral_pattern === 'paralisia' ? 'baixa' : 'alta',
              peak_time: selections.peak_performance,
              interaction_tone: selections.support_style,
              mindset_profile: selections.behavioral_pattern,
            });

          if (error) throw error;
          
          if (selections.initial_trigger) {
             await supabase.from('tasks').insert({
               user_id: user.id,
               title: selections.initial_trigger,
               priority_level: 'essencial'
             });
          }
        }
        
        localStorage.removeItem('onboarding_selections');
        toast.success("Arquitetura cognitiva configurada.");
        router.push("/dashboard");
      } catch (err: any) {
        toast.error("Erro ao salvar: " + err.message);
        router.push("/dashboard");
      }
    }
  };

  const steps = [
    // 0. Intro Conceitual
    <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center max-w-2xl">
      <div className="h-20 w-20 bg-[#1F2937] rounded-3xl flex items-center justify-center mb-10 shadow-2xl">
        <Brain className="h-10 w-10 text-[#84A59D]" />
      </div>
      <h1 className="text-5xl font-black text-[#1F2937] tracking-tight mb-8 leading-[0.95]">
        Bem-vinda ao seu <br/> <span className="text-[#84A59D]">Córtex Externo</span>.
      </h1>
      <p className="text-[#64748B] text-xl font-medium mb-14 leading-relaxed">
        Vamos realizar uma varredura comportamental para calibrar seu assistente pessoal. O objetivo é remover a carga de organização do seu cérebro e transferi-la para o nosso motor de IA.
      </p>
      <button 
        onClick={nextStep}
        className="bg-[#1F2937] hover:bg-black text-white px-12 py-6 rounded-[28px] font-bold text-xl shadow-2xl transition-all flex items-center gap-4 group"
      >
        Iniciar Protocolo <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
      </button>
    </motion.div>,

    // 1. Funções Executivas (Mapeamento de Falha)
    <motion.div key="exec" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-5xl w-full">
      <span className="text-[#9CA3AF] font-bold tracking-[0.3em] uppercase mb-6 text-[10px]">Módulo 01 — Análise de Funções Executivas</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-12">Onde ocorre o colapso da sua execução?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <ChoiceCard icon={<Zap />} title="Fase de Arranque" desc="Dificuldade extrema em sair do repouso para a ação (Inércia de transição)." active={selections.executive_dysfunction === "inercia"} onClick={() => setSelections({...selections, executive_dysfunction: "inercia"})} />
        <ChoiceCard icon={<Clock />} title="Fase de Retenção" desc="A memória de curto prazo falha e os processos se perdem no meio da execução." active={selections.executive_dysfunction === "memoria"} onClick={() => setSelections({...selections, executive_dysfunction: "memoria"})} />
        <ChoiceCard icon={<Target />} title="Fase de Convergência" desc="Dificuldade em priorizar uma única via entre múltiplas ideias (Paralisia por análise)." active={selections.executive_dysfunction === "foco"} onClick={() => setSelections({...selections, executive_dysfunction: "foco"})} />
      </div>

      <button disabled={!selections.executive_dysfunction} onClick={nextStep} className="mt-16 bg-[#1F2937] hover:bg-black disabled:opacity-20 text-white px-12 py-5 rounded-2xl font-bold transition-all shadow-xl">
        Avançar para Análise de Carga
      </button>
    </motion.div>,

    // 2. Comportamento e Resiliência
    <motion.div key="behavior" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-5xl w-full">
      <span className="text-[#9CA3AF] font-bold tracking-[0.3em] uppercase mb-6 text-[10px]">Módulo 02 — Padrão de Reação Comportamental</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-12">Como seu sistema reage ao erro ou sobrecarga?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <ChoiceCard icon={<Shield />} title="Paralisia Defensiva" desc="A mente &quot;desliga&quot; e você busca refúgio em distrações dopaminérgicas (redes, jogos)." active={selections.behavioral_pattern === "paralisia"} onClick={() => setSelections({...selections, behavioral_pattern: "paralisia"})} />
        <ChoiceCard icon={<Sparkles />} title="Hiperfixação Errática" desc="Foca intensamente em algo irrelevante para ignorar a pressão do que é vital." active={selections.behavioral_pattern === "criativa"} onClick={() => setSelections({...selections, behavioral_pattern: "criativa"})} />
        <ChoiceCard icon={<Zap />} title="Explosão Reativa" desc="Tenta fazer tudo ao mesmo tempo em um estado de ansiedade motora." active={selections.behavioral_pattern === "hiperfoco"} onClick={() => setSelections({...selections, behavioral_pattern: "hiperfoco"})} />
      </div>

      <button disabled={!selections.behavioral_pattern} onClick={nextStep} className="mt-16 bg-[#1F2937] hover:bg-black disabled:opacity-20 text-white px-12 py-5 rounded-2xl font-bold transition-all shadow-xl">
        Avançar para Auditoria de Rotina
      </button>
    </motion.div>,

    // 3. Life Friction (Contextos de Vida)
    <motion.div key="friction" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-6xl w-full">
      <span className="text-[#9CA3AF] font-bold tracking-[0.3em] uppercase mb-6 text-[10px]">Módulo 03 — Fricção e Contextos</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-8 leading-tight">Qual área da sua vida mais <br/> sofre com a desorganização?</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
         <OnboardingChoiceCard 
           active={selections.life_friction === 'trabalho'} 
           onClick={() => setSelections({...selections, life_friction: 'trabalho'})}
           title="Carreira e Prazos" 
           desc="Projetos atrasados, reuniões perdidas e a sensação de nunca estar em dia." 
         />
         <OnboardingChoiceCard 
           active={selections.life_friction === 'casa'} 
           onClick={() => setSelections({...selections, life_friction: 'casa'})}
           title="Gestão Doméstica" 
           desc="A pilha de louça, a roupa para lavar e a manutenção básica do seu espaço." 
         />
         <OnboardingChoiceCard 
           active={selections.life_friction === 'saude'} 
           onClick={() => setSelections({...selections, life_friction: 'saude'})}
           title="Saúde e Rotina" 
           desc="Esquecer remédios, pular refeições e a luta para manter exercícios." 
         />
         <OnboardingChoiceCard 
           active={selections.life_friction === 'financas'} 
           onClick={() => setSelections({...selections, life_friction: 'financas'})}
           title="Vida Financeira" 
           desc="Contas vencidas, impostos acumulados e o caos nas planilhas e e-mails." 
         />
         <OnboardingChoiceCard 
           active={selections.life_friction === 'social'} 
           onClick={() => setSelections({...selections, life_friction: 'social'})}
           title="Social e Afetivo" 
           desc="Vácuos em mensagens, esquecimento de aniversários e exaustão social." 
         />
         <OnboardingChoiceCard 
           active={selections.life_friction === 'projetos'} 
           onClick={() => setSelections({...selections, life_friction: 'projetos'})}
           title="Cenários Diários" 
           desc="Hobbys abandonados, cursos inacabados e ideias que nunca saem do papel." 
         />
      </div>

      <button disabled={!selections.life_friction} onClick={nextStep} className="mt-12 bg-[#1F2937] hover:bg-black disabled:opacity-20 text-white px-12 py-5 rounded-2xl font-black transition-all shadow-xl uppercase tracking-widest text-xs">
        Configurar Tom do Assistente
      </button>
    </motion.div>,

    // 4. Ritmo e Suporte (Calibragem Final)
    <motion.div key="perf" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-4xl w-full">
      <span className="text-[#9CA3AF] font-bold tracking-[0.3em] uppercase mb-6 text-[10px]">Módulo 04 — Calibragem de Motor AI</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-12">Defina sua janela de performance e tom de suporte.</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full">
        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest block text-center">Pico de Lucidez Cognitiva</label>
          <div className="grid grid-cols-1 gap-3">
             <button onClick={() => setSelections({...selections, peak_performance: 'manha'})} className={`p-5 rounded-2xl border-2 transition-all font-bold ${selections.peak_performance === 'manha' ? 'border-[#1F2937] bg-[#1F2937] text-white' : 'border-[#E5E7EB] hover:border-[#1F2937]/30'}`}>Período Matutino</button>
             <button onClick={() => setSelections({...selections, peak_performance: 'noite'})} className={`p-5 rounded-2xl border-2 transition-all font-bold ${selections.peak_performance === 'noite' ? 'border-[#1F2937] bg-[#1F2937] text-white' : 'border-[#E5E7EB] hover:border-[#1F2937]/30'}`}>Período Noturno</button>
          </div>
        </div>

        <div className="space-y-6">
          <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest block text-center">Protocolo de Intervenção</label>
          <div className="grid grid-cols-1 gap-3">
             <button onClick={() => setSelections({...selections, support_style: 'acolhedor'})} className={`p-5 rounded-2xl border-2 transition-all font-bold ${selections.support_style === 'acolhedor' ? 'border-[#84A59D] bg-[#84A59D] text-white' : 'border-[#E5E7EB] hover:border-[#84A59D]/30'}`}>Suporte Terapêutico</button>
             <button onClick={() => setSelections({...selections, support_style: 'direto'})} className={`p-5 rounded-2xl border-2 transition-all font-bold ${selections.support_style === 'direto' ? 'border-[#1F2937] bg-[#1F2937] text-white' : 'border-[#E5E7EB] hover:border-[#1F2937]/30'}`}>Suporte Pragmático (IA Direta)</button>
          </div>
        </div>
      </div>

      <button disabled={!selections.peak_performance || !selections.support_style} onClick={nextStep} className="mt-16 bg-[#1F2937] hover:bg-black disabled:opacity-20 text-white px-16 py-5 rounded-2xl font-black text-lg shadow-xl transition-all">
        Finalizar Mapeamento
      </button>
    </motion.div>,

    // 5. Gatilho Inicial (Micro-Vitória)
    <motion.div key="trigger" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <div className="mb-10 relative">
        <div className="h-24 w-24 bg-[#1F2937] rounded-[35%] flex items-center justify-center relative z-10 shadow-2xl">
          <Zap className="h-10 w-10 text-white animate-pulse" />
        </div>
        <div className="absolute inset-0 bg-[#1F2937]/20 blur-2xl rounded-full animate-pulse scale-150" />
      </div>

      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-4 text-[10px]">Protocolo de Ativação — Dopamina</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-6">Sua Primeira Micro-Vitória</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12 leading-relaxed px-6">
        A ciência mostra que pequenas conclusões disparam <span className="text-[#1F2937] font-bold">Dopamina</span>. Qual será sua primeira ação simbólica para ativar o sistema?
      </p>

      <div className="w-full relative group max-w-lg">
        <input 
          type="text"
          placeholder="Ex: Beber um copo d'água"
          value={selections.initial_trigger}
          onChange={(e) => setSelections({...selections, initial_trigger: e.target.value})}
          className="w-full bg-white border-2 border-[#E5E7EB] p-6 rounded-[28px] text-xl font-bold text-[#1F2937] focus:border-[#1F2937] focus:outline-none text-center shadow-sm transition-all"
        />
      </div>

      <div className="mt-14 flex flex-col items-center gap-6">
        <button disabled={!selections.initial_trigger} onClick={nextStep} className="bg-[#1F2937] hover:bg-black disabled:opacity-20 text-white px-20 py-6 rounded-[30px] font-black text-xl shadow-2xl flex items-center gap-4 transition-all">
          Ativar Meu Assistente <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </motion.div>,
  ];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#F5F5F0] p-6 overflow-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-[#84A59D]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-[#1F2937]/5 blur-[120px] rounded-full animate-pulse" />
      </div>

      <div className="relative z-10 w-full max-w-6xl flex items-center justify-center">
        <AnimatePresence mode="wait">
          {steps[step]}
        </AnimatePresence>
      </div>
    </div>
  );
}

function ChoiceCard({ icon, title, desc, active, onClick }: { icon: any, title: string, desc: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`group p-10 rounded-[48px] border-2 flex flex-col items-center text-center cursor-pointer transition-all duration-500 ${
        active ? 'border-[#1F2937] bg-white shadow-[0_40px_80px_rgba(0,0,0,0.08)] transform -translate-y-4' : 'border-transparent bg-white/40 hover:bg-white/80'
      }`}
    >
      <div className={`mb-8 w-16 h-16 rounded-[30%] flex items-center justify-center transition-all duration-500 ${active ? 'bg-[#1F2937] text-white scale-110 shadow-xl shadow-[#1F2937]/20' : 'bg-[#F8F9FA] text-[#1F2937]/40'}`}>
        {icon}
      </div>
      <h3 className={`font-black text-xl mb-4 tracking-tight ${active ? 'text-[#1F2937]' : 'text-[#333333]'}`}>{title}</h3>
      <p className="text-sm font-medium text-[#64748B] leading-relaxed">{desc}</p>
    </div>
  );
}

function OnboardingChoiceCard({ title, desc, active, onClick }: { title: string, desc: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`p-6 rounded-[32px] border-2 transition-all text-left flex items-center gap-6 group ${
        active ? 'border-[#1F2937] bg-white shadow-xl translate-y-[-2px]' : 'border-[#E5E7EB] bg-white/50 hover:border-[#1F2937]/30'
      }`}
    >
      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${active ? 'bg-[#1F2937] text-white' : 'bg-[#F8F9FA] text-[#9CA3AF]'}`}>
        <CircleCheck className={active ? 'text-[#84A59D]' : ''} />
      </div>
      <div>
        <h4 className="font-black text-[#1F2937] uppercase tracking-tight text-sm mb-1">{title}</h4>
        <p className="text-[11px] text-[#64748B] font-medium leading-tight">{desc}</p>
      </div>
    </button>
  );
}
