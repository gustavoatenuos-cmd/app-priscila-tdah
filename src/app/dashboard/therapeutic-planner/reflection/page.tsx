"use client";

import { TherapeuticShell } from "@/components/therapeutic/therapeutic-shell";
import { motion } from "framer-motion";
import { 
  Sparkles, Save, ArrowRight,
  RefreshCw, Star, Trash2, Heart
} from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function ReflectionPage() {
  const [saving, setSaving] = useState(false);
  const [responses, setResponses] = useState({
    constant: "",
    new: "",
    forward: "",
    leave_behind: ""
  });

  const handleSave = async () => {
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('reflections')
      .insert({
        user_id: user.id,
        period_type: 'weekly',
        responses: responses
      });

    if (error) {
      toast.error("Erro ao guardar sua reflexão.");
    } else {
      toast.success("Sua reflexão foi guardada com carinho. 🌿");
      setTimeout(() => window.location.href = "/dashboard/therapeutic-planner", 2000);
    }
    setSaving(false);
  };

  const questions = [
    {
      id: "constant",
      label: "O que mantive constante?",
      placeholder: "Mesmo que tenha sido apenas um pequeno hábito...",
      icon: RefreshCw,
      color: "bg-[#D4E2D4] text-[#5C7A5C]"
    },
    {
      id: "new",
      label: "O que iniciei de novo?",
      placeholder: "Um novo pensamento, um novo jeito de agir...",
      icon: Star,
      color: "bg-[#F8E9E2] text-[#A78B95]"
    },
    {
      id: "forward",
      label: "O que quero levar adiante?",
      placeholder: "O que fez bem e merece continuar...",
      icon: Heart,
      color: "bg-[#FFEBEE] text-red-400"
    },
    {
      id: "leave_behind",
      label: "O que preciso deixar para trás?",
      placeholder: "Culpas, pesos desnecessários, autocrítica...",
      icon: Trash2,
      color: "bg-gray-100 text-gray-400"
    }
  ];

  return (
    <TherapeuticShell 
      title="Reflexão e Continuidade" 
      subtitle="Olhar para trás com carinho é o segredo para seguir com leveza."
      activeTab="overview"
    >
      <div className="max-w-3xl mx-auto space-y-12 pb-24">
        
        <div className="space-y-8">
           {questions.map((q, idx) => (
             <motion.div 
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-4"
             >
                <div className="flex items-center gap-3 px-2">
                   <div className={`h-10 w-10 ${q.color} rounded-xl flex items-center justify-center shadow-sm`}>
                      <q.icon className="h-5 w-5" />
                   </div>
                   <h3 className="text-xl font-display font-bold text-[#1F2937]">{q.label}</h3>
                </div>

                <textarea 
                  value={(responses as any)[q.id]}
                  onChange={(e) => setResponses({ ...responses, [q.id]: e.target.value })}
                  placeholder={q.placeholder}
                  className="w-full min-h-[120px] bg-white border border-gray-100 p-6 rounded-[2rem] text-[#4A4A4A] font-medium shadow-sm focus:ring-2 focus:ring-[#A78B95]/10 focus:border-[#A78B95] outline-none transition-all resize-none"
                />
             </motion.div>
           ))}
        </div>

        {/* Final Message & Save */}
        <div className="text-center space-y-8">
           <div className="flex items-center justify-center gap-2 text-[#A78B95]">
              <Sparkles className="h-5 w-5" />
              <p className="text-sm font-medium italic">"Honre seu processo, ele é único."</p>
           </div>

           <button 
            onClick={handleSave}
            disabled={saving || !responses.constant}
            className="bg-[#1F2937] hover:bg-black text-white px-16 py-6 rounded-[2.5rem] font-bold shadow-2xl transition-all transform hover:scale-105 active:scale-95 disabled:opacity-30 flex items-center gap-3 mx-auto"
           >
             {saving ? "Guardando..." : "Concluir Reflexão"}
             <ArrowRight className="h-5 w-5" />
           </button>
        </div>

      </div>
    </TherapeuticShell>
  );
}
