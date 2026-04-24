"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Briefcase, Target, Zap, 
  Clock, Heart, Shield, Sparkles, 
  Save, Loader2, Brain, Fingerprint
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
    main_struggle: "",
    mindset_profile: "",
    life_friction: "",
    energy_level: "",
    peak_time: "",
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
      toast.success("Arquitetura cognitiva atualizada!");
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
    <div className="flex-1 min-h-screen bg-[#F5F5F0] pb-20">
      <div className="max-w-5xl mx-auto px-6 pt-12">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 bg-[#1F2937] rounded-xl flex items-center justify-center shadow-lg shadow-black/10">
                <Fingerprint className="h-6 w-6 text-[#84A59D]" />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9CA3AF]">Módulo de Identidade</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-[#1F2937] tracking-tight">
              Sua <span className="text-[#84A59D]">Assinatura</span> Cognitiva
            </h1>
            <p className="text-[#64748B] mt-4 font-medium max-w-xl">
              Personalize como o seu Segundo Cérebro deve interagir com você. Quanto mais detalhes, mais precisas serão as intervenções da IA.
            </p>
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1F2937] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 hover:bg-black transition-all shadow-xl shadow-black/10 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Salvar Configurações
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Personal Info */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Basic Info Card */}
            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center">
                  <User className="h-5 w-5 text-[#1F2937]" />
                </div>
                <h2 className="text-xl font-black text-[#1F2937] uppercase tracking-tight">Dados Fundamentais</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text"
                    value={profile.full_name}
                    onChange={(e) => setProfile({...profile, full_name: e.target.value})}
                    className="w-full bg-[#F8F9FA] border-none p-4 rounded-2xl font-bold text-[#1F2937] focus:ring-2 focus:ring-[#84A59D]/20 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">Ocupação / Cargo</label>
                  <div className="relative">
                    <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#9CA3AF]" />
                    <input 
                      type="text"
                      placeholder="Ex: Designer, Estudante..."
                      value={profile.occupation}
                      onChange={(e) => setProfile({...profile, occupation: e.target.value})}
                      className="w-full bg-[#F8F9FA] border-none p-4 pl-12 rounded-2xl font-bold text-[#1F2937] focus:ring-2 focus:ring-[#84A59D]/20 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest ml-1">Bio Cognitiva (Como você funciona?)</label>
                  <textarea 
                    placeholder="Descreva brevemente como você pensa ou quais são seus gatilhos..."
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full bg-[#F8F9FA] border-none p-5 rounded-3xl font-medium text-[#1F2937] focus:ring-2 focus:ring-[#84A59D]/20 outline-none transition-all resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Diagnostic Selection */}
            <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-[#E5E7EB] shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 bg-[#F8F9FA] rounded-xl flex items-center justify-center">
                  <Brain className="h-5 w-5 text-[#1F2937]" />
                </div>
                <h2 className="text-xl font-black text-[#1F2937] uppercase tracking-tight">Arquitetura de Suporte</h2>
              </div>

              <div className="space-y-10">
                {/* Life Friction */}
                <div>
                  <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest block mb-6">Área de maior fricção atual</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {['trabalho', 'casa', 'saude', 'financas', 'social', 'projetos'].map((val) => (
                      <button
                        key={val}
                        onClick={() => setProfile({...profile, life_friction: val})}
                        className={`p-4 rounded-2xl border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                          profile.life_friction === val 
                            ? 'border-[#1F2937] bg-[#1F2937] text-white shadow-lg' 
                            : 'border-[#F1F3F5] text-[#9CA3AF] hover:border-[#1F2937]/20'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy & Tone */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest block">Tom do Assistente</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setProfile({...profile, interaction_tone: 'acolhedor'})}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all ${profile.interaction_tone === 'acolhedor' ? 'border-[#84A59D] bg-[#84A59D]/5 text-[#84A59D] font-black' : 'border-[#F1F3F5] text-[#9CA3AF] font-bold'}`}
                      >
                        Acolhedor
                      </button>
                      <button 
                        onClick={() => setProfile({...profile, interaction_tone: 'direto'})}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all ${profile.interaction_tone === 'direto' ? 'border-[#1F2937] bg-[#1F2937]/5 text-[#1F2937] font-black' : 'border-[#F1F3F5] text-[#9CA3AF] font-bold'}`}
                      >
                        Direto
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase text-[#9CA3AF] tracking-widest block">Pico de Performance</label>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setProfile({...profile, peak_time: 'manha'})}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all ${profile.peak_time === 'manha' ? 'border-[#1F2937] bg-[#1F2937] text-white font-black' : 'border-[#F1F3F5] text-[#9CA3AF] font-bold'}`}
                      >
                        Manhã
                      </button>
                      <button 
                        onClick={() => setProfile({...profile, peak_time: 'noite'})}
                        className={`flex-1 p-4 rounded-2xl border-2 transition-all ${profile.peak_time === 'noite' ? 'border-[#1F2937] bg-[#1F2937] text-white font-black' : 'border-[#F1F3F5] text-[#9CA3AF] font-bold'}`}
                      >
                        Noite
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: AI Insights Preview */}
          <div className="space-y-6">
            <div className="bg-[#1F2937] rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              {/* Background Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#84A59D]/20 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                    <AnimatedBrain size={30} state="idle" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-widest">IA Conectada</h3>
                    <p className="text-[10px] text-[#84A59D] font-bold uppercase tracking-tighter">Status: Sincronizando</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <p className="text-sm font-medium leading-relaxed text-gray-300 italic">
                    "Olá, {profile.full_name?.split(' ')[0] || 'Viajante'}. Como você se identifica como {profile.occupation || 'especialista'}, estou ajustando meus protocolos para seu perfil de {profile.mindset_profile || 'execução'}."
                  </p>

                  <div className="pt-6 border-t border-white/10 space-y-4">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span>Calibragem de Tom</span>
                      <span className="text-[#84A59D]">{profile.interaction_tone}</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: profile.occupation ? '100%' : '30%' }}
                        className="h-full bg-[#84A59D]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] p-8 border border-[#E5E7EB]">
              <div className="flex items-center gap-3 mb-6">
                <Shield className="h-5 w-5 text-[#84A59D]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1F2937]">Privacidade</h3>
              </div>
              <p className="text-[11px] text-[#64748B] font-medium leading-relaxed">
                Seus dados de perfil são usados exclusivamente para processamento local da IA. Não vendemos nem compartilhamos sua arquitetura cognitiva.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
