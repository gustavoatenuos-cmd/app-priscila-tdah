"use client";

import { Sidebar } from "@/components/sidebar";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Heart, Save, BookMarked } from "lucide-react";

export default function JournalPage() {
  const [gratitude, setGratitude] = useState(["", "", ""]);
  const [learning, setLearning] = useState("");
  const [book, setBook] = useState("");
  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadJournal() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setGratitude(data.gratitude_items || ["", "", ""]);
        setLearning(data.learning || "");
        setBook(data.reading_book || "");
        setProgress(data.reading_progress || "");
      }
      setLoading(false);
    }
    loadJournal();
  }, []);

  const handleSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Você precisa estar logada.");
      return;
    }

    const { error } = await supabase
      .from('journal_entries')
      .insert({
        user_id: user.id,
        gratitude_items: gratitude,
        learning: learning,
        reading_book: book,
        reading_progress: progress
      });

    if (error) toast.error("Erro ao salvar: " + error.message);
    else toast.success("Sua reflexão foi guardada. ✨");
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">Abrindo seu diário...</div>;

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col min-h-screen overflow-y-auto">
        <header className="h-20 border-b border-[#E5E7EB] flex items-center justify-between px-8 md:px-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
          <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Journal & Gratidão</h1>
          <button 
            onClick={handleSave}
            className="bg-[#1F2937] text-white px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg shadow-black/10 flex items-center gap-2"
          >
             <Save className="h-4 w-4" /> Salvar Reflexão
          </button>
        </header>

        <div className="p-8 md:p-12 max-w-5xl mx-auto w-full space-y-12 pb-24">
           
           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[40px] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50 relative overflow-hidden">
             <div className="flex items-center gap-4 mb-10">
               <div className="h-12 w-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-300">
                 <Heart className="h-6 w-6" />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-[#1F2937] tracking-tight">Descarrego Positivo</h2>
                 <p className="text-[#9CA3AF] font-bold text-[10px] uppercase tracking-widest mt-1">O que fluiu bem hoje?</p>
               </div>
             </div>

             <div className="space-y-6">
                {gratitude.map((item, idx) => (
                  <div key={idx} className="flex gap-6 items-center group">
                    <span className="text-[#E5E7EB] font-black text-2xl group-hover:text-[#84A59D] transition-colors">{idx + 1}</span>
                    <input 
                      type="text" 
                      value={item}
                      onChange={(e) => {
                        const newG = [...gratitude];
                        newG[idx] = e.target.value;
                        setGratitude(newG);
                      }}
                      placeholder="Um momento, uma pessoa, um detalhe..." 
                      className="w-full bg-[#F9FAFB] border border-transparent focus:border-[#84A59D]/30 h-16 rounded-[20px] px-6 text-[#333333] font-bold text-lg focus:outline-none transition-all" 
                    />
                  </div>
                ))}
             </div>
             
             <div className="mt-12 pt-12 border-t border-[#F1F5F9]">
                <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-4 block">Filtro de Aprendizagem</label>
                <textarea 
                  rows={4} 
                  value={learning}
                  onChange={(e) => setLearning(e.target.value)}
                  className="w-full bg-[#F9FAFB] border border-transparent focus:border-[#84A59D]/30 rounded-[24px] p-6 text-[#333333] font-medium text-lg leading-relaxed focus:outline-none transition-all resize-none" 
                  placeholder="Se você pudesse dar um único conselho para si mesma hoje de manhã, qual seria?" 
                />
             </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[40px] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-[#E5E7EB]/50">
              <div className="flex items-center gap-4 mb-10">
               <div className="h-12 w-12 rounded-2xl bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
                 <BookMarked className="h-6 w-6" />
               </div>
               <div>
                 <h2 className="text-2xl font-black text-[#1F2937] tracking-tight">Registro de Sabedoria</h2>
                 <p className="text-[#9CA3AF] font-bold text-[10px] uppercase tracking-widest mt-1">O que você está lendo ou absorvendo?</p>
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div>
                 <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">Título do Estudo/Livro</label>
                 <input 
                    type="text" 
                    value={book}
                    onChange={(e) => setBook(e.target.value)}
                    placeholder="Ex: Minimalismo Digital" 
                    className="w-full bg-[#F9FAFB] border border-transparent focus:border-[#84A59D]/30 h-14 rounded-xl px-6 text-[#333333] font-bold focus:outline-none transition-all" 
                 />
               </div>
               <div>
                 <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest mb-3 block">Onde você parou?</label>
                 <input 
                    type="text" 
                    value={progress}
                    onChange={(e) => setProgress(e.target.value)}
                    placeholder="Página 42 ou Cap 3" 
                    className="w-full bg-[#F9FAFB] border border-transparent focus:border-[#84A59D]/30 h-14 rounded-xl px-6 text-[#333333] font-bold focus:outline-none transition-all" 
                  />
               </div>
             </div>
           </motion.div>

        </div>
      </main>
    </div>
  );
}
