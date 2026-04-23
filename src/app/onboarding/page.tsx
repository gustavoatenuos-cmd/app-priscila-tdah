"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Heart, Battery, Brain, Sparkles, User, Sunset, Moon, Sun, Shield, Target } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    energy: "",
    peakTime: "",
    obstacle: "",
    tone: "",
  });

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      // Finalizar e Redirecionar
      router.push("/dashboard");
    }
  };

  const steps = [
    // 0. Intro
    <motion.div key="intro" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex flex-col items-center text-center max-w-xl">
      <div className="h-20 w-20 bg-[#84A59D]/10 rounded-full flex items-center justify-center mb-8">
        <Sparkles className="h-10 w-10 text-[#84A59D]" />
      </div>
      <h1 className="text-4xl font-extrabold text-[#1F2937] tracking-tight mb-6">
        Seja bem-vinda ao seu segundo cérebro.
      </h1>
      <p className="text-[#64748B] text-xl font-medium mb-12 leading-relaxed">
        Não somos um app corporativo. Aqui não existe punição por recair, nem listas infindáveis que geram culpa. Esse é o seu espaço seguro.
      </p>
      <button 
        onClick={nextStep}
        className="bg-[#64748B] hover:bg-[#475569] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-[#64748B]/20 transition-all transform hover:-translate-y-1 flex items-center gap-3"
      >
        Vamos começar <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

    // 1. Energia
    <motion.div key="energy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-bold tracking-widest uppercase mb-4 text-sm">Passo 1 de 4</span>
      <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight mb-4">Como você descreve sua energia diária hoje?</h2>
      <p className="text-[#64748B] text-lg font-medium mb-10">Isso nos ajuda a calibrar o tamanho das tarefas que vamos recomendar.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <ChoiceCard icon={<Battery className="text-green-500" />} title="Alta e Constante" desc="Acordo disposta e mantenho o ritmo." active={selections.energy === "alta"} onClick={() => setSelections({...selections, energy: "alta"})} />
        <ChoiceCard icon={<Battery className="text-orange-400" />} title="Média, mas Funcional" desc="Faço o que precisa ser feito." active={selections.energy === "media"} onClick={() => setSelections({...selections, energy: "media"})} />
        <ChoiceCard icon={<Battery className="text-red-400" />} title="Baixa / Exaustão" desc="Apenas o básico diário é muito difícil." active={selections.energy === "baixa"} onClick={() => setSelections({...selections, energy: "baixa"})} />
        <ChoiceCard icon={<Battery className="text-blue-400" />} title="Oscilante (Montanha-russa)" desc="Tenho picos absurdos e quedas bruscas." active={selections.energy === "oscilante"} onClick={() => setSelections({...selections, energy: "oscilante"})} />
      </div>

      <button disabled={!selections.energy} onClick={nextStep} className="mt-12 bg-[#84A59D] hover:bg-[#6c8c84] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all flex items-center gap-3">
        Avançar <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

     // 2. Horário de Pico
     <motion.div key="peak" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-bold tracking-widest uppercase mb-4 text-sm">Passo 2 de 4</span>
      <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight mb-4">Em qual turno sua mente funciona melhor?</h2>
      <p className="text-[#64748B] text-lg font-medium mb-10">Vamos focar nossos *Deep Works* na janela de maior probabilidade de sucesso.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
        <ChoiceCard icon={<Sun />} title="Manhã" desc="Sou mais afiada antes do almoço." active={selections.peakTime === "manha"} onClick={() => setSelections({...selections, peakTime: "manha"})} />
        <ChoiceCard icon={<Sunset />} title="Tarde" desc="O motor engrena depois das 14h." active={selections.peakTime === "tarde"} onClick={() => setSelections({...selections, peakTime: "tarde"})} />
        <ChoiceCard icon={<Moon />} title="Noite/Madrugada" desc="As melhores ideias vêm no escuro." active={selections.peakTime === "noite"} onClick={() => setSelections({...selections, peakTime: "noite"})} />
      </div>

      <button disabled={!selections.peakTime} onClick={nextStep} className="mt-12 bg-[#84A59D] hover:bg-[#6c8c84] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all flex items-center gap-3">
        Avançar <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

    // 3. Obstáculo
    <motion.div key="obstacle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-bold tracking-widest uppercase mb-4 text-sm">Passo 3 de 4</span>
      <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight mb-4">O que costuma te travar no dia a dia?</h2>
      <p className="text-[#64748B] text-lg font-medium mb-10">Não há respostas erradas. Seja sincera (o app guardará segredo).</p>
      
      <div className="flex flex-col gap-4 w-full">
        <ChoiceCard icon={<Brain />} title="Sobrecarga / Paralisia" desc="Tenho tanta coisa que congelo e não faço nada." active={selections.obstacle === "paralisia"} onClick={() => setSelections({...selections, obstacle: "paralisia"})} />
        <ChoiceCard icon={<Shield />} title="Inércia / Dificuldade de Começar" desc="Eu enrolo horas para dar o primeiro passo." active={selections.obstacle === "inercia"} onClick={() => setSelections({...selections, obstacle: "inercia"})} />
        <ChoiceCard icon={<Target />} title="Falta de Constância" desc="Começo com força total, mas abandono rápido." active={selections.obstacle === "constancia"} onClick={() => setSelections({...selections, obstacle: "constancia"})} />
      </div>

      <button disabled={!selections.obstacle} onClick={nextStep} className="mt-12 bg-[#84A59D] hover:bg-[#6c8c84] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all flex items-center gap-3">
        Avançar <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

    // 4. Tom
    <motion.div key="tone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-bold tracking-widest uppercase mb-4 text-sm">Passo 4 de 4</span>
      <h2 className="text-3xl font-extrabold text-[#1F2937] tracking-tight mb-4">Como você quer que eu fale com você?</h2>
      <p className="text-[#64748B] text-lg font-medium mb-10">O TDAH Constante é customizável até na voz.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        <ChoiceCard icon={<Heart />} title="Acolhedor e Compassivo" desc="Preciso de abraços, paciência e zero pressão." active={selections.tone === "acolhedor"} onClick={() => setSelections({...selections, tone: "acolhedor"})} />
        <ChoiceCard icon={<Target />} title="Direto e Instrucional" desc="Sem enrolação, me diga o que fazer e me cobre." active={selections.tone === "direto"} onClick={() => setSelections({...selections, tone: "direto"})} />
      </div>

      <button disabled={!selections.tone} onClick={nextStep} className="mt-12 bg-[#64748B] hover:bg-[#475569] disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-4 rounded-2xl font-bold text-lg shadow-sm transition-all flex items-center gap-3">
        Finalizar e Gerar Painel <Check className="h-5 w-5" />
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
      className={`p-6 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all duration-200 shadow-[0_4px_15px_rgba(0,0,0,0.01)] ${
        active ? 'border-[#84A59D] bg-[#84A59D]/5 shadow-md transform scale-[1.02]' : 'border-[#E5E7EB] bg-white hover:border-[#64748B]/30 hover:bg-[#F8F9FA]'
      }`}
    >
      <div className={`mb-4 w-12 h-12 rounded-full flex items-center justify-center ${active ? 'bg-[#84A59D]/20 text-[#84A59D]' : 'bg-[#F1F5F9] text-[#9CA3AF]'}`}>
        {icon}
      </div>
      <h3 className={`font-extrabold text-[15px] mb-2 ${active ? 'text-[#1F2937]' : 'text-[#333333]'}`}>{title}</h3>
      <p className="text-[13px] font-medium text-[#64748B] leading-relaxed">{desc}</p>
    </div>
  );
}
