"use client";

import { motion } from "framer-motion";
import { Target, Clock, Heart, Battery, Sparkles, Sidebar as SidebarIcon } from "lucide-react";
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
  Cell
} from "recharts";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabase";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    focusEfficiency: 0,
    concluionRate: 0,
    totalMinutes: 0,
    streak: 0
  });

  const [radarData, setRadarData] = useState([
    { subject: "Foco", A: 0, fullMark: 100 },
    { subject: "Rotina", A: 0, fullMark: 100 },
    { subject: "Saúde", A: 0, fullMark: 100 },
    { subject: "Lazer", A: 0, fullMark: 100 },
    { subject: "Mindset", A: 0, fullMark: 100 },
    { subject: "Estudos", A: 0, fullMark: 100 },
  ]);

  const [energyData, setEnergyData] = useState<any[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Fetch Profile for streak
      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

      // 2. Fetch Tasks for completion rate
      const { data: tasks } = await supabase.from('tasks').select('*').eq('user_id', user.id);
      const totalTasks = tasks?.length || 0;
      const completedTasks = tasks?.filter(t => t.completed).length || 0;
      const rate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      // 3. Fetch Focus Sessions
      const { data: sessions } = await supabase.from('focus_sessions').select('*').eq('user_id', user.id);
      const totalMins = sessions?.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) || 0;
      
      // Calculate efficiency: (duration / (duration + distractions*5)) - just a mock logic
      const totalDistractions = sessions?.reduce((acc, curr) => acc + (curr.distractions_count || 0), 0) || 0;
      const efficiency = totalMins > 0 ? Math.max(0, 100 - (totalDistractions * 10)) : 0;

      setStats({
        focusEfficiency: efficiency,
        concluionRate: rate,
        totalMinutes: totalMins,
        streak: profile?.streak_count || 0
      });

      // Update Radar Data (Simulated based on categories or just randomizing for now based on real rate)
      setRadarData([
        { subject: "Foco", A: efficiency, fullMark: 100 },
        { subject: "Rotina", A: rate, fullMark: 100 },
        { subject: "Saúde", A: 70, fullMark: 100 },
        { subject: "Lazer", A: 40, fullMark: 100 },
        { subject: "Mindset", A: 75, fullMark: 100 },
        { subject: "Estudos", A: 85, fullMark: 100 },
      ]);

      // Energy Data (Mocking a curve based on user's peak_time)
      const peak = profile?.peak_time || 'manha';
      const baseEnergy = [
        { hour: "8h", level: peak === 'manha' ? 90 : 60 },
        { hour: "10h", level: peak === 'manha' ? 95 : 70 },
        { hour: "12h", level: 60 },
        { hour: "14h", level: 40 },
        { hour: "16h", level: peak === 'tarde' ? 90 : 70 },
        { hour: "18h", level: peak === 'noite' ? 80 : 85 },
        { hour: "20h", level: peak === 'noite' ? 95 : 50 },
      ];
      setEnergyData(baseEnergy);

      setLoading(false);
    }
    loadAnalytics();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">Analisando seus padrões...</div>;

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col min-h-screen overflow-y-auto">
        <header className="h-20 border-b border-[#E5E7EB] flex items-center px-8 md:px-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Métricas que Fazem Sentido</h1>
        </header>

        <div className="p-8 md:p-12 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* INSIGHT HUMANO (O MAIS IMPORTANTE) */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="lg:col-span-12 bg-[#FFFFFF] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.02)] border border-[#84A59D]/20 border-l-[12px] border-l-[#84A59D] flex flex-col md:flex-row items-center gap-8">
            <div className="h-20 w-20 bg-[#84A59D]/10 rounded-full flex items-center justify-center text-[#84A59D] shrink-0">
               <Sparkles className="h-10 w-10" />
            </div>
            <div>
               <h2 className="text-2xl font-black text-[#1F2937] mb-2 leading-tight">
                 {stats.concluionRate > 70 ? "Sua consistência está incrível! 🚀" : "Cada micro-passo é uma vitória. 🌿"}
               </h2>
               <p className="text-[#64748B] font-medium text-lg leading-relaxed">
                 Sua taxa de conclusão atual é de <span className="text-[#84A59D] font-bold">{stats.concluionRate}%</span>. 
                 Você já acumulou <span className="text-[#84A59D] font-bold">{stats.totalMinutes} minutos</span> de foco profundo.
                 {stats.streak > 0 ? ` Sua sequência de ${stats.streak} dias mostra que você está construindo novos caminhos neurais.` : " Comece hoje sua nova sequência!"}
               </p>
            </div>
          </motion.div>

          {/* PADRÃO DE ENERGIA */}
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="lg:col-span-7 bg-[#FFFFFF] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.02)] border border-[#E5E7EB]/50">
             <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-bold text-[#333333] tracking-widest uppercase flex items-center gap-2">
                  <Battery className="h-4 w-4 text-orange-400" /> Níveis de Energia
                </h3>
             </div>
             <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={energyData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey="hour" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700, fill: '#9CA3AF' }} />
                    <Tooltip 
                      cursor={{ fill: '#F1F5F9' }} 
                      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}
                    />
                    <Bar dataKey="level" radius={[10, 10, 0, 0]}>
                      {energyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.level > 70 ? '#84A59D' : '#64748B'} opacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

          {/* RODA DA VIDA MINI */}
          <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-5 bg-[#FFFFFF] rounded-[32px] p-8 shadow-[0_12px_40px_rgba(0,0,0,0.02)] border border-[#E5E7EB]/50 flex flex-col">
             <h3 className="text-sm font-bold text-[#333333] tracking-widest uppercase mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-[#84A59D]" /> Equilíbrio Semanal
             </h3>
             <div className="flex-1 min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid stroke="#F1F5F9" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#9CA3AF', fontSize: 10, fontWeight: 700 }} />
                    <Radar dataKey="A" stroke="#84A59D" fill="#84A59D" fillOpacity={0.1} />
                  </RadarChart>
                </ResponsiveContainer>
             </div>
          </motion.div>

          {/* CARDS DE PERFORMANCE HUMANA */}
          <div className="lg:col-span-4 bg-white p-6 rounded-[32px] border border-[#E5E7EB]/50 shadow-sm flex items-center gap-5">
             <div className="h-12 w-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-400 shrink-0">
               <Clock className="h-6 w-6" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Efeito do Timer</h4>
                <p className="text-sm font-bold text-[#333333]">+22% de Conclusão</p>
             </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-[32px] border border-[#E5E7EB]/50 shadow-sm flex items-center gap-5">
             <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-400 shrink-0">
               <SidebarIcon className="h-6 w-6" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Ritual de Entrada</h4>
                <p className="text-sm font-bold text-[#333333]">Foco 12m mais rápido</p>
             </div>
          </div>

          <div className="lg:col-span-4 bg-white p-6 rounded-[32px] border border-[#E5E7EB]/50 shadow-sm flex items-center gap-5">
             <div className="h-12 w-12 rounded-2xl bg-pink-50 flex items-center justify-center text-pink-400 shrink-0">
               <Heart className="h-6 w-6" />
             </div>
             <div>
                <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Saúde Mental</h4>
                <p className="text-sm font-bold text-[#333333]">Menos culpa acumulada</p>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}
