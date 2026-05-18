"use client";

import { TherapeuticShell } from "@/components/therapeutic/therapeutic-shell";
import { motion } from "framer-motion";
import { 
  Calendar, Clock, Target, 
  Plus, Trash2, Save,
  ChevronLeft, ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function WeeklyPlannerPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekData, setWeekData] = useState<any>({
    days: {} // format: { '2024-05-20': { tasks: [], commitments: [], focus: "" } }
  });

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekIdentifier = format(weekStart, "yyyy-'W'ww");

  useEffect(() => {
    loadWeekPlan();
  }, [weekIdentifier]);

  const loadWeekPlan = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('therapeutic_plans')
      .select('*')
      .eq('user_id', user.id)
      .eq('type', 'weekly')
      .eq('period_identifier', weekIdentifier)
      .single();

    if (data) {
      setWeekData(data.data);
    } else {
      setWeekData({ days: {} });
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
        type: 'weekly',
        period_identifier: weekIdentifier,
        data: weekData,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id,type,period_identifier' });

    if (error) {
      toast.error("Erro ao salvar semana.");
    } else {
      toast.success("Semana organizada com sucesso!");
    }
    setSaving(false);
  };

  const getDayData = (dateStr: string) => {
    return weekData.days[dateStr] || { tasks: [], commitments: [], focus: "" };
  };

  const updateDayData = (dateStr: string, field: string, value: any) => {
    const dayData = getDayData(dateStr);
    setWeekData({
      ...weekData,
      days: {
        ...weekData.days,
        [dateStr]: { ...dayData, [field]: value }
      }
    });
  };

  const addTask = (dateStr: string) => {
    const dayData = getDayData(dateStr);
    updateDayData(dateStr, 'tasks', [...dayData.tasks, { title: "", completed: false }]);
  };

  const removeTask = (dateStr: string, idx: number) => {
    const dayData = getDayData(dateStr);
    const newTasks = dayData.tasks.filter((_: any, i: number) => i !== idx);
    updateDayData(dateStr, 'tasks', newTasks);
  };

  const updateTask = (dateStr: string, idx: number, title: string) => {
    const dayData = getDayData(dateStr);
    const newTasks = [...dayData.tasks];
    newTasks[idx] = { ...newTasks[idx], title };
    updateDayData(dateStr, 'tasks', newTasks);
  };

  const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

  return (
    <TherapeuticShell 
      title="Fluxo da Semana" 
      subtitle="Organize seus dias com espaço para o inesperado."
      activeTab="weekly"
    >
      <div className="space-y-8 pb-24">
        
        {/* Week Navigator */}
        <div className="flex items-center justify-between bg-white/60 backdrop-blur-md p-4 rounded-3xl border border-[#F8E9E2] shadow-sm">
           <button onClick={() => setCurrentDate(addDays(currentDate, -7))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft className="h-6 w-6 text-[#A78B95]" />
           </button>
           <div className="text-center">
              <span className="text-xs font-black uppercase tracking-widest text-[#A78B95]">Semana de</span>
              <h2 className="text-lg font-bold text-[#1F2937]">
                {format(weekStart, "d 'de' MMMM", { locale: ptBR })} - {format(addDays(weekStart, 6), "d 'de' MMMM", { locale: ptBR })}
              </h2>
           </div>
           <button onClick={() => setCurrentDate(addDays(currentDate, 7))} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronRight className="h-6 w-6 text-[#A78B95]" />
           </button>
        </div>

        {/* Weekly Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
           {weekDays.map((day, idx) => {
             const dateStr = format(day, "yyyy-MM-dd");
             const data = getDayData(dateStr);
             const isToday = isSameDay(day, new Date());

             return (
               <motion.div 
                 key={dateStr}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 transition={{ delay: idx * 0.05 }}
                 className={`flex flex-col min-h-[400px] bg-white rounded-[2rem] border transition-all ${
                   isToday ? 'border-[#A78B95] shadow-lg ring-2 ring-[#A78B95]/10' : 'border-[#F8E9E2] shadow-sm'
                 }`}
               >
                  {/* Day Header */}
                  <div className={`p-4 text-center rounded-t-[2rem] ${isToday ? 'bg-[#A78B95] text-white' : 'bg-gray-50 text-[#1F2937]'}`}>
                     <span className="text-[10px] font-black uppercase tracking-widest block opacity-70">
                       {format(day, "EEEE", { locale: ptBR })}
                     </span>
                     <span className="text-xl font-black">{format(day, "d")}</span>
                  </div>

                  <div className="p-4 space-y-6 flex-1 flex flex-col">
                     {/* Focus Point */}
                     <div className="space-y-2">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#A78B95]">
                           <Target className="h-3 w-3" /> Foco
                        </div>
                        <textarea 
                          value={data.focus}
                          onChange={(e) => updateDayData(dateStr, 'focus', e.target.value)}
                          placeholder="Intenção..."
                          className="w-full bg-[#F8E9E2]/30 border-none rounded-xl p-2 text-xs font-bold resize-none focus:bg-[#F8E9E2]/50 outline-none transition-all h-16"
                        />
                     </div>

                     {/* Task List */}
                     <div className="space-y-3 flex-1">
                        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-[#7A7A7A]">
                           <span>Tarefas</span>
                           <button onClick={() => addTask(dateStr)} className="text-[#A78B95] hover:scale-110 transition-transform"><Plus className="h-4 w-4" /></button>
                        </div>
                        <div className="space-y-2">
                           {data.tasks.map((task: any, tIdx: number) => (
                             <div key={tIdx} className="group flex items-center gap-2">
                                <input 
                                  type="text" 
                                  value={task.title}
                                  onChange={(e) => updateTask(dateStr, tIdx, e.target.value)}
                                  placeholder="Tarefa..."
                                  className="flex-1 bg-transparent border-b border-dashed border-gray-100 text-[11px] font-medium py-1 focus:border-[#A78B95] outline-none transition-all"
                                />
                                <button onClick={() => removeTask(dateStr, tIdx)} className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all"><Trash2 className="h-3 w-3" /></button>
                             </div>
                           ))}
                           {data.tasks.length === 0 && (
                             <p className="text-[10px] text-gray-300 italic text-center py-4">Vazio...</p>
                           )}
                        </div>
                     </div>

                     {/* Commitment/Event */}
                     <div className="mt-auto pt-4 border-t border-gray-50">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#84A59D]">
                           <Clock className="h-3 w-3" /> Compromissos
                        </div>
                        <textarea 
                          value={data.commitments}
                          onChange={(e) => updateDayData(dateStr, 'commitments', e.target.value)}
                          placeholder="Eventos..."
                          className="w-full bg-[#D4E2D4]/20 border-none rounded-xl p-2 text-xs font-bold resize-none focus:bg-[#D4E2D4]/40 outline-none transition-all h-12 mt-2"
                        />
                     </div>
                  </div>
               </motion.div>
             );
           })}
        </div>

        {/* Floating Save Button */}
        <div className="flex justify-center pt-8">
           <button 
            onClick={handleSave}
            disabled={saving}
            className="bg-[#A78B95] hover:bg-[#8E747D] text-white px-12 py-5 rounded-[2rem] font-bold shadow-xl shadow-[#A78B95]/20 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center gap-3"
           >
             {saving ? "Salvando..." : "Salvar Fluxo Semanal"}
             <Save className="h-5 w-5" />
           </button>
        </div>

      </div>
    </TherapeuticShell>
  );
}
