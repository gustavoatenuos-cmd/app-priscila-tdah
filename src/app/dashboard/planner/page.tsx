"use client";

import { motion } from "framer-motion";
import { Target, Plus, Check, Sparkles, Inbox } from "lucide-react";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { syncTaskToGoogleCalendar } from "@/lib/calendar";

export default function PlannerPage() {
  const [essencial, setEssencial] = useState<any[]>([]);
  const [importantes, setImportantes] = useState<any[]>([]);
  const [opcionais, setOpcionais] = useState<any[]>([]);
  const [brainDump, setBrainDump] = useState("");
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
      setEssencial(data.filter(t => t.priority_level === 'essencial'));
      setImportantes(data.filter(t => t.priority_level === 'importante'));
      setOpcionais(data.filter(t => t.priority_level === 'opcional'));
    }
    setLoading(false);
  };

  const toggleTask = async (id: string, completed: boolean) => {
    const { error } = await supabase
      .from('tasks')
      .update({ completed: !completed })
      .eq('id', id);

    if (error) {
      toast.error("Erro ao atualizar tarefa");
    } else {
      loadTasks();
    }
  };

  const [newTaskInput, setNewTaskInput] = useState<{ [key: string]: string }>({ essencial: "", importante: "", opcional: "" });

  const addQuickTask = async (level: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    const title = newTaskInput[level];
    if (!title?.trim() || !user) return;

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: title.trim(),
      priority_level: level
    });

    if (error) {
      toast.error("Erro ao adicionar");
    } else {
      setNewTaskInput({ ...newTaskInput, [level]: "" });
      loadTasks();
      
      if (level === 'essencial') {
         const synced = await syncTaskToGoogleCalendar({ title });
         if (synced) toast.success("Sincronizado com seu Google Agenda!");
      }
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0] text-[#64748B] font-bold">Carregando seu plano...</div>;

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col min-h-screen overflow-y-auto">
        <header className="h-20 border-b border-[#E5E7EB] flex items-center justify-between px-8 md:px-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Planejamento Leve</h1>
          <button className="bg-[#1F2937] text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-black/10">
             Salvar Versão do Dia
          </button>
        </header>

        <div className="p-8 md:p-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* LEFT COLUMN: PRIORITIES 1-2-3 */}
           <div className="lg:col-span-8 space-y-8">
              
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-white rounded-[40px] p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                 <div className="flex items-center gap-3 mb-10">
                    <div className="h-8 w-8 rounded-xl bg-red-50 flex items-center justify-center text-red-400">
                       <Target className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-[#1F2937] tracking-tight">O Método 1-2-3</h2>
                      <p className="text-[10px] text-[#9CA3AF] font-black uppercase tracking-widest mt-1">Sua dose diária de foco</p>
                    </div>
                 </div>

                 <div className="space-y-12">
                    {/* 1 ESSENCIAL */}
                    <section>
                       <div className="flex justify-between items-center mb-4">
                          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">1. A Essencial (Obrigatório completar hoje)</label>
                       </div>
                       <div className="space-y-3">
                          {essencial.map(task => (
                             <PlannerItem key={task.id} task={task} onToggle={() => toggleTask(task.id, task.completed)} />
                          ))}
                          <div className="flex gap-3">
                             <input 
                                value={newTaskInput.essencial}
                                onChange={(e) => setNewTaskInput({...newTaskInput, essencial: e.target.value})}
                                onKeyDown={(e) => e.key === 'Enter' && addQuickTask('essencial')}
                                placeholder="Adicionar tarefa essencial..."
                                className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-bold text-[#1F2937] focus:outline-none focus:border-[#84A59D] transition-all"
                             />
                             <button onClick={() => addQuickTask('essencial')} className="bg-[#84A59D] text-white p-4 rounded-2xl hover:bg-[#6c8c84] transition-all shadow-sm">
                                <Plus className="h-5 w-5" />
                             </button>
                          </div>
                       </div>
                    </section>

                    {/* 2 IMPORTANTES */}
                    <section>
                       <div className="flex justify-between items-center mb-4">
                          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">2. As Importantes (Dão ritmo ao dia)</label>
                       </div>
                       <div className="space-y-3">
                          {importantes.map(task => (
                             <PlannerItem key={task.id} task={task} onToggle={() => toggleTask(task.id, task.completed)} />
                          ))}
                          <div className="flex gap-3">
                             <input 
                                value={newTaskInput.importante}
                                onChange={(e) => setNewTaskInput({...newTaskInput, importante: e.target.value})}
                                onKeyDown={(e) => e.key === 'Enter' && addQuickTask('importante')}
                                placeholder="Adicionar tarefa importante..."
                                className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-bold text-[#1F2937] focus:outline-none focus:border-[#84A59D] transition-all"
                             />
                             <button onClick={() => addQuickTask('importante')} className="bg-[#64748B] text-white p-4 rounded-2xl hover:bg-[#475569] transition-all shadow-sm">
                                <Plus className="h-5 w-5" />
                             </button>
                          </div>
                       </div>
                    </section>

                    {/* 3 OPCIONAIS */}
                    <section>
                       <div className="flex justify-between items-center mb-4">
                          <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">3. As Opcionais (Se sobrar energia)</label>
                       </div>
                       <div className="space-y-3">
                          {opcionais.map(task => (
                             <PlannerItem key={task.id} task={task} onToggle={() => toggleTask(task.id, task.completed)} />
                          ))}
                          <div className="flex gap-3">
                             <input 
                                value={newTaskInput.opcional}
                                onChange={(e) => setNewTaskInput({...newTaskInput, opcional: e.target.value})}
                                onKeyDown={(e) => e.key === 'Enter' && addQuickTask('opcional')}
                                placeholder="Adicionar tarefa opcional..."
                                className="flex-1 bg-[#F9FAFB] border border-[#E5E7EB] rounded-2xl px-5 py-4 text-sm font-bold text-[#1F2937] focus:outline-none focus:border-[#84A59D] transition-all"
                             />
                             <button onClick={() => addQuickTask('opcional')} className="bg-[#9CA3AF] text-white p-4 rounded-2xl hover:bg-[#64748B] transition-all shadow-sm">
                                <Plus className="h-5 w-5" />
                             </button>
                          </div>
                       </div>
                    </section>
                 </div>
              </motion.div>

           </div>

           {/* RIGHT COLUMN: BRAIN DUMP / QUICK INBOX */}
           <div className="lg:col-span-4 space-y-8">
              
              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-white rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-xl bg-purple-50 flex items-center justify-center text-purple-400">
                       <Inbox className="h-4 w-4" />
                    </div>
                    <h3 className="text-sm font-black text-[#333333] uppercase tracking-widest">Caixa de Entrada</h3>
                 </div>
                 <p className="text-xs text-[#64748B] font-medium mb-6 leading-relaxed">
                   Apareceu um pensamento? Anote aqui para não esquecer, mas não trate como tarefa agora.
                 </p>
                 <textarea 
                    value={brainDump}
                    onChange={(e) => setBrainDump(e.target.value)}
                    placeholder="Sua mente está cheia de quê agora?"
                    className="w-full h-40 p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-sm font-medium focus:outline-none focus:border-purple-200 resize-none"
                 />
                 <button className="w-full mt-4 py-3 bg-[#F9FAFB] hover:bg-[#F1F5F9] border border-[#E5E7EB] rounded-xl text-[10px] font-black uppercase tracking-widest text-[#9CA3AF] transition-all">
                    Processar Amanhã
                 </button>
              </motion.div>

              <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-[#1F2937] rounded-[40px] p-8 text-white shadow-xl">
                 <Sparkles className="h-6 w-6 text-[#84A59D] mb-6" />
                 <h3 className="text-xl font-black mb-2">Dica de Constância</h3>
                 <p className="text-white/60 text-sm font-medium leading-relaxed">
                   Se as 6 tarefas parecerem demais, acione o **Plano B** no Dashboard. Focar em apenas uma micro-vitória é melhor do que não fazer nada por medo da falha.
                 </p>
              </motion.div>

           </div>

        </div>
      </main>
    </div>
  );
}

function PlannerItem({ task, onToggle }: { task: any, onToggle: () => void }) {
  return (
    <div 
      onClick={onToggle}
      className={`flex items-center gap-4 p-5 rounded-[24px] border-2 transition-all cursor-pointer ${task.completed ? 'bg-[#F9FAFB] border-transparent opacity-50' : 'bg-white border-[#F1F5F9] hover:border-[#84A59D] hover:shadow-md shadow-sm'}`}
    >
       <div className={`h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-[#84A59D] border-[#84A59D] text-white' : 'border-[#E5E7EB] bg-white'}`}>
          {task.completed && <Check className="h-4 w-4" />}
       </div>
       <span className={`font-bold text-[15px] flex-1 ${task.completed ? 'line-through text-[#9CA3AF]' : 'text-[#333333]'}`}>
         {task.title}
       </span>
    </div>
  );
}

