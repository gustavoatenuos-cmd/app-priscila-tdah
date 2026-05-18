"use client";

import { TherapeuticShell } from "@/components/therapeutic/therapeutic-shell";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Send, Sparkles, 
  Trash2, Archive, Zap, 
  ArrowRight, ChevronLeft
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Item = {
  id: string;
  content: string;
  category: 'agora' | 'depois' | 'deixar_ir' | null;
};

export default function MindDumpPage() {
  const [step, setStep] = useState<'dump' | 'classify'>('dump');
  const [text, setText] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('brain_dump')
      .select('*')
      .eq('user_id', user.id)
      .eq('processed', false)
      .order('created_at', { ascending: false });

    if (data) {
      setItems(data.map(d => ({
        id: d.id,
        content: d.content,
        category: (d.category as any) || null
      })));
    }
    setLoading(false);
  };

  const handleDump = async () => {
    if (!text.trim()) return;

    const lines = text.split('\n').filter(l => l.trim());
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newItems = lines.map(line => ({
      user_id: user.id,
      content: line.trim(),
      category: null,
      processed: false
    }));

    const { data, error } = await supabase.from('brain_dump').insert(newItems).select();

    if (error) {
      toast.error("Erro ao descarregar.");
    } else {
      setItems([...(data.map(d => ({ id: d.id, content: d.content, category: null }))), ...items]);
      setText("");
      setStep('classify');
      toast.success("Mente descarregada. Vamos organizar?");
    }
  };

  const updateCategory = async (id: string, category: 'agora' | 'depois' | 'deixar_ir') => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, category } : item));

    const { error } = await supabase
      .from('brain_dump')
      .update({ category, processed: category === 'deixar_ir' })
      .eq('id', id);

    if (error) toast.error("Erro ao atualizar.");
    if (category === 'deixar_ir') {
      setTimeout(() => {
        setItems(prev => prev.filter(item => item.id !== id));
        toast.info("Deixado para trás com sucesso. 🍃");
      }, 500);
    }
  };

  const finalize = async () => {
    const nowItems = items.filter(i => i.category === 'agora');
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Convert 'Agora' items to tasks
    if (nowItems.length > 0) {
      await supabase.from('tasks').insert(nowItems.map(i => ({
        user_id: user.id,
        title: i.content,
        priority_level: 'essencial'
      })));
      
      await supabase.from('brain_dump').update({ processed: true }).in('id', nowItems.map(i => i.id));
    }

    toast.success("Organização concluída! Itens urgentes foram para seu Planner.");
    window.location.href = "/dashboard/therapeutic-planner";
  };

  return (
    <TherapeuticShell 
      title="Descarregar a Mente" 
      subtitle="Silencie o ruído e recupere seu espaço mental."
      activeTab="dump"
    >
      <div className="max-w-3xl mx-auto space-y-8 pb-24">
        
        <AnimatePresence mode="wait">
          {step === 'dump' ? (
            <motion.div 
              key="dump-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="space-y-6"
            >
              <div className="bg-white/60 backdrop-blur-md rounded-[40px] p-8 border border-white shadow-xl">
                 <div className="flex items-center gap-3 mb-6">
                    <div className="h-10 w-10 bg-[#F3E5F5] rounded-xl flex items-center justify-center text-[#9C27B0]">
                       <Brain className="h-6 w-6" />
                    </div>
                    <div>
                       <h2 className="text-xl font-display font-bold text-[#1F2937]">O que está na sua cabeça agora?</h2>
                       <p className="text-xs text-[#7A7A7A]">Não julgue, apenas escreva tudo. Use uma linha por ideia.</p>
                    </div>
                 </div>

                 <textarea 
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Preocupações, tarefas, ideias soltas, sentimentos..."
                  className="w-full min-h-[300px] bg-transparent text-lg font-medium text-[#4A4A4A] placeholder-[#D1D1D1] resize-none focus:outline-none leading-relaxed"
                 />

                 <div className="flex justify-end mt-6">
                    <button 
                      onClick={handleDump}
                      disabled={!text.trim()}
                      className="bg-[#9C27B0] hover:bg-[#7B1FA2] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all disabled:opacity-30 shadow-lg shadow-[#9C27B0]/20"
                    >
                      Descarregar <Send className="h-5 w-5" />
                    </button>
                 </div>
              </div>

              {items.length > 0 && (
                <button 
                  onClick={() => setStep('classify')}
                  className="w-full py-4 text-[#9C27B0] font-bold text-sm uppercase tracking-widest hover:underline"
                >
                  Continuar organizando {items.length} itens pendentes
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="classify-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button onClick={() => setStep('dump')} className="flex items-center gap-2 text-sm font-bold text-[#A78B95] hover:underline">
                  <ChevronLeft className="h-4 w-4" /> Voltar ao descarrego
                </button>
                <div className="h-2 w-32 bg-gray-100 rounded-full overflow-hidden">
                   <div className="h-full bg-[#9C27B0]" style={{ width: `${(items.filter(i => i.category).length / items.length) * 100}%` }} />
                </div>
              </div>

              <div className="space-y-4">
                {items.filter(i => !i.category || i.category !== 'deixar_ir').map((item, idx) => (
                  <motion.div 
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-[2rem] border border-[#F8E9E2] shadow-sm space-y-4 group"
                  >
                    <p className="text-lg font-display font-bold text-[#1F2937] leading-tight">{item.content}</p>
                    
                    <div className="flex flex-wrap gap-2">
                       <button 
                        onClick={() => updateCategory(item.id, 'agora')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                          item.category === 'agora' ? 'bg-[#9C27B0] text-white' : 'bg-[#F3E5F5] text-[#9C27B0] hover:bg-[#9C27B0] hover:text-white'
                        }`}
                       >
                         <Zap className="h-3 w-3" /> Fazer Agora
                       </button>
                       <button 
                        onClick={() => updateCategory(item.id, 'depois')}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                          item.category === 'depois' ? 'bg-[#A78B95] text-white' : 'bg-gray-100 text-[#7A7A7A] hover:bg-[#A78B95] hover:text-white'
                        }`}
                       >
                         <Archive className="h-3 w-3" /> Guardar para depois
                       </button>
                       <button 
                        onClick={() => updateCategory(item.id, 'deixar_ir')}
                        className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-white border border-red-100 text-red-300 hover:bg-red-50 hover:text-red-500 transition-all flex items-center gap-2"
                       >
                         <Trash2 className="h-3 w-3" /> Deixar Ir
                       </button>
                    </div>
                  </motion.div>
                ))}

                {items.length === 0 && (
                  <div className="text-center py-20 space-y-4">
                     <div className="h-20 w-20 bg-[#F3E5F5] rounded-full flex items-center justify-center text-[#9C27B0] mx-auto shadow-inner">
                        <Sparkles className="h-10 w-10" />
                     </div>
                     <h3 className="text-xl font-display font-bold text-[#1F2937]">Mente Limpa!</h3>
                     <p className="text-[#7A7A7A]">Você organizou tudo o que estava pesando hoje.</p>
                     <button onClick={() => setStep('dump')} className="text-[#9C27B0] font-bold underline">Descarregar mais?</button>
                  </div>
                )}
              </div>

              <div className="flex justify-center pt-8">
                 <button 
                  onClick={finalize}
                  className="bg-[#1F2937] text-white px-12 py-5 rounded-[2rem] font-bold shadow-xl flex items-center gap-3 hover:bg-black transition-all"
                 >
                   Finalizar Organização <ArrowRight className="h-5 w-5" />
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </TherapeuticShell>
  );
}
