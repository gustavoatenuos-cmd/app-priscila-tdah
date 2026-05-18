"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart3, Brain, Sparkles, 
  TrendingUp, Calendar, Target, 
  Zap, Loader2, FileText, ChevronRight,
  ShieldCheck, Activity, LineChart,
  BrainCircuit, Search, Info
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, AreaChart, Area 
} from "recharts";
import { supabase } from "@/lib/supabase";
import { format, subDays } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [auditing, setAuditing] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [data, setData] = useState<any>({
    tasksByDay: [],
    focusByDay: [],
    summary: { totalTasks: 0, completedTasks: 0, focusHours: 0, journalEntries: 0 }
  });
  const [profile, setProfile] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    async function loadStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const sevenDaysAgo = subDays(new Date(), 7).toISOString();

      // Fetch Profile
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);

      // Fetch Tasks
      const { data: tasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo);

      // Fetch Focus
      const { data: focus } = await supabase
        .from('focus_sessions')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo);

      // Fetch Journal
      const { data: journals } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', sevenDaysAgo);

      // Process Stats
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = subDays(new Date(), 6 - i);
        const dayStr = format(d, "EEE", { locale: ptBR });
        const dateStr = format(d, "yyyy-MM-dd");
        
        const dayTasks = tasks?.filter(t => t.created_at.startsWith(dateStr)) || [];
        const dayFocus = focus?.filter(s => s.created_at.startsWith(dateStr)) || [];

        return {
          day: dayStr,
          tasks: dayTasks.length,
          completed: dayTasks.filter(t => t.completed).length,
          focus: dayFocus.reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
        };
      });

      setData({
        tasksByDay: last7Days,
        focusByDay: last7Days.map(d => ({ day: d.day, minutes: d.focus })),
        summary: {
          totalTasks: tasks?.length || 0,
          completedTasks: tasks?.filter(t => t.completed).length || 0,
          focusHours: Math.round((focus?.reduce((acc, s) => acc + (s.duration_minutes || 0), 0) || 0) / 60),
          journalEntries: journals?.length || 0
        },
        raw: { tasks, focus, journals }
      });
      setLoading(false);
    }
    loadStats();
  }, []);

  const runAudit = async () => {
    setAuditing(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        body: JSON.stringify({
          tasks: data.raw.tasks,
          focusSessions: data.raw.focus,
          journalEntries: data.raw.journals,
          profile: profile
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await res.json();
      setReport(result.report);
    } catch (err) {
      console.error(err);
    } finally {
      setAuditing(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
      <Loader2 className="h-8 w-8 animate-spin text-[#84A59D]" />
    </div>
  );

  return (
    <div className="px-6 py-10 md:px-12 lg:max-w-7xl mx-auto space-y-12 pb-24">
      
      {/* ── HEADER ── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 bg-[#1F2937] rounded-2xl flex items-center justify-center shadow-2xl shadow-black/20">
                <BarChart3 className="h-7 w-7 text-[#84A59D]" />
             </div>
             <div>
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#9CA3AF] block">Módulo Analítico Avançado</span>
                <h1 className="text-4xl md:text-5xl font-black text-[#1F2937] tracking-tight">
                  Portal de <span className="text-[#84A59D]">Descobertas</span>
                </h1>
             </div>
          </div>
          <p className="text-[#64748B] font-medium max-w-xl leading-relaxed">
            Auditando o perfil de **{profile?.full_name?.split(' ')[0] || 'Usuário'}** para identificar padrões de foco e execução neurodivergente.
          </p>
        </div>

        <div className="flex gap-2">
           <div className="bg-white px-6 py-4 rounded-2xl border border-[#E5E7EB] shadow-sm flex items-center gap-3">
              <Activity className="h-5 w-5 text-[#84A59D]" />
              <div>
                 <span className="text-[9px] font-black text-[#9CA3AF] uppercase block">Power Score</span>
                 <span className="text-xl font-black text-[#1F2937]">{profile?.total_points || 0}</span>
              </div>
           </div>
        </div>
      </header>

      {/* ── SUMMARY GRID ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Conclusão" value={data.summary.completedTasks} total={data.summary.totalTasks} icon={<Target className="text-blue-500" />} />
        <StatCard label="Foco (Hrs)" value={data.summary.focusHours} icon={<Zap className="text-orange-500" />} />
        <StatCard label="Diários" value={data.summary.journalEntries} icon={<FileText className="text-green-500" />} />
        <StatCard label="Tendência" value="Estável" icon={<TrendingUp className="text-indigo-500" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* COLUNA ESQUERDA: GRÁFICOS VISUAIS */}
        <div className="lg:col-span-7 space-y-10">
          
          {/* GRÁFICO DE TAREFAS */}
          <section className="bg-white rounded-[3rem] p-10 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-[#F8F9FA] rounded-lg flex items-center justify-center">
                     <Activity className="h-4 w-4 text-[#1F2937]" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#1F2937]">Ritmo de Execução</h3>
               </div>
               <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Últimos 7 dias</span>
            </div>
            <div className="h-72 w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.tasksByDay}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }} />
                    <Tooltip cursor={{ fill: '#F8F9FA' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', padding: '16px' }} />
                    <Bar dataKey="completed" fill="#84A59D" radius={[8, 8, 0, 0]} barSize={20} />
                    <Bar dataKey="tasks" fill="#E5E7EB" radius={[8, 8, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>

          {/* GRÁFICO DE ENERGIA/FOCO */}
          <section className="bg-white rounded-[3rem] p-10 border border-[#E5E7EB] shadow-[0_20px_50px_rgba(0,0,0,0.02)]">
            <div className="flex items-center justify-between mb-10">
               <div className="flex items-center gap-3">
                  <div className="h-8 w-8 bg-[#F8F9FA] rounded-lg flex items-center justify-center">
                     <Zap className="h-4 w-4 text-[#1F2937]" />
                  </div>
                  <h3 className="text-sm font-black uppercase tracking-widest text-[#1F2937]">Intensidade de Foco (Min)</h3>
               </div>
               <LineChart className="h-4 w-4 text-[#9CA3AF]" />
            </div>
            <div className="h-72 w-full">
              {mounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.focusByDay}>
                    <defs>
                      <linearGradient id="colorMin" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1F2937" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#1F2937" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fontWeight: 'bold', fill: '#9CA3AF' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="minutes" stroke="#1F2937" strokeWidth={4} fillOpacity={1} fill="url(#colorMin)" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </section>
        </div>

        {/* COLUNA DIREITA: IA NEURAL AUDITOR */}
        <div className="lg:col-span-5 space-y-8">
          
          <section className="bg-[#1F2937] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl min-h-[650px] flex flex-col">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#84A59D]/10 blur-[130px] rounded-full translate-x-1/2 -translate-y-1/2" />
            
            <div className="relative z-10 flex-1 flex flex-col">
              <div className="flex items-center gap-4 mb-12">
                 <div className="h-14 w-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10">
                    <BrainCircuit className="h-7 w-7 text-[#84A59D]" />
                 </div>
                 <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em]">Auditor Neural</h2>
                    <p className="text-[10px] text-[#84A59D] font-bold uppercase tracking-widest">Processamento Heurístico</p>
                 </div>
              </div>

              <div className="flex-1">
                <AnimatePresence mode="wait">
                  {report ? (
                    <motion.div 
                      key="report"
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-8"
                    >
                      <div className="prose prose-invert prose-sm max-w-none">
                         <div className="whitespace-pre-wrap font-medium text-gray-300 leading-relaxed text-sm bg-white/5 p-6 rounded-[2rem] border border-white/5">
                            {report}
                         </div>
                      </div>
                      <div className="flex items-center gap-2 px-2 text-[#84A59D]">
                         <Info className="h-4 w-4" />
                         <span className="text-[10px] font-bold uppercase tracking-widest">Baseado em sua última semana</span>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-8 opacity-60">
                      <div className="relative">
                         <div className="absolute inset-0 bg-[#84A59D]/20 blur-3xl rounded-full scale-150 animate-pulse" />
                         <Search className="h-20 w-20 text-[#84A59D] relative z-10" />
                      </div>
                      <div className="space-y-4 px-6">
                        <h3 className="text-lg font-bold uppercase tracking-tight">Aguardando Auditoria</h3>
                        <p className="text-sm font-medium text-gray-400">
                          Pronto para cruzar seus dados de tarefas, foco e diário para identificar pontos cegos na sua produtividade.
                        </p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-12 pt-10 border-t border-white/10">
                <button 
                  onClick={runAudit}
                  disabled={auditing}
                  className="w-full bg-[#84A59D] hover:bg-[#84A59D]/80 text-white py-6 rounded-[2rem] font-black uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-2xl shadow-[#84A59D]/20 disabled:opacity-50 active:scale-95"
                >
                  {auditing ? <Loader2 className="h-6 w-6 animate-spin" /> : <Sparkles className="h-6 w-6" />}
                  {report ? "Recalibrar Auditoria" : "Iniciar Auditoria Neural"}
                </button>
              </div>
            </div>
          </section>

          {/* COMPILADO DE TUDO */}
          <section className="bg-white rounded-[2.5rem] p-10 border border-[#E5E7EB] shadow-sm">
             <div className="flex items-center gap-3 mb-10">
                <ShieldCheck className="h-5 w-5 text-[#84A59D]" />
                <h3 className="text-xs font-black uppercase tracking-widest text-[#1F2937]">Métricas de Constância</h3>
             </div>
             <div className="space-y-6">
                <AchievementItem label="Eficiência de Foco" value={`${Math.min(100, Math.round((data.summary.focusHours / 14) * 100))}%`} color="bg-[#84A59D]" />
                <AchievementItem label="Estabilidade de Humor" value="Alta" color="bg-blue-500" />
                <AchievementItem label="Execução de Tarefas" value={`${Math.min(100, Math.round((data.summary.completedTasks / (data.summary.totalTasks || 1)) * 100))}%`} color="bg-[#1F2937]" />
             </div>
          </section>

        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, total, icon }: { label: string, value: number | string, total?: number, icon: any }) {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-[#E5E7EB] shadow-sm flex items-center gap-5 group hover:border-[#84A59D]/30 transition-all">
       <div className="h-12 w-12 bg-[#F8F9FA] rounded-2xl flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform">
          {icon}
       </div>
       <div>
          <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] block mb-1">{label}</span>
          <span className="text-2xl font-black text-[#1F2937]">
            {value}{total ? <span className="text-xs text-[#9CA3AF] ml-1">/ {total}</span> : ''}
          </span>
       </div>
    </div>
  );
}

function AchievementItem({ label, value, color }: { label: string, value: any, color: string }) {
  return (
    <div className="flex items-center justify-between p-5 rounded-2xl bg-[#F8F9FA] border border-transparent hover:border-[#E5E7EB] transition-all">
       <div className="flex items-center gap-4">
          <div className={`h-2.5 w-2.5 rounded-full ${color} shadow-sm`} />
          <span className="text-[10px] font-black text-[#64748B] uppercase tracking-widest">{label}</span>
       </div>
       <span className="text-xs font-black text-[#1F2937]">{value}</span>
    </div>
  );
}
