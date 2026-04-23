"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check, Heart, Battery, Brain, Sparkles, Sunset, Moon, Sun, Shield, Target, Zap, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState({
    diagnosis: "",
    struggle: "",
    energy: "",
    peakTime: "",
    profile: "",
    tone: "",
    firstAction: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const stepParam = params.get('step');
    if (stepParam) {
      setTimeout(() => setStep(parseInt(stepParam)), 0);
      // Limpa os params para evitar recarregar no mesmo passo sempre
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

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
              is_diagnosed: selections.diagnosis,
              main_struggle: selections.struggle,
              energy_level: selections.energy,
              peak_time: selections.peakTime,
              mindset_profile: selections.profile,
              interaction_tone: selections.tone,
            });

          if (error) throw error;
          
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
        toast.error("Erro ao salvar: " + err.message);
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
        Como você quer ser acompanhada?
      </h1>
      <p className="text-[#64748B] text-xl font-medium mb-14 leading-relaxed">
        Cada mente TDAH é um universo único. Para sermos úteis, precisamos entender seu contexto atual.
      </p>
      <button 
        onClick={nextStep}
        className="bg-[#1F2937] hover:bg-black text-white px-12 py-5 rounded-[24px] font-bold text-lg shadow-2xl shadow-black/20 transition-all transform hover:-translate-y-1 flex items-center gap-3"
      >
        Iniciar Diagnóstico <ArrowRight className="h-5 w-5" />
      </button>
    </motion.div>,

    // 1. Diagnóstico Clínico
    <motion.div key="diag" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-3xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 1 de 8</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Sobre seu diagnóstico...</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Isso nos ajuda a calibrar o nível de suporte terapêutico do app.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <ChoiceCard icon={<Shield />} title="Laudo Fechado" desc="Já tenho diagnóstico oficial de TDAH." active={selections.diagnosis === "sim"} onClick={() => setSelections({...selections, diagnosis: "sim"})} />
        <ChoiceCard icon={<Brain />} title="Em Investigação" desc="Tenho fortes suspeitas e busco clareza." active={selections.diagnosis === "suspeita"} onClick={() => setSelections({...selections, diagnosis: "suspeita"})} />
        <ChoiceCard icon={<Heart />} title="Sem Laudo" desc="Apenas sinto que preciso de organização adaptada." active={selections.diagnosis === "nao"} onClick={() => setSelections({...selections, diagnosis: "nao"})} />
      </div>

      <button disabled={!selections.diagnosis} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all">
        Próximo Passo
      </button>
    </motion.div>,

    // 2. Maior Dificuldade
    <motion.div key="struggle" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-3xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 2 de 8</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">O que mais te trava hoje?</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Onde você sente que "perde a mão" na rotina?</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <ChoiceCard icon={<Zap />} title="Inércia / Começar" desc="O peso para sair do lugar é enorme." active={selections.struggle === "inercia"} onClick={() => setSelections({...selections, struggle: "inercia"})} />
        <ChoiceCard icon={<Clock />} title="Esquecimento" desc="Perco prazos e compromissos importantes." active={selections.struggle === "memoria"} onClick={() => setSelections({...selections, struggle: "memoria"})} />
        <ChoiceCard icon={<Target />} title="Acabativa / Foco" desc="Começo mil coisas, não termino nenhuma." active={selections.struggle === "foco"} onClick={() => setSelections({...selections, struggle: "foco"})} />
        <ChoiceCard icon={<Battery />} title="Exaustão Mental" desc="Sinto que minha bateria acaba muito cedo." active={selections.struggle === "energia"} onClick={() => setSelections({...selections, struggle: "energia"})} />
      </div>

      <button disabled={!selections.struggle} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all">
        Próximo Passo
      </button>
    </motion.div>,

    // 3. Perfil Mindset
    <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-3xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 3 de 8</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Como está sua mente agora?</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
        <ChoiceCard icon={<Sparkles />} title="Procrastinadora Criativa" desc="Mil ideias, mas não consigo aterrar nenhuma." active={selections.profile === "criativa"} onClick={() => setSelections({...selections, profile: "criativa"})} />
        <ChoiceCard icon={<Shield />} title="Sobrecarga Total" desc="Qualquer nova tarefa vai me fazer quebrar." active={selections.profile === "sobrecarga"} onClick={() => setSelections({...selections, profile: "sobrecarga"})} />
        <ChoiceCard icon={<Zap />} title="Em Hiperfoco" desc="Obcecada por algo e quero canalizar isso." active={selections.profile === "hiperfoco"} onClick={() => setSelections({...selections, profile: "hiperfoco"})} />
      </div>
      <button disabled={!selections.profile} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all">Próximo</button>
    </motion.div>,

    // 4. Energia
    <motion.div key="energy" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-3xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 4 de 8</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Nível de Bateria Mental</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-10">
        <ChoiceCard icon={<Battery className="text-green-500" />} title="Energia Alta" desc="Mantenho o ritmo e aceito desafios." active={selections.energy === "alta"} onClick={() => setSelections({...selections, energy: "alta"})} />
        <ChoiceCard icon={<Battery className="text-orange-400" />} title="Energia Baixa" desc="Apenas o básico já é muito difícil." active={selections.energy === "baixa"} onClick={() => setSelections({...selections, energy: "baixa"})} />
      </div>
      <button disabled={!selections.energy} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all">Próximo</button>
    </motion.div>,

    // 5. Horário de Pico
    <motion.div key="peak" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-3xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 5 de 8</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Janelas de Poder</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-10">
        <ChoiceCard icon={<Sun />} title="Manhã" desc="Clareza antes do almoço." active={selections.peakTime === "manha"} onClick={() => setSelections({...selections, peakTime: "manha"})} />
        <ChoiceCard icon={<Sunset />} title="Tarde" desc="O motor engrena após as 14h." active={selections.peakTime === "tarde"} onClick={() => setSelections({...selections, peakTime: "tarde"})} />
        <ChoiceCard icon={<Moon />} title="Noite" desc="Foco total no silêncio." active={selections.peakTime === "noite"} onClick={() => setSelections({...selections, peakTime: "noite"})} />
      </div>
      <button disabled={!selections.peakTime} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all">Próximo</button>
    </motion.div>,

    // 6. Tom da Voz
    <motion.div key="tone" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 6 de 8</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Escolha sua "Vibe"</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-10">
        <ChoiceCard icon={<Heart />} title="Acolhedora" desc="Carinho e zero pressão." active={selections.tone === "acolhedor"} onClick={() => setSelections({...selections, tone: "acolhedor"})} />
        <ChoiceCard icon={<Target />} title="Diretiva" desc="Instruções claras e sem rodeios." active={selections.tone === "direto"} onClick={() => setSelections({...selections, tone: "direto"})} />
      </div>
      <button disabled={!selections.tone} onClick={nextStep} className="mt-14 bg-[#1F2937] hover:bg-black disabled:opacity-30 text-white px-12 py-5 rounded-[22px] font-bold text-lg shadow-xl shadow-black/10 transition-all">Próximo</button>
    </motion.div>,

    // 7. Google Agenda (Automation Prep)
    <motion.div key="agenda" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 7 de 8</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Automação de Agenda</h2>
      <p className="text-[#64748B] text-lg font-medium mb-12">Deseja conectar sua agenda agora ou continuar no modo manual?</p>
      
      <div className="w-full p-10 bg-white rounded-[40px] border-2 border-dashed border-[#E5E7EB] flex flex-col items-center">
         <div className="bg-[#4285F4]/10 p-6 rounded-full mb-6">
            <svg className="h-12 w-12 text-[#4285F4]" viewBox="0 0 24 24"><path fill="currentColor" d="M12.545,11.033H12V13h2.646c-0.124,0.647-0.71,1.884-2.646,1.884c-1.67,0-3.033-1.383-3.033-3.088s1.363-3.088,3.033-3.088c0.95,0,1.587,0.406,1.95,0.755l1.552-1.494C14.505,7.15,13.407,6.726,12.545,6.726c-2.48,0-4.545,2.065-4.545,4.545s2.065,4.545,4.545,4.545c2.585,0,4.301-1.815,4.301-4.382c0-0.294-0.033-0.52-0.076-0.745L12.545,11.033z" /></svg>
         </div>
         <button 
            onClick={async () => {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                  queryParams: {
                    access_type: 'offline',
                    prompt: 'consent',
                  },
                  scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly',
                  redirectTo: window.location.origin + '/onboarding?step=7'
                }
              });
              if (error) toast.error("Erro ao conectar Google: " + error.message);
            }} 
            className="bg-[#4285F4] hover:bg-[#357ae8] text-white px-10 py-4 rounded-2xl font-bold mb-6 transition-colors"
          >
            Sincronizar com Google
          </button>
         <button onClick={nextStep} className="text-[#9CA3AF] font-bold text-xs uppercase tracking-widest">Continuar Manual</button>
      </div>
    </motion.div>,

    // 8. Primeira Vitória
    <motion.div key="action" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center max-w-2xl w-full">
      <span className="text-[#9CA3AF] font-black tracking-[0.3em] uppercase mb-6 text-[10px]">Passo 8 de 8</span>
      <h2 className="text-4xl font-black text-[#1F2937] tracking-tight mb-4">Sua Primeira Micro-Vitória</h2>
      <input 
        type="text"
        placeholder="Ex: Beber água ou Abrir o notebook"
        value={selections.firstAction}
        onChange={(e) => setSelections({...selections, firstAction: e.target.value})}
        className="w-full bg-white border-2 border-[#E5E7EB] p-6 rounded-[24px] text-xl font-bold text-[#1F2937] focus:border-[#84A59D] focus:outline-none text-center mb-10"
      />
      <button disabled={!selections.firstAction} onClick={nextStep} className="bg-[#84A59D] hover:bg-[#6c8c84] text-white px-12 py-6 rounded-[28px] font-bold text-xl shadow-2xl flex items-center gap-4">
        Finalizar Triagem <Check className="h-6 w-6" />
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
