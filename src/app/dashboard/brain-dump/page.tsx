"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { Send, Trash2, Clock, Zap, ArrowRight, Home, CheckSquare, Target, BarChart2, BookOpen, Brain, Check } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function BrainDumpPage() {
  const [note, setNote] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [processedItems, setProcessedItems] = useState<any[]>([]);
  const [view, setView] = useState<"pendentes" | "processadas">("pendentes");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('brain_dump')
      .select('id, content, category, processed, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setItems(data.filter(i => !i.processed));
      setProcessedItems(data.filter(i => i.processed));
    }
    setLoading(false);
  };

  const addItem = async () => {
    if (note.trim()) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('brain_dump')
        .insert({ user_id: user.id, content: note });

      if (error) toast.error("Erro ao descarregar");
      else {
        setNote("");
        loadItems();
      }
    }
  };

  const setCategory = async (id: string, cat: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (cat === 'agora') {
       // Mover para tarefas essenciais
       const item = items.find(i => i.id === id);
       await supabase.from('tasks').insert({
         user_id: user.id,
         title: item.content,
         priority_level: 'essencial'
       });
    }

    // Marcar como processado
    await supabase
      .from('brain_dump')
      .update({ processed: true })
      .eq('id', id);
    
    loadItems();
    toast.success("Item processado!");
  };

  const removeItem = async (id: string) => {
    await supabase
      .from('brain_dump')
      .update({ processed: true })
      .eq('id', id);
    loadItems();
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">Libertando sua mente...</div>;

  return (
    <div className="px-8 py-10 md:px-14 lg:max-w-4xl mx-auto">

        <header className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold text-[#1F2937] uppercase tracking-tight">Esvaziar a Mente</h1>
          <p className="text-[#64748B] font-medium text-lg mt-2">Tire da cabeça, coloque no papel. Sem ordem, sem pressão.</p>
        </header>


        {/* Input Area */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-[#E5E7EB] mb-12">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), addItem())}
            placeholder="O que está na sua mente agora?"
            className="w-full h-32 text-xl font-medium text-[#1F2937] placeholder:text-[#9CA3AF] resize-none focus:outline-none"
          />
          <div className="flex justify-end mt-4">
            <button
              onClick={addItem}
              className="bg-[#64748B] text-white p-3 rounded-2xl hover:bg-[#475569] transition-all"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-4 mb-8 border-b border-[#E5E7EB] pb-4">
          <button 
            onClick={() => setView("pendentes")}
            className={`font-black text-sm uppercase tracking-widest transition-colors ${view === "pendentes" ? "text-[#1F2937]" : "text-[#9CA3AF] hover:text-[#64748B]"}`}
          >
            Pendentes ({items.length})
          </button>
          <button 
            onClick={() => setView("processadas")}
            className={`font-black text-sm uppercase tracking-widest transition-colors ${view === "processadas" ? "text-[#1F2937]" : "text-[#9CA3AF] hover:text-[#64748B]"}`}
          >
            Processadas ({processedItems.length})
          </button>
        </div>

        {/* List of Items */}
        <div className="space-y-6">
          <AnimatePresence>
            {(view === "pendentes" ? items : processedItems).map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className={`rounded-2xl p-6 shadow-sm border flex flex-col gap-4 ${view === "processadas" ? "bg-[#F9FAFB] border-[#F1F5F9] opacity-70" : "bg-white border-[#E5E7EB]"}`}
              >
                <p className={`text-lg font-bold ${view === "processadas" ? "text-[#9CA3AF] line-through" : "text-[#333333]"}`}>{item.content}</p>
                
                <div className="flex flex-wrap gap-3">
                  {!item.processed ? (
                    <>
                      <button onClick={() => setCategory(item.id, "agora")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#84A59D]/10 text-[#84A59D] text-xs font-bold uppercase transition-all hover:bg-[#84A59D]/20">
                        <Zap className="h-3 w-3" /> Fazer Agora
                      </button>
                      <button onClick={() => setCategory(item.id, "depois")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#64748B]/10 text-[#64748B] text-xs font-bold uppercase transition-all hover:bg-[#64748B]/20">
                        <Clock className="h-3 w-3" /> Guardar para Depois
                      </button>
                      <button onClick={() => setCategory(item.id, "deixar_ir")} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-400 text-xs font-bold uppercase transition-all hover:bg-red-100">
                        <Trash2 className="h-3 w-3" /> Deixar Ir
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${
                        item.category === 'agora' ? 'bg-[#84A59D] text-white' : 
                        item.category === 'depois' ? 'bg-[#64748B] text-white' : 
                        'bg-red-400 text-white'
                      }`}>
                        {item.category?.replace('_', ' ') || 'PROCESSADO'}
                      </span>
                      <Check className="h-5 w-5 text-[#9CA3AF]" />
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {view === "pendentes" && items.length === 0 && (
            <div className="text-center py-20 opacity-30">
              <Brain className="h-16 w-16 mx-auto mb-4 text-[#9CA3AF]" />
              <p className="font-bold text-[#9CA3AF]">Sua cabeça está leve. Nada pendente por aqui.</p>
            </div>
          )}

          {view === "processadas" && processedItems.length === 0 && (
            <div className="text-center py-20 opacity-30">
              <Brain className="h-16 w-16 mx-auto mb-4 text-[#9CA3AF]" />
              <p className="font-bold text-[#9CA3AF]">Você ainda não processou nenhuma distração.</p>
            </div>
          )}
        </div>
    </div>
  );
}
