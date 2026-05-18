"use client";

import { TherapeuticShell } from "@/components/therapeutic/therapeutic-shell";
import { motion } from "framer-motion";
import { 
  Sparkles, Star, Zap, 
  Trash2, Plus, Save,
  AlertCircle, HelpCircle
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function MonthlyPlannerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [plan, setPlan] = useState<any>({
    priorities: ["", "", ""],
    habits: ["", "", ""],
    essential_tasks: [""],
    draining_tasks: [""],
    forgettings: [""],
    delegatable: [""]
  });

  const monthYear = new Date().toISOString().slice(0, 7); // YYYY-MM

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('therapeutic_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'monthly')
      .eq('period_identifier', monthYear)
      .single();

    if (data) {
      setPlan(data.data);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('therapeutic_plans')
      .upsert({
        user_id: user.id,
        type: 'monthly',
        period_identifier: monthYear,
        data: plan,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,type,period_identifier' });

    if (error) {
      console.error(error);
      toast.error("Erro ao salvar seu planejamento.");
    } else {
      toast.success("Planejamento mensal guardado com carinho!");
    }
    setSaving(false);
  };

  const updateItem = (field: string, index: number, value: string) => {
    const newItems = [...plan[field]];
    newItems[index] = value;
    setPlan({ ...plan, [field]: newItems });
  };

  const addItem = (field: string) => {
    setPlan({ ...plan, [field]: [...plan[field], ""] });
  };

  const removeItem = (field: string, index: number) => {
    const newItems = plan[field].filter((_: any, i: number) => i !== index);
    setPlan({ ...plan, [field]: newItems });
  };

  if (loading) return null;

  return (
    <TherapeuticShell 
      title="Planejamento Mensal" 
      subtitle="Defina sua bússola para este mês com intenção e clareza."
      activeTab="monthly"
    >
      <div className="space-y-12 pb-24">
        
        {/* Section: Core Priorities */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 bg-[#F8E9E2] rounded-lg flex items-center justify-center text-[#A78B95]">
              <Star className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#1F2937]">Prioridades Essenciais</h2>
          </div>
          <p className="text-sm text-[#7A7A7A] px-2 italic">Escolha até 3 focos principais. Menos é mais.</p>
          
          <div className="grid gap-4">
            {plan.priorities.map((item: string, idx: number) => (
              <motion.div 
                key={`priority-${idx}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="relative group"
              >
                <input 
                  type="text"
                  value={item}
                  onChange={(e) => updateItem('priorities', idx, e.target.value)}
                  placeholder={`Prioridade ${idx + 1}...`}
                  className="w-full bg-white border border-[#F8E9E2] p-6 rounded-3xl text-[#4A4A4A] font-medium focus:ring-2 focus:ring-[#A78B95]/20 focus:border-[#A78B95] outline-none transition-all shadow-sm group-hover:shadow-md"
                />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Section: Consistency Habits */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 px-2">
            <div className="h-8 w-8 bg-[#D4E2D4] rounded-lg flex items-center justify-center text-[#5C7A5C]">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-display font-bold text-[#1F2937]">Hábitos de Constância</h2>
          </div>
          <div className="grid gap-4">
            {plan.habits.map((item: string, idx: number) => (
              <input 
                key={`habit-${idx}`}
                type="text"
                value={item}
                onChange={(e) => updateItem('habits', idx, e.target.value)}
                placeholder="Ex: 10 min de leitura, meditação matinal..."
                className="w-full bg-white border border-[#D4E2D4] p-5 rounded-2xl text-[#4A4A4A] text-sm font-medium focus:ring-2 focus:ring-[#D4E2D4]/20 focus:border-[#D4E2D4] outline-none transition-all"
              />
            ))}
          </div>
        </section>

        {/* Section: Task Categorization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Obligatory but Draining */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <Zap className="h-4 w-4 text-orange-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1F2937]">Obrigatórias mas Desgastantes</h3>
            </div>
            <div className="bg-orange-50/30 p-6 rounded-[32px] border border-orange-100 space-y-3">
              {plan.draining_tasks.map((item: string, idx: number) => (
                <div key={`draining-${idx}`} className="flex gap-2">
                  <input 
                    type="text"
                    value={item}
                    onChange={(e) => updateItem('draining_tasks', idx, e.target.value)}
                    className="flex-1 bg-white/60 border-none p-3 rounded-xl text-sm focus:bg-white outline-none transition-all"
                  />
                  <button onClick={() => removeItem('draining_tasks', idx)} className="text-orange-200 hover:text-orange-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => addItem('draining_tasks')} className="w-full py-2 border-2 border-dashed border-orange-100 rounded-xl text-orange-300 hover:text-orange-400 hover:border-orange-200 transition-all flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Adicionar
              </button>
            </div>
          </div>

          {/* Forgettings */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 px-2">
              <AlertCircle className="h-4 w-4 text-[#A78B95]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1F2937]">Para Não Esquecer</h3>
            </div>
            <div className="bg-[#A78B95]/5 p-6 rounded-[32px] border border-[#A78B95]/10 space-y-3">
              {plan.forgettings.map((item: string, idx: number) => (
                <div key={`forget-${idx}`} className="flex gap-2">
                  <input 
                    type="text"
                    value={item}
                    onChange={(e) => updateItem('forgettings', idx, e.target.value)}
                    className="flex-1 bg-white/60 border-none p-3 rounded-xl text-sm focus:bg-white outline-none transition-all"
                  />
                  <button onClick={() => removeItem('forgettings', idx)} className="text-gray-300 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              ))}
              <button onClick={() => addItem('forgettings')} className="w-full py-2 border-2 border-dashed border-[#A78B95]/20 rounded-xl text-[#A78B95]/40 hover:text-[#A78B95] hover:border-[#A78B95]/40 transition-all flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Adicionar
              </button>
            </div>
          </div>

          {/* Delegatable / Postponable */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 px-2">
              <HelpCircle className="h-4 w-4 text-[#84A59D]" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-[#1F2937]">Itens Delegáveis ou Adiáveis</h3>
            </div>
            <div className="bg-[#D4E2D4]/20 p-8 rounded-[40px] border border-[#D4E2D4]/30">
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {plan.delegatable.map((item: string, idx: number) => (
                    <div key={`delegate-${idx}`} className="flex gap-2 bg-white/40 p-2 rounded-2xl">
                      <input 
                        type="text"
                        value={item}
                        onChange={(e) => updateItem('delegatable', idx, e.target.value)}
                        placeholder="O que pode esperar?"
                        className="flex-1 bg-transparent border-none p-2 text-sm outline-none"
                      />
                      <button onClick={() => removeItem('delegatable', idx)} className="text-gray-300 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  ))}
                  <button onClick={() => addItem('delegatable')} className="p-4 border-2 border-dashed border-[#D4E2D4]/50 rounded-2xl text-[#84A59D] hover:bg-white transition-all flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" /> Novo Item
                  </button>
               </div>
            </div>
          </div>

        </div>

        {/* Save Button */}
        <div className="flex justify-center pt-8">
           <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#1F2937] hover:bg-black text-white px-12 py-5 rounded-[2rem] font-bold shadow-xl shadow-gray-200 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-3"
           >
             {saving ? "Guardando..." : "Salvar Planejamento Mensal"}
             <Save className="h-5 w-5" />
           </button>
        </div>

      </div>
    </TherapeuticShell>
  );
}
