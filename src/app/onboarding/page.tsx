"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Heart, Battery, Brain, Sparkles, User, Sunset, Moon, Sun, Shield, Target, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    energy: "",
    peakTime: "",
    profile: "",
    obstacle: "",
    tone: "",
    firstAction: "",
  });

  const nextStep = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Finalizar e salvar no Supabase
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { error } = await supabase
            .from('profiles')
            .upsert({
              id: user.id,
              energy_level: selections.energy,
              peak_time: selections.peakTime,
              mindset_profile: selections.profile,
              interaction_tone: selections.tone,
            });

          if (error) throw error;

          // Se definiu uma primeira ação, criar como tarefa essencial
          if (selections.firstAction) {
             await supabase.from('tasks').insert({
               user_id: user.id,
               title: selections.firstAction,
               priority_level: 'essencial'
             });
          }
        }
        
        toast.success("Sua experiência foi personalizada!");
        router.push("/dashboard");
      } catch (err: any) {
        toast.error("Erro ao salvar suas preferências: " + err.message);
        // Fallback para dashboard mesmo com erro
        router.push("/dashboard");
      }
    }
  };

  const steps = [
    // 0. Intro
    <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center max-w-xl">
      <div className="h-24 w-24 bg-[#84A59D]/10 rounded-full flex items-center justify-center mb-10">
        <Sparkles className="h-12 w-12 text-[#84A59D]" />
      </div>
      <h1 className="text-5xl font-black text-[#1F2937] tracking-tight mb-8 leading-[0.95]">
        Você não precisa de mais uma lista.
      </h1>
      <p className="text-[#64748B] text-xl font-medium mb-14 leading-relaxed">
        O TDAH Constante é o seu refúgio. Aqui, removemos a fricção e protegemos a sua calma. Vamos alinhar como o sistema pode colaborar com você hoje.
      </p>
      <button 
        onClick={nextStep}
        className="bg-[#1F2937] hover:bg-black text-white px-12 py-5 rounded-[24px] font-bold text-lg shadow-2xl shadow-black/20 transition-all transform hover:-translate-y-1 flex items-center gap-3"
      >
        Começar Triagem <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

    // 1. Diagnóstico de Perfil (Subtipo)
    <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-3xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 1 de 6</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Como está sua mente agora?</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Isso define o "Subtipo de Hoje" para personalizarmos sua tela inicial.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <ChoiceCard icon={<Brain />} title="Procrastinadora Criativa" desc="Mil ideias, mas não consigo aterrar nenhuma delas." active={selections.profile === "criativa"} onClick={() => setSelections({...selections, profile: "criativa"})} />
        <ChoiceCard icon={<Shield />} title="Totalmente Sobrecarregada" desc="Sinto que qualquer nova tarefa vai me fazer quebrar." active={selections.profile === "sobrecarga"} onClick={() => setSelections({...selections, profile: "sobrecarga"})} />
        <ChoiceCard icon={<Zap />} title="Em Hiperfoco" desc="Estou obcecada por algo e quero canalizar essa energia." active={selections.profile === "hiperfoco"} onClick={() => setSelections({...selections, profile: "hiperfoco"})} />
      </div>

      <button disabled={!selections.profile} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all flex items-center gap-3">
        Próximo Passo <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

    // 2. Energia
    <motion.div key="energy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-3xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 2 de 6</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Nível de Bateria Mental</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Vamos calibrar a densidade das sugestões da sua agenda.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <ChoiceCard icon={<Battery className="text-green-500" />} title="Energia Alta" desc="Mantenho o ritmo e aceito desafios." active={selections.energy === "alta"} onClick={() => setSelections({...selections, energy: "alta"})} />
        <ChoiceCard icon={<Battery className="text-orange-400" />} title="Energia Baixa / Preciso de Pausas" desc="Apenas o básico diário já é muito difícil agora." active={selections.energy === "baixa"} onClick={() => setSelections({...selections, energy: "baixa"})} />
      </div>

      <button disabled={!selections.energy} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all flex items-center gap-3">
        Próximo Passo <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

     // 3. Horário de Pico
     <motion.div key="peak" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-3xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 3 de 6</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Janelas de Poder</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Em qual turno sua mente costuma entrar em fluxo mais rápido?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <ChoiceCard icon={<Sun />} title="Manhã" desc="Clareza antes do almoço." active={selections.peakTime === "manha"} onClick={() => setSelections({...selections, peakTime: "manha"})} />
        <ChoiceCard icon={<Sunset />} title="Tarde" desc="O motor engrena após as 14h." active={selections.peakTime === "tarde"} onClick={() => setSelections({...selections, peakTime: "tarde"})} />
        <ChoiceCard icon={<Moon />} title="Noite" desc="Foco total no silêncio." active={selections.peakTime === "noite"} onClick={() => setSelections({...selections, peakTime: "noite"})} />
      </div>

      <button disabled={!selections.peakTime} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all flex items-center gap-3">
        Próximo Passo <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

    // 4. Tom da Voz
    <motion.div key="tone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 4 de 6</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Tom de Voz Preferido</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Toda a copy do app será adaptada para este tom.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <ChoiceCard icon={<Heart />} title="Acolhedor (Carinho)" desc="Incentivo constante e zero pressão." active={selections.tone === "acolhedor"} onClick={() => setSelections({...selections, tone: "acolhedor"})} />
        <ChoiceCard icon={<Target />} title="Diretivo (Instrucional)" desc="Sem rodeios, me diga o que fazer agora." active={selections.tone === "direto"} onClick={() => setSelections({...selections, tone: "direto"})} />
      </div>

      <button disabled={!selections.tone} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all flex items-center gap-3">
        Próximo Passo <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

    // 5. Conexão Digital
    <motion.div key="connection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 5 de 6</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Conexão de Agenda</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Vamos ler seus compromissos para encontrar janelas livres de foco.</p>
      
      <div className="w-full p-10 bg-white rounded-[32px] border-2 border-dashed border-[#E5E7EB] flex flex-col items-center">
         <div className="bg-[#4285F4]/10 p-5 rounded-full mb-6">
            <svg className="h-10 w-10 text-[#4285F4]" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12.545,11.033H12V13h2.646c-0.124,0.647-0.71,1.884-2.646,1.884c-1.67,0-3.033-1.383-3.033-3.088s1.363-3.088,3.033-3.088c0.95,0,1.587,0.406,1.95,0.755l1.552-1.494C14.505,7.15,13.407,6.726,12.545,6.726c-2.48,0-4.545,2.065-4.545,4.545s2.065,4.545,4.545,4.545c2.585,0,4.301-1.815,4.301-4.382c0-0.294-0.033-0.52-0.076-0.745L12.545,11.033z" />
            </svg>
         </div>
         <p className="text-sm font-bold text-[#333333] mb-8">Sincronizar com Google Agenda</p>
         <button onClick={nextStep} className="bg-white border-2 border-[#E5E7EB] text-[#1F2937] px-8 py-3 rounded-[16px] font-black uppercase text-[10px] tracking-widest hover:bg-[#F9FAFB] transition-all">
            Pular por enquanto
         </button>
      </div>
    </motion.div>,

    // 6. A Primeira Micro-Vitória
    <motion.div key="action" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 6 de 6</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Seu Primeiro Passo</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Vamos definir uma única coisa para você fazer assim que entrar no dashboard.</p>
      
      <div className="w-full mb-12">
        <input 
          type="text"
          placeholder="Ex: Beber um copo d'água ou Abrir o notebook"
          value={selections.firstAction}
          onChange={(e) => setSelections({...selections, firstAction: e.target.value})}
          className="w-full bg-white border-2 border-[#E5E7EB] p-6 rounded-[24px] text-xl font-bold text-[#1F2937] focus:border-[#84A59D] focus:outline-none text-center"
        />
      </div>

      <button disabled={!selections.firstAction} onClick={nextStep} className="bg-[#84A59D] hover:bg-[#6c8c84] text-white px-12 py-6 rounded-[28px] font-bold text-xl shadow-2xl shadow-[#84A59D]/20 transition-all transform hover:scale-105 flex items-center gap-4">
        Pronta para Recomeçar <Check className="h-6 w-6" />
      </button>
    </motion.div>,
  ];

  return (
    <div className="w-full flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        {steps[step]}
      </AnimatePresence>
    </div>
  );
}

function ChoiceCard({ icon, title, desc, active, onClick }: { icon: any, title: string, desc: string, active: boolean, onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className={`p-8 rounded-[32px] border-2 flex flex-col items-center text-center cursor-pointer transition-all duration-300 shadow-[0_4px_25px_rgba(0,0,0,0.01)] ${
        active ? 'border-[#84A59D] bg-white shadow-xl shadow-[#84A59D]/10 transform -translate-y-1' : 'border-[#E5E7EB] bg-white hover:border-[#64748B]/30 hover:bg-[#F8F9FA]'
      }`}
    >
      <div className={`mb-6 w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${active ? 'bg-[#84A59D]/10 text-[#84A59D]' : 'bg-[#F5F5F0] text-[#9CA3AF]'}`}>
        {icon}
      </div>
      <h3 className={`font-black text-[16px] mb-3 tracking-tight ${active ? 'text-[#1F2937]' : 'text-[#333333]'}`}>{title}</h3>
      <p className="text-[13px] font-medium text-[#64748B] leading-relaxed">{desc}</p>
    </div>
  );
}
