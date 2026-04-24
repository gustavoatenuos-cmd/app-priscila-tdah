"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Check, Sparkles, Inbox, ArrowRight, Brain, CircleCheck, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { syncTaskToGoogleCalendar } from "@/lib/calendar";

type PlannerStage = 'dump' | 'prioritize' | 'confirm';

export default function PlannerPage() {
  const [plannerStage, setPlannerStage] = useState<PlannerStage>('dump');
  const [essencial, setEssencial] = useState<any[]>([]);
  const [importantes, setImportantes] = useState<any[]>([]);
  const [opcionais, setOpcionais] = useState<any[]>([]);
  const [inbox, setInbox] = useState<string>("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setTasks(data);
      setEssencial(data.filter(t => t.priority_level === 'essencial' && !t.completed));
      setImportantes(data.filter(t => t.priority_level === 'importante' && !t.completed));
      setOpcionais(data.filter(t => t.priority_level === 'opcional' && !t.completed));
    }
    setLoading(false);
  };

  const addInboxTask = async () => {
    if (!inbox.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: inbox.trim(),
      priority_level: 'opcional' // Default to opcional until prioritized
    });

    if (error) toast.error("Erro ao adicionar");
    else {
      setInbox("");
      loadTasks();
    }
  };

  const updatePriority = async (id: string, level: string) => {
    const { error } = await supabase
      .from('tasks')
      .update({ priority_level: level })
      .eq('id', id);
    
    if (error) toast.error("Erro ao priorizar");
    else loadTasks();
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) toast.error("Erro ao deletar");
    else loadTasks();
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
      <Brain className="h-8 w-8 animate-spin text-[#84A59D]" />
    </div>
  );

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col min-h-screen relative">
        
        <header className="h-20 border-b border-[#E5E7EB] flex items-center justify-between px-8 md:px-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tight text-[#1F2937] uppercase">Planejamento em Etapas</h1>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2">
                {[1,2,3].map(s => (
                  <div key={s} className={`h-2 w-8 rounded-full transition-all ${
                    (plannerStage === 'dump' && s === 1) || 
                    (plannerStage === 'prioritize' && s <= 2) || 
                    (plannerStage === 'confirm' && s <= 3) ? 'bg-[#1F2937]' : 'bg-[#E5E7EB]'
                  }`} />
                ))}
             </div>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full flex-1 flex flex-col">
          
          <AnimatePresence mode="wait">
            
            {/* STAGE 1: DUMP (Despejo Mental) */}
            {plannerStage === 'dump' && (
              <motion.div 
                key="dump"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col items-center text-center py-10"
              >
                <div className="h-20 w-20 bg-purple-50 rounded-[35%] flex items-center justify-center mb-8 text-purple-400 shadow-sm">
                   <Inbox className="h-10 w-10" />
                </div>
                <h2 className="text-4xl font-black text-[#1F2937] mb-4">Etapa 01: Esvazie a Mente</h2>
                <p className="text-[#64748B] font-medium text-lg mb-12 max-w-2xl leading-relaxed">
                  Não tente organizar agora. Apenas jogue para fora tudo o que está ocupando espaço no seu cérebro. Cada item aqui é menos um peso para você carregar.
                </p>

                <div className="w-full max-w-xl flex gap-4 mb-12">
                   <input 
                    type="text"
                    placeholder="O que está na sua cabeça agora?"
                    className="flex-1 bg-white border-2 border-[#E5E7EB] p-6 rounded-3xl text-lg font-bold text-[#1F2937] focus:border-purple-300 focus:outline-none shadow-sm transition-all"
                    value={inbox}
                    onChange={(e) => setInbox(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addInboxTask()}
                   />
                   <button onClick={addInboxTask} className="bg-[#1F2937] text-white px-8 rounded-3xl font-black hover:bg-black transition-all">
                      JOGAR
                   </button>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                   {tasks.filter(t => !t.completed).map(t => (
                     <div key={t.id} className="bg-white/50 p-5 rounded-2xl border border-[#E5E7EB] flex items-center justify-between group">
                        <span className="font-bold text-[#1F2937]">{t.title}</span>
                        <button onClick={() => deleteTask(t.id)} className="text-[#9CA3AF] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                           <Trash2 className="h-4 w-4" />
                        </button>
                     </div>
                   ))}
                </div>

                <button 
                  onClick={() => setPlannerStage('prioritize')}
                  className="bg-[#1F2937] hover:bg-black text-white px-12 py-6 rounded-3xl font-black text-xl shadow-2xl flex items-center gap-4 transition-all group"
                >
                  Próxima Etapa: Priorizar <ArrowRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {/* STAGE 2: PRIORITIZE (1-2-3) */}
            {plannerStage === 'prioritize' && (
              <motion.div 
                key="prioritize"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col h-full"
              >
                <div className="text-center mb-12">
                   <h2 className="text-3xl font-black text-[#1F2937] mb-2">Etapa 02: O Filtro 1-2-3</h2>
                   <p className="text-[#64748B] font-medium">Arraste a prioridade de cada item. TDAH precisa de limites: 1 Essencial, 2 Importantes, 3 Opcionais.</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8 items-start mb-12">
                   {/* Colunas de Prioridade */}
                   <PriorityZone 
                    level="essencial" 
                    title="1. Essencial" 
                    color="bg-red-50 text-red-500" 
                    tasks={essencial} 
                    onUpdate={updatePriority}
                   />
                   <PriorityZone 
                    level="importante" 
                    title="2. Importante" 
                    color="bg-blue-50 text-blue-500" 
                    tasks={importantes} 
                    onUpdate={updatePriority}
                   />
                   <PriorityZone 
                    level="opcional" 
                    title="3. Opcional" 
                    color="bg-green-50 text-green-500" 
                    tasks={opcionais} 
                    onUpdate={updatePriority}
                   />
                </div>

                <div className="flex justify-between items-center mt-auto pt-10 border-t border-[#E5E7EB]">
                   <button onClick={() => setPlannerStage('dump')} className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest hover:text-[#1F2937]">Voltar para Despejo</button>
                   <button 
                    onClick={() => setPlannerStage('confirm')}
                    className="bg-[#1F2937] hover:bg-black text-white px-12 py-5 rounded-3xl font-black text-lg shadow-xl flex items-center gap-4 transition-all group"
                   >
                     Finalizar Plano <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: CONFIRM (Selo de Compromisso) */}
            {plannerStage === 'confirm' && (
              <motion.div 
                key="confirm"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center py-10 h-full"
              >
                <div className="h-24 w-24 bg-[#84A59D]/10 rounded-full flex items-center justify-center mb-8 text-[#84A59D] shadow-inner">
                   <CircleCheck className="h-12 w-12" />
                </div>
                <h2 className="text-4xl font-black text-[#1F2937] mb-4">Plano Selado. 💎</h2>
                <p className="text-[#64748B] font-medium text-lg mb-12 max-w-xl leading-relaxed">
                  Você não precisa mais pensar no "o que fazer". O seu eu do futuro agradece por essa clareza. Vamos ganhar seus pontos de hoje?
                </p>

                <div className="bg-white p-10 rounded-[48px] border-2 border-[#1F2937] shadow-2xl w-full max-w-md mb-12 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-4">
                      <Sparkles className="h-6 w-6 text-[#84A59D]" />
                   </div>
                   <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-6">Contrato de Hoje</h3>
                   <div className="space-y-4 text-left">
                      {essencial.map(t => (
                        <div key={t.id} className="flex items-center gap-3">
                           <div className="h-2 w-2 rounded-full bg-red-400" />
                           <span className="font-bold text-[#1F2937]">{t.title}</span>
                        </div>
                      ))}
                      {importantes.slice(0, 2).map(t => (
                        <div key={t.id} className="flex items-center gap-3 opacity-60">
                           <div className="h-2 w-2 rounded-full bg-blue-400" />
                           <span className="font-bold text-[#1F2937] text-sm">{t.title}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <button 
                  onClick={async () => {
                    const { data: { user } } = await supabase.auth.getUser();
                    if (user) {
                       const { data: profile } = await supabase.from('profiles').select('total_points').eq('id', user.id).single();
                       await supabase.from('profiles').update({ total_points: (profile?.total_points || 0) + 50 }).eq('id', user.id);
                       toast.success("Plano ativado! +50 Pontos de Clareza. 🚀");
                    }
                    window.location.href = "/dashboard";
                  }}
                  className="bg-[#1F2937] hover:bg-black text-white px-20 py-8 rounded-[40px] font-black text-2xl shadow-3xl transition-all transform hover:scale-105 active:scale-95"
                >
                  Ativar Meu Dia
                </button>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

function PriorityZone({ level, title, color, tasks, onUpdate }: { level: string, title: string, color: string, tasks: any[], onUpdate: (id: string, level: string) => void }) {
  return (
    <div className="bg-white p-6 rounded-[32px] border border-[#E5E7EB] shadow-sm flex flex-col min-h-[300px]">
       <div className={`px-4 py-2 rounded-xl mb-6 text-[10px] font-black uppercase tracking-widest ${color}`}>
          {title}
       </div>
       <div className="space-y-3 flex-1">
          {tasks.map(t => (
            <div key={t.id} className="bg-[#F9FAFB] p-4 rounded-2xl border border-[#E5E7EB] text-sm font-bold text-[#1F2937] relative group">
               {t.title}
               <div className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {level !== 'essencial' && <button onClick={() => onUpdate(t.id, 'essencial')} className="h-6 w-6 bg-red-100 text-red-500 rounded-lg text-[8px] flex items-center justify-center font-black">1</button>}
                  {level !== 'importante' && <button onClick={() => onUpdate(t.id, 'importante')} className="h-6 w-6 bg-blue-100 text-blue-500 rounded-lg text-[8px] flex items-center justify-center font-black">2</button>}
                  {level !== 'opcional' && <button onClick={() => onUpdate(t.id, 'opcional')} className="h-6 w-6 bg-green-100 text-green-500 rounded-lg text-[8px] flex items-center justify-center font-black">3</button>}
               </div>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-[10px] text-[#9CA3AF] text-center font-bold mt-10 italic">Nenhum item...</p>}
       </div>
    </div>
  );
}
