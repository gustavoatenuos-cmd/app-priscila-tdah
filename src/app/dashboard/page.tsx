"use client";

import { motion } from "framer-motion";
import { CircleCheck, Clock, Brain, Zap, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sidebar } from "@/components/sidebar";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function NeumorphicDashboard() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState("");
  const [planoB, setPlanoB] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [stats, setStats] = useState({
    completedTasks: 0,
    totalTasks: 0,
    focusMinutes: 0,
    progress: 0
  });

  useEffect(() => {
    setCurrentDate(format(new Date(), "EEEE, MMM dd, yyyy | hh:mm a", { locale: ptBR }));
    
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/register");
        return;
      }

      const today = new Date().toISOString().split('T')[0];

      // Load Profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(profileData);

      // Check if onboarding is complete
      if (profileData && !profileData.energy_level) {
        router.push("/onboarding");
        return;
      }

      // Load All Today's Tasks for stats
      const { data: allTasks } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today);
      
      const completedCount = allTasks?.filter(t => t.completed).length || 0;
      const totalCount = allTasks?.length || 0;
      const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      // Load Today's Focus Sessions
      const { data: focusData } = await supabase
        .from('focus_sessions')
        .select('duration_minutes')
        .eq('user_id', user.id)
        .gte('created_at', today);
      
      const totalMinutes = focusData?.reduce((acc, curr) => acc + (curr.duration_minutes || 0), 0) || 0;

      setStats({
        completedTasks: completedCount,
        totalTasks: totalCount,
        focusMinutes: totalMinutes,
        progress: progressPercent
      });

      // Load Latest 3 Tasks for the list
      setTasks(allTasks?.slice(0, 3) || []);
      setLoading(false);
    }
    loadData();
  }, [router]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name?.split(' ')[0] || "Bem-vindo(a)";
    let salute = "Bom dia";
    if (hour >= 12 && hour < 18) salute = "Boa tarde";
    if (hour >= 18 || hour < 5) salute = "Boa noite";
    return `${salute}, ${name} 🌿`;
  };

  const getDecisionText = () => {
    if (planoB) return "Sua energia está reduzida, então não force. Um micro-passo agora é melhor do que a paralisia total.";
    
    const hour = new Date().getHours();
    const isMorning = hour < 12;
    const isAfternoon = hour >= 12 && hour < 18;

    if (profile?.mindset_profile === 'sobrecarga') {
      return "Tudo bem se sentir assim. Vamos focar em UM micro-passo agora. Sua mente precisa de simplicidade.";
    }

    if (profile?.mindset_profile === 'criativa') {
      return "Sua mente está cheia de conexões. Que tal descarregar o que está flutuando e escolher uma única âncora?";
    }

    if (profile?.mindset_profile === 'hiperfoco') {
       return "Você está em estado de fluxo. Canalize essa energia para o que realmente importa antes da bateria baixar.";
    }

    if (profile?.energy_level === 'baixa') {
      return "Sugerimos focar apenas na tarefa essencial agora. Respeite o seu limite biológico.";
    }
    
    if (isMorning) return "Você está em uma excelente janela de energia matinal. Ótimo momento para resolver pendências cognitivas.";
    if (isAfternoon) return "A tarde pede ritmo constante. Avance na sua prioridade e mantenha o foco no essencial.";
    return "O dia está terminando. Que tal um último esforço focado ou apenas organizar o descarrego para amanhã?";
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F0] text-[#1F2937]">
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ duration: 2, repeat: Infinity }}
        className="mb-8"
      >
        <Brain className="h-16 w-16 text-[#84A59D]" />
      </motion.div>
      <h2 className="text-xl font-black uppercase tracking-[0.2em] animate-pulse text-center px-4">Calibrando seu Ecossistema Cognitivo...</h2>
      <p className="text-[#64748B] font-medium mt-2">Personalizando sua interface de foco.</p>
    </div>
  );

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans selection:bg-[#64748B]/20">
      
      <Sidebar />

      {/* MAIN CONTENT DASHBOARD */}
      <main className="flex-1 px-8 py-10 md:px-14 lg:max-w-7xl mx-auto overflow-y-auto">
         
         <header className="mb-10 flex justify-between items-end">
           <div>
             <h1 className="text-3xl font-extrabold tracking-tight text-[#1F2937] uppercase">{getGreeting()}</h1>
             <p className="text-[#64748B] font-medium text-sm mt-1">Sua mente está {profile?.mindset_profile === 'hiperfoco' ? 'em foco' : profile?.energy_level === 'alta' ? 'vibrante' : 'calma'}. {currentDate}</p>
           </div>
           <div className="flex gap-4">
              <div className="bg-white border border-[#E5E7EB] rounded-2xl p-3 shadow-sm flex flex-col items-center min-w-[80px]">
                 <span className="text-[8px] font-black text-[#9CA3AF] uppercase">Sequência</span>
                 <span className="text-xl font-black text-[#333333]">{profile?.streak_count || 0} 🔥</span>
              </div>
           </div>
         </header>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT BIG COLUMN */}
            <div className="lg:col-span-8 flex flex-col gap-8">
               
                {/* SEU MELHOR PRÓXIMO PASSO (DYNAMIC) */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#FFFFFF] rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#84A59D]/20 border-l-[16px] border-l-[#84A59D] relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                      <Brain className="h-32 w-32" />
                   </div>
                   
                   <div className="flex items-center gap-3 mb-6">
                      <div className="h-8 w-14 rounded-xl bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
                         <Zap className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-black text-[#84A59D] uppercase tracking-widest">Decisão Inteligente</span>
                   </div>

                   <h2 className="text-3xl font-black text-[#1F2937] mb-3 leading-tight">
                     {profile?.mindset_profile === 'sobrecarga' ? 'Apenas respire e faça isto:' : 
                      'Seu melhor próximo passo'}
                   </h2>

                   <div className="flex flex-col sm:flex-row items-center gap-3 mt-8 mb-6 max-w-2xl">
                      <div className="flex items-center gap-3 bg-[#F9FAFB] p-5 rounded-2xl border border-[#E5E7EB] flex-1 w-full">
                         <div className="h-6 w-6 rounded-full border-2 border-[#84A59D] flex-shrink-0" />
                         <input 
                            type="text"
                            placeholder="Defina sua prioridade essencial..."
                            className="bg-transparent border-none focus:outline-none font-bold text-[#333333] text-lg w-full"
                            defaultValue={tasks.find(t => t.priority_level === 'essencial')?.title || ""}
                            onKeyDown={async (e) => {
                               if (e.key === 'Enter') {
                                  const title = (e.target as HTMLInputElement).value;
                                  const { data: { user } } = await supabase.auth.getUser();
                                  if (user) {
                                     await supabase.from('tasks').insert({ user_id: user.id, title, priority_level: 'essencial' });
                                     window.location.reload();
                                  }
                               }
                            }}
                         />
                      </div>
                      <Link href="/dashboard/sos" className="bg-red-50 hover:bg-red-100 text-red-500 px-6 py-5 rounded-2xl font-bold text-sm uppercase tracking-widest transition-all border border-red-100 flex items-center gap-2 shrink-0">
                         <Zap className="h-4 w-4" /> Travei
                      </Link>
                   </div>

                   <p className="text-[#64748B] font-medium text-lg max-w-xl leading-relaxed">
                     {getDecisionText()}
                   </p>

                   <div className="mt-10 flex gap-4">
                      <Link href="/dashboard/focus" className="bg-[#333333] hover:bg-black text-white px-8 py-5 rounded-[20px] font-bold text-sm uppercase tracking-widest transition-all shadow-xl shadow-black/10 flex items-center gap-3">
                        {profile?.mindset_profile === 'sobrecarga' ? 'Fazer só isto' : 'Aceitar Sugestão'} <ArrowRight className="h-4 w-4" />
                      </Link>
                     {profile?.mindset_profile === 'sobrecarga' && (
                        <button onClick={() => setPlanoB(true)} className="px-8 py-5 rounded-[20px] font-bold text-sm uppercase tracking-widest text-[#64748B] hover:text-[#333333] transition-all">
                           Ativar Plano B
                        </button>
                     )}
                   </div>
                </motion.div>

               {/* MONITOR DE DESEMPENHO MINI */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#FFFFFF] rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex flex-col md:flex-row items-center gap-10">
                  {/* Circular Progress SVG */}
                  <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                     <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                       <circle cx="50" cy="50" r="42" stroke="#F1F5F9" strokeWidth="10" fill="none" />
                       <circle 
                         cx="50" cy="50" r="42" 
                         stroke="#64748B" 
                         strokeWidth="10" 
                         fill="none" 
                         strokeDasharray="264" 
                         strokeDashoffset={264 - (264 * stats.progress) / 100} 
                         strokeLinecap="round" 
                         className="transition-all duration-1000 ease-out"
                       />
                     </svg>
                     <div className="absolute flex flex-col items-center">
                       <span className="text-3xl font-black text-[#333333] font-mono tracking-tighter">{stats.progress}%</span>
                       <span className="text-[9px] uppercase font-black text-[#64748B] tracking-widest mt-1">Feito</span>
                     </div>
                  </div>
 
                  <div className="grid grid-cols-2 gap-8 w-full">
                     <div>
                       <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Tarefas</h3>
                       <span className="text-2xl font-black text-[#333333] font-mono tracking-tighter">{stats.completedTasks}/{stats.totalTasks}</span>
                     </div>
                     <div>
                       <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-1">Foco Real</h3>
                       <span className="text-2xl font-black text-[#333333] font-mono tracking-tighter">{stats.focusMinutes}m</span>
                     </div>
                      <div className="col-span-2 pt-4 border-t border-dashed border-[#F1F5F9]">
                         <p className="text-[11px] text-[#64748B] font-medium italic">
                           {stats.progress === 100 ? "&quot;Você completou tudo o que se propôs! Orgulhe-se.&quot;" : 
                            stats.progress > 50 ? "&quot;Você está com ótimo ritmo hoje. Mantenha a constância.&quot;" :
                            "&quot;Cada micro-passo conta. O importante é não parar.&quot;"}
                         </p>
                      </div>
                  </div>
               </motion.div>

               {/* UPCOMING SCHEDULE PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-[#FFFFFF] rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex-1">
                  <div className="flex justify-between items-center mb-10">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Agenda & Fluxo</h2>
                    <span className="bg-[#84A59D]/10 text-[#84A59D] text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">Sincronizado</span>
                  </div>
                  
                  <div className="relative pl-8 border-l-2 border-[#F1F5F9] space-y-12 ml-4">
                     {tasks.length > 0 ? (
                        tasks.slice(0, 2).map((task, idx) => (
                           <div key={task.id} className="relative group">
                              <div className="absolute w-5 h-5 rounded-full bg-[#84A59D] -left-[42px] top-1 border-[4px] border-[#FFFFFF] shadow-sm group-hover:scale-125 transition-transform"></div>
                              <div className="flex flex-col gap-1">
                                 <span className="text-[10px] font-black text-[#9CA3AF] font-mono uppercase tracking-widest leading-none">Fluxo Atual</span>
                                 <span className={`text-[16px] font-bold ${task.completed ? 'text-[#9CA3AF] line-through' : 'text-[#333333]'}`}>{task.title}</span>
                              </div>
                           </div>
                        ))
                     ) : (
                        <div className="relative group">
                           <div className="absolute w-5 h-5 rounded-full bg-[#E5E7EB] -left-[42px] top-1 border-[4px] border-[#FFFFFF] shadow-sm"></div>
                           <p className="text-[14px] text-[#9CA3AF] italic">Nenhuma atividade planejada.</p>
                        </div>
                     )}

                     {/* SUGGESTED WINDOW */}
                     <div className="relative group">
                        <div className="absolute w-5 h-5 rounded-full bg-[#64748B] -left-[42px] top-1 border-[4px] border-[#FFFFFF] shadow-sm ring-4 ring-[#64748B]/10 group-hover:scale-125 transition-transform"></div>
                        <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#64748B]/10">
                           <span className="text-[10px] font-black text-[#64748B] font-mono uppercase tracking-widest block mb-1">Janela de Foco</span>
                           <span className="text-[16px] font-bold text-[#1F2937]">Melhor momento para Deep Work</span>
                           <p className="text-[11px] text-[#64748B] mt-1">Sua energia está {profile?.energy_level === 'alta' ? 'no pico' : 'estável'}. Aproveite.</p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>

            {/* RIGHT SMALL COLUMN */}
            <div className="lg:col-span-4 flex flex-col gap-8">
               
               {/* 3 PRIORIDADES PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-[#FFFFFF] rounded-[40px] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h2 className="text-xl font-black text-[#1F2937] tracking-tight">O Foco de Hoje</h2>
                      <p className="text-xs text-[#9CA3AF] font-bold uppercase mt-1">Três é o número mágico</p>
                    </div>
                    
                    <button 
                      onClick={() => setPlanoB(!planoB)}
                      className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                        planoB ? 'bg-orange-100 text-orange-500 border-orange-200' : 'bg-[#F1F5F9] text-[#9CA3AF] border-transparent'
                      }`}
                    >
                      Mudar para Plano B
                    </button>
                  </div>
                  
                  <div className="space-y-6">
                     {tasks.length > 0 ? (
                       tasks.map((task, idx) => (
                         <PrioridadeItem 
                            key={task.id} 
                            index={idx + 1} 
                            label={task.priority_level} 
                            title={planoB ? `Modo Leve: ${task.title}` : task.title} 
                            completed={task.completed} 
                          />
                       ))
                     ) : (
                       <p className="text-xs text-[#9CA3AF]">Nenhuma tarefa definida para hoje.</p>
                     )}
                  </div>

                  <div className="mt-10 pt-8 border-t border-[#F1F5F9] text-center">
                    <p className="text-[#64748B] text-sm font-medium italic">
                       {planoB ? "✨ Hoje o mínimo é o seu 100%. Sem culpa." : "✨ Focar em 3 coisas te dá liberdade, não limite."}
                    </p>
                  </div>
               </motion.div>

               {/* FOCUS SESSION PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#FFFFFF] rounded-3xl p-6 md:p-8 shadow-[0_12px_40px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Deep Work</h2>
                    <span className="text-[#9CA3AF] tracking-widest font-bold">•••</span>
                  </div>

                  <div className="flex flex-col items-center">
                    <button className="w-full bg-[#64748B] hover:bg-[#475569] text-white font-bold text-xs tracking-widest uppercase py-4 rounded-xl transition-all shadow-md shadow-[#64748B]/20">
                      Iniciar / Parar
                    </button>
                    
                    <div className="mt-6 text-center">
                      <span className="text-3xl font-black text-[#333333] font-mono">00:45:00</span>
                      <span className="text-sm font-bold text-[#9CA3AF] font-mono ml-2">/ 01:00:00</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-6 pt-6 border-t border-[#E5E7EB]/50">
                     <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-widest">Foco Isolado</span>
                     <div className="h-6 w-10 bg-[#64748B] rounded-full p-1 flex justify-end items-center cursor-pointer">
                        <div className="h-4 w-4 bg-white rounded-full"></div>
                     </div>
                  </div>
               </motion.div>

               {/* WELLNESS CHECK PANEL */}
               <motion.div initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-[#FFFFFF] rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-sm font-bold text-[#333333] tracking-widest uppercase">Energia & Bem-estar</h2>
                    <Sparkles className="h-5 w-5 text-[#84A59D]" />
                  </div>

                  <div className="space-y-6">
                     <WellnessBar 
                        label="Hidratação" 
                        value={profile?.energy_level === 'alta' ? "85%" : "60%"} 
                        desc={profile?.energy_level === 'alta' ? "Excelente! Hidratação em dia." : "Lembre-se de beber água para manter o foco."} 
                     />
                     <WellnessBar 
                        label="Descanso" 
                        value={profile?.energy_level === 'alta' ? "90%" : "50%"} 
                        desc={profile?.energy_level === 'alta' ? "Seu sono foi restaurador." : "Sentindo cansaço? Uma pausa curta pode ajudar."} 
                     />
                     <WellnessBar 
                        label="Humor" 
                        value={profile?.mindset_profile === 'sobrecarga' ? "30%" : "75%"} 
                        desc={profile?.mindset_profile === 'sobrecarga' ? "Detectamos sinais de estresse." : "Você parece em equilíbrio hoje."} 
                     />
                  </div>
               </motion.div>

            </div>
         </div>
      </main>
    </div>
  );
}

function WellnessBar({ label, value, desc }: { label: string, value: string, desc: string }) {
  return (
    <div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-[#333333]">{label}</span>
        <span className="text-xs font-black text-[#84A59D]">{value}</span>
      </div>
      <div className="w-full h-3 bg-[#F1F5F9] rounded-full overflow-hidden mb-2">
         <div className="h-full bg-[#84A59D] transition-all duration-1000" style={{ width: value }}></div>
      </div>
      <p className="text-[10px] font-medium text-[#9CA3AF]">{desc}</p>
    </div>
  );
}

function PrioridadeItem({ index, label, title, completed }: { index: number, label: string, title: string, completed: boolean }) {
  return (
    <div className={`flex items-center gap-5 p-5 rounded-[24px] transition-all border ${completed ? 'bg-[#F9FAFB] border-transparent opacity-60' : 'bg-white border-[#E5E7EB]/30 shadow-sm'}`}>
       <div className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-black border-2 shrink-0 ${completed ? 'bg-[#84A59D] border-[#84A59D] text-white' : 'border-[#E5E7EB] text-[#9CA3AF]'}`}>
          {completed ? <CircleCheck className="h-5 w-5" /> : index}
       </div>
       <div className="flex-1">
         <span className="text-[9px] font-black uppercase tracking-widest text-[#9CA3AF] block mb-1">{label}</span>
         <span className={`text-[16px] font-bold ${completed ? 'text-[#9CA3AF] line-through' : 'text-[#333333]'}`}>
           {title}
         </span>
       </div>
    </div>
  );
}
