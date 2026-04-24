"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, Plus, Check, Sparkles, Inbox, ArrowRight, Brain, CircleCheck, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { syncTaskToGoogleCalendar } from "@/lib/calendar";

import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type PlannerStage = 'dump' | 'prioritize' | 'confirm';

export default function PlannerPage() {
  const [plannerStage, setPlannerStage] = useState<PlannerStage>('dump');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [inbox, setInbox] = useState<string>("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

    if (data) setTasks(data);
    setLoading(false);
  };

  const getTasksByPriority = (level: string) => tasks.filter(t => t.priority_level === level && !t.completed);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    // Se arrastou para cima de uma coluna (container)
    const isOverAColumn = ['essencial', 'importante', 'opcional'].includes(overId);
    
    if (isOverAColumn && activeTask.priority_level !== overId) {
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, priority_level: overId } : t));
      return;
    }

    // Se arrastou para cima de outra tarefa
    const overTask = tasks.find(t => t.id === overId);
    if (overTask && activeTask.priority_level !== overTask.priority_level) {
      setTasks(prev => prev.map(t => t.id === activeId ? { ...t, priority_level: overTask.priority_level } : t));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeTask = tasks.find(t => t.id === activeId);
    if (!activeTask) return;

    let newPriority = activeTask.priority_level;
    if (['essencial', 'importante', 'opcional'].includes(overId)) {
      newPriority = overId;
    } else {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) newPriority = overTask.priority_level;
    }

    // Persistir no banco
    const { error } = await supabase
      .from('tasks')
      .update({ priority_level: newPriority })
      .eq('id', activeId);

    if (error) {
      toast.error("Erro ao salvar prioridade");
      loadTasks();
    }
  };

  const addInboxTask = async () => {
    if (!inbox.trim()) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from('tasks').insert({
      user_id: user.id,
      title: inbox.trim(),
      priority_level: 'opcional'
    });

    if (error) toast.error("Erro ao adicionar");
    else {
      setInbox("");
      loadTasks();
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) toast.error("Erro ao deletar");
    else loadTasks();
  };

  const saveEdit = async () => {
    if (!editingId || !editValue.trim()) {
      setEditingId(null);
      return;
    }

    const { error } = await supabase
      .from('tasks')
      .update({ title: editValue.trim() })
      .eq('id', editingId);

    if (error) toast.error("Erro ao atualizar");
    else {
      setTasks(prev => prev.map(t => t.id === editingId ? { ...t, title: editValue.trim() } : t));
      setEditingId(null);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
      <Brain className="h-8 w-8 animate-spin text-[#84A59D]" />
    </div>
  );

  return (
    <div className="w-full flex flex-col min-h-screen relative">

        <header className="h-16 md:h-20 border-b border-[#E5E7EB] flex items-center justify-between px-6 md:px-12 bg-white/60 backdrop-blur-md md:sticky top-0 z-30">

          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tight text-[#1F2937] uppercase text-xs">Planejamento em Etapas</h1>
          </div>
          <div className="flex items-center gap-2">
            {[1, 2, 3].map(s => (
              <div key={s} className={`h-1.5 w-6 rounded-full transition-all ${
                (plannerStage === 'dump' && s === 1) || 
                (plannerStage === 'prioritize' && s <= 2) || 
                (plannerStage === 'confirm' && s <= 3) ? 'bg-[#1F2937]' : 'bg-[#E5E7EB]'
              }`} />
            ))}
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-7xl mx-auto w-full flex-1 flex flex-col">
          <AnimatePresence mode="wait">
            {plannerStage === 'dump' && (
              <motion.div key="dump" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col items-center text-center">
                <div className="h-16 w-16 bg-white rounded-2xl flex items-center justify-center mb-6 text-[#84A59D] shadow-sm border border-[#E5E7EB]">
                   <Inbox className="h-8 w-8" />
                </div>
                <h2 className="text-3xl font-black text-[#1F2937] mb-3 uppercase tracking-tighter">Etapa 01: Esvazie a Mente</h2>
                <p className="text-[#64748B] font-medium mb-10 max-w-xl text-sm leading-relaxed">
                  Não tente organizar agora. Apenas jogue para fora tudo o que está ocupando espaço no seu cérebro.
                </p>

                <div className="w-full max-w-xl flex gap-3 mb-10">
                   <input 
                    type="text"
                    placeholder="O que está na sua cabeça agora?"
                    className="flex-1 bg-white border border-[#E5E7EB] p-5 rounded-2xl text-sm font-bold text-[#1F2937] focus:border-[#1F2937] focus:outline-none shadow-sm transition-all"
                    value={inbox}
                    onChange={(e) => setInbox(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addInboxTask()}
                   />
                   <button onClick={addInboxTask} className="bg-[#1F2937] text-white px-8 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all">JOGAR</button>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
                   {tasks.filter(t => !t.completed).map(t => (
                     <div key={t.id} className="bg-white/80 p-4 rounded-xl border border-[#E5E7EB] flex items-center justify-between group shadow-sm">
                        <span className="font-bold text-sm text-[#1F2937]">{t.title}</span>
                        <button onClick={() => deleteTask(t.id)} className="text-[#9CA3AF] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                           <Trash2 className="h-4 w-4" />
                        </button>
                     </div>
                   ))}
                </div>

                <button onClick={() => setPlannerStage('prioritize')} className="bg-[#1F2937] hover:bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 transition-all group">
                  Próxima Etapa: Priorizar <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </motion.div>
            )}

            {plannerStage === 'prioritize' && (
              <motion.div key="prioritize" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col h-full">
                <div className="text-center mb-10">
                   <h2 className="text-2xl font-black text-[#1F2937] mb-2 uppercase tracking-tighter">Etapa 02: O Filtro Kanban 1-2-3</h2>
                   <p className="text-[#64748B] font-medium text-xs">Arraste os cards para definir o nível de prioridade. TDAH precisa de limites claros.</p>
                </div>

                <DndContext 
                  sensors={sensors} 
                  collisionDetection={closestCorners} 
                  onDragStart={handleDragStart} 
                  onDragOver={handleDragOver} 
                  onDragEnd={handleDragEnd}
                >
                  <div className="grid lg:grid-cols-3 gap-6 items-start flex-1">
                    <KanbanColumn 
                      id="essencial" 
                      title="1. Essencial" 
                      color="border-red-200 bg-red-50/30 text-red-600" 
                      tasks={getTasksByPriority('essencial')} 
                      editingId={editingId}
                      editValue={editValue}
                      setEditingId={setEditingId}
                      setEditValue={setEditValue}
                      saveEdit={saveEdit}
                    />
                    <KanbanColumn 
                      id="importante" 
                      title="2. Importante" 
                      color="border-blue-200 bg-blue-50/30 text-blue-600" 
                      tasks={getTasksByPriority('importante')} 
                      editingId={editingId}
                      editValue={editValue}
                      setEditingId={setEditingId}
                      setEditValue={setEditValue}
                      saveEdit={saveEdit}
                    />
                    <KanbanColumn 
                      id="opcional" 
                      title="3. Opcional" 
                      color="border-green-200 bg-green-50/30 text-green-600" 
                      tasks={getTasksByPriority('opcional')} 
                      editingId={editingId}
                      editValue={editValue}
                      setEditingId={setEditingId}
                      setEditValue={setEditValue}
                      saveEdit={saveEdit}
                    />
                  </div>
                  
                  <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                      styles: { active: { opacity: '0.5' } }
                    })
                  }}>
                    {activeId ? (
                      <KanbanCard 
                        task={tasks.find(t => t.id === activeId)!} 
                        isDragging 
                      />
                    ) : null}
                  </DragOverlay>
                </DndContext>

                <div className="flex justify-between items-center mt-12 pt-8 border-t border-[#E5E7EB]">
                   <button onClick={() => setPlannerStage('dump')} className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] hover:text-[#1F2937]">Voltar para Despejo</button>
                   <button onClick={() => setPlannerStage('confirm')} className="bg-[#1F2937] hover:bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl flex items-center gap-3 transition-all group">
                     Finalizar Plano <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>
              </motion.div>
            )}

            {plannerStage === 'confirm' && (
              <motion.div key="confirm" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center text-center py-10 h-full">
                <div className="h-20 w-20 bg-[#84A59D]/10 rounded-full flex items-center justify-center mb-6 text-[#84A59D] shadow-inner">
                   <CircleCheck className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black text-[#1F2937] mb-3 uppercase tracking-tighter">Plano Selado. 💎</h2>
                <p className="text-[#64748B] font-medium text-sm mb-10 max-w-md leading-relaxed">
                  Tudo pronto. O seu "eu do futuro" agradece pela clareza. Vamos ativar seu dia?
                </p>

                <div className="bg-white p-8 rounded-[40px] border-2 border-[#1F2937] shadow-2xl w-full max-w-sm mb-10 relative overflow-hidden text-left">
                   <div className="absolute top-0 right-0 p-4"><Sparkles className="h-5 w-5 text-[#84A59D]" /></div>
                   <h3 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-6">Contrato de Hoje</h3>
                   <div className="space-y-4">
                      {getTasksByPriority('essencial').map(t => (
                        <div key={t.id} className="flex items-center gap-3"><div className="h-2 w-2 rounded-full bg-red-400" /><span className="font-bold text-sm text-[#1F2937]">{t.title}</span></div>
                      ))}
                      {getTasksByPriority('importante').slice(0, 2).map(t => (
                        <div key={t.id} className="flex items-center gap-3 opacity-60"><div className="h-2 w-2 rounded-full bg-blue-400" /><span className="font-bold text-xs text-[#1F2937]">{t.title}</span></div>
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
                  className="bg-[#1F2937] hover:bg-black text-white px-16 py-7 rounded-[32px] font-black text-lg uppercase tracking-widest shadow-2xl transition-all transform hover:scale-105 active:scale-95"
                >Ativar Meu Dia</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
    </div>
  );
}

function KanbanColumn({ id, title, color, tasks, editingId, editValue, setEditingId, setEditValue, saveEdit }: any) {
  const { setNodeRef } = useSortable({ id });

  return (
    <div ref={setNodeRef} className={`flex flex-col min-h-[400px] rounded-[32px] border p-5 transition-colors ${color.split(' ')[0]} ${color.split(' ')[1]}`}>
       <div className={`px-4 py-2 rounded-xl mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-center bg-white shadow-sm border ${color.split(' ')[2]}`}>
          {title}
       </div>
       
       <SortableContext items={tasks.map((t: any) => t.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-3 flex-1">
             {tasks.map((t: any) => (
               <KanbanCard 
                 key={t.id} 
                 task={t} 
                 isEditing={editingId === t.id}
                 editValue={editValue}
                 onEdit={() => { setEditingId(t.id); setEditValue(t.title); }}
                 onEditChange={setEditValue}
                 onSave={saveEdit}
                 onCancel={() => setEditingId(null)}
               />
             ))}
             {tasks.length === 0 && <p className="text-[10px] text-[#9CA3AF] text-center font-bold mt-10 italic">Arraste aqui...</p>}
          </div>
       </SortableContext>
    </div>
  );
}

function KanbanCard({ task, isDragging, isEditing, editValue, onEdit, onEditChange, onSave, onCancel }: any) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  if (isEditing) {
    return (
      <div className="bg-white p-3 rounded-2xl border-2 border-[#1F2937] shadow-lg">
        <input 
          autoFocus
          className="w-full bg-transparent text-sm font-bold text-[#1F2937] focus:outline-none mb-2"
          value={editValue}
          onChange={(e) => onEditChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') onSave(); if (e.key === 'Escape') onCancel(); }}
        />
        <div className="flex justify-end gap-2">
           <button onClick={onCancel} className="text-[8px] font-black uppercase text-[#9CA3AF]">Cancelar</button>
           <button onClick={onSave} className="text-[8px] font-black uppercase text-[#1F2937]">Salvar</button>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`bg-white p-4 rounded-2xl border border-[#E5E7EB] text-sm font-bold text-[#1F2937] shadow-sm cursor-grab active:cursor-grabbing group relative ${isDragging ? 'z-50 shadow-2xl' : ''}`}
      {...attributes} 
      {...listeners}
      onDoubleClick={onEdit}
    >
       {task.title}
       <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Sparkles className="h-3 w-3 text-[#84A59D]" />
       </div>
    </div>
  );
}
