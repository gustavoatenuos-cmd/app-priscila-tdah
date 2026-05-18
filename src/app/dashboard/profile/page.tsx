"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Briefcase, Target, Zap, 
  Clock, Heart, Shield, Sparkles, 
  Save, Loader2, Brain, Fingerprint,
  Activity, TrendingUp, AlertCircle,
  ChevronRight, BrainCircuit
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { AnimatedBrain } from "@/components/animated-brain";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: "",
    occupation: "",
    age: "",
    bio: "",
    main_struggle: "foco",
    mindset_profile: "criativa",
    life_friction: "trabalho",
    energy_level: "alta",
    peak_time: "manha",
    interaction_tone: "acolhedor",
  });

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(prev => ({ ...prev, ...data }));
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Não autenticado");

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date(),
        });

      if (error) throw error;
      toast.success("Arquitetura cognitiva atualizada! ✨");
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#F5F5F0]">
        <Loader2 className="h-8 w-8 animate-spin text-[#84A59D]" />
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-[#F5F5F0] pb-24">
      <div className="max-w-7xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 bg-[#1F2937] rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
                <BrainCircuit className="h-7 w-7 text-[#84A59D]" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#9CA3AF] block">Módulo de Biometria Neural</span>
                <h1 className="text-4xl md:text-5xl font-black text-[#1F2937] tracking-tight">
                  Seu Perfil <span className="text-[#84A59D]">Analítico</span>
                </h1>
              </div>
            </div>
            <p className="text-[#64748B] font-medium max-w-2xl leading-relaxed">
              Aqui você calibra como o seu Segundo Cérebro processa sua realidade. <br className="hidden md:block" />
              Estes dados alimentam o **Auditor Neural** para gerar insights pragmáticos.
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1F2937] text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest flex items-center gap-4 hover:bg-black transition-all shadow-2xl shadow-black/10 disabled:opacity-50 active:scale-95"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Salvar Calibragem
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Analytical Mapping */}
          <div className="lg:col-span-8 space-y-10">
            
            {/* Visual Neuro-Map Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <DiagnosticCard 
                title="Estado de Fluxo Dominante" 
                value={profile.mindset_profile} 
                options={['criativa', 'hiperfoco', 'paralisia']}
                onChange={(val) => setProfile({...profile, mindset_profile: val})}
                icon={<Activity className="h-5 w-5" />}
               />
               <DiagnosticCard 
                title="Pico de Performance" 
                value={profile.peak_time} 
                options={['manha', 'noite']}
                onChange={(val) => setProfile({...profile, peak_time: val})}
                icon={<Clock className="h-5 w-5" />}
               />
               <DiagnosticCard 
                title="Carga Cognitiva" 
                value={profile.energy_level} 
                options={['alta', 'baixa']}
                onChange={(val) => setProfile({...profile, energy_level: val})}
                icon={<Zap className="h-5 w-5" />}
               />
               <DiagnosticCard 
                title="Ponto de Fricção" 
                value={profile.life_friction} 
                options={['trabalho', 'projetos', 'social', 'saude']}
                onChange={(val) => setProfile({...profile, life_friction: val})}
                icon={<AlertCircle className="h-5 w-5" />}
               />
            </section>

            {/* Professional Data Card */}
            <section className="bg-white rounded-[3rem] p-10 border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center gap-4 mb-10">
                <div className="h-10 w-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center shadow-sm">
                  <Briefcase className="h-5 w-5 text-[#1F2937]" />
                </div>
                <h2 className="text-xl font-black text-[#1F2937] uppercase tracking-tight">Contexto Profissional</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">Ocupação Atual</label>
                  <input 
                    type="text"
                    placeholder="Ex: Gestor de Tráfego"
                    value={profile.occupation}
                    onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                    className="w-full bg-[#F8F9FA] border-2 border-transparent p-5 rounded-2xl font-bold text-[#1F2937] focus:border-[#84A59D]/20 focus:bg-white outline-none transition-all shadow-inner"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">Principal Desafio</label>
                  <select 
                    value={profile.main_struggle}
                    onChange={(e) => setProfile({...profile, main_struggle: e.target.value})}
                    className="w-full bg-[#F8F9FA] border-2 border-transparent p-5 rounded-2xl font-bold text-[#1F2937] focus:border-[#84A59D]/20 focus:bg-white outline-none transition-all shadow-inner appearance-none cursor-pointer"
                  >
                    <option value="inercia">Inércia (Dificuldade de começar)</option>
                    <option value="foco">Foco (Dificuldade de manter)</option>
                    <option value="memoria">Memória (Dificuldade de lembrar)</option>
                  </select>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">Bio Cognitiva (Como seu cérebro funciona?)</label>
                  <textarea 
                    placeholder="Descreva seu processo mental, o que te distrai e o que te faz focar..."
                    rows={4}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full bg-[#F8F9FA] border-2 border-transparent p-6 rounded-[2.5rem] font-medium text-[#1F2937] focus:border-[#84A59D]/20 focus:bg-white outline-none transition-all resize-none shadow-inner leading-relaxed"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: AI Calibration Preview */}
          <div className="lg:col-span-4 space-y-8">
            
            <div className="bg-[#1F2937] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#84A59D]/20 blur-[100px] rounded-full translate-x-1/3 -translate-y-1/3" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <AnimatedBrain size={35} state="thinking" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-[0.2em]">Córtex Ativo</h3>
                    <p className="text-[10px] text-[#84A59D] font-bold uppercase">Calibrando protocolos...</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <p className="text-sm font-medium leading-relaxed text-gray-300 italic">
                    "Identifico um perfil de **{profile.occupation || 'especialista'}** com tendência a **{profile.mindset_profile}**. Vou priorizar o tom **{profile.interaction_tone}** para mitigar sua **{profile.main_struggle}**."
                  </p>

                  <div className="space-y-6 pt-6 border-t border-white/10">
                    <div className="space-y-4">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                          <span>Tom do Assistente</span>
                          <span className="text-[#84A59D]">{profile.interaction_tone}</span>
                       </div>
                       <div className="flex gap-2">
                          <button 
                            onClick={() => setProfile({...profile, interaction_tone: 'acolhedor'})}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${profile.interaction_tone === 'acolhedor' ? 'bg-[#84A59D] border-[#84A59D] text-white' : 'border-white/10 text-white/40 hover:border-white/20'}`}
                          >
                            Acolhedor
                          </button>
                          <button 
                            onClick={() => setProfile({...profile, interaction_tone: 'direto'})}
                            className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 transition-all ${profile.interaction_tone === 'direto' ? 'bg-white border-white text-[#1F2937]' : 'border-white/10 text-white/40 hover:border-white/20'}`}
                          >
                            Direto
                          </button>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2.5rem] p-8 border border-[#E5E7EB] shadow-sm">
               <div className="flex items-center gap-3 mb-6">
                  <TrendingUp className="h-5 w-5 text-[#84A59D]" />
                  <h3 className="text-xs font-black uppercase tracking-widest text-[#1F2937]">Metas Analíticas</h3>
               </div>
               <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-bold text-[#64748B] uppercase tracking-tighter">
                     <span>Foco Semanal</span>
                     <span>85%</span>
                  </div>
                  <div className="h-2 w-full bg-[#F1F5F9] rounded-full overflow-hidden">
                     <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} className="h-full bg-[#1F2937]" />
                  </div>
                  <p className="text-[10px] text-[#9CA3AF] font-medium leading-relaxed">
                    Sua constância aumentou **12%** desde que você definiu o seu pico de performance como **{profile.peak_time}**.
                  </p>
               </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

function DiagnosticCard({ title, value, options, onChange, icon }: { title: string, value: string, options: string[], onChange: (val: string) => void, icon: any }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#E5E7EB] shadow-sm space-y-6 group hover:border-[#84A59D]/30 transition-all">
       <div className="flex items-center gap-3 text-[#1F2937]">
          <div className="h-8 w-8 bg-[#F8F9FA] rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
             {icon}
          </div>
          <h3 className="text-xs font-black uppercase tracking-widest">{title}</h3>
       </div>
       <div className="flex flex-wrap gap-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                value === opt 
                  ? 'bg-[#1F2937] text-white shadow-lg' 
                  : 'bg-[#F8F9FA] text-[#9CA3AF] hover:bg-[#E5E7EB]'
              }`}
            >
              {opt}
            </button>
          ))}
       </div>
    </div>
  );
}
