"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Send, Trash2, Clock, Zap, ArrowRight, Home, CheckSquare, Target, BarChart2, BookOpen, Brain, Check } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";

export default function BrainDumpPage() {
  const [note, setNote] = useState("");
  const [items, setItems] = useState<{ id: number; text: string; category?: string }[]>([]);

  const addItem = () => {
    if (note.trim()) {
      setItems([{ id: Date.now(), text: note }, ...items]);
      setNote("");
    }
  };

  const setCategory = (id: number, cat: string) => {
    setItems(items.map(item => item.id === id ? { ...item, category: cat } : item));
  };

  const removeItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans">
      <Sidebar />

      <main className="flex-1 px-8 py-10 md:px-14 lg:max-w-4xl mx-auto overflow-y-auto">
        <header className="mb-12 text-center">
          <h1 className="text-3xl font-extrabold text-[#1F2937] uppercase tracking-tight">Descarrego Mental</h1>
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

        {/* List of Items */}
        <div className="space-y-6">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[#E5E7EB] flex flex-col gap-4"
              >
                <p className="text-lg font-bold text-[#333333]">{item.text}</p>
                
                <div className="flex flex-wrap gap-3">
                  {!item.category ? (
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
                        {item.category.replace('_', ' ')}
                      </span>
                      <button onClick={() => removeItem(item.id)} className="text-[#9CA3AF] hover:text-red-400">
                        <Check className="h-5 w-5" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {items.length === 0 && (
            <div className="text-center py-20 opacity-30">
              <Brain className="h-16 w-16 mx-auto mb-4 text-[#9CA3AF]" />
              <p className="font-bold text-[#9CA3AF]">Sua cabeça está leve. Nada por aqui.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
