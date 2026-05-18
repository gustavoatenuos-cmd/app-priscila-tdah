"use client";

import { TherapeuticShell } from "@/components/therapeutic/therapeutic-shell";
import { motion } from "framer-motion";
import { 
  Wind, Heart, Target, 
  Sparkles, Eye, Sun,
  CheckCircle2, Plus
} from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

const EXERCISES = [
  {
    id: "breathing",
    category: "Presença",
    title: "Respiração Consciente",
    description: "Sinta o ar entrar e sair. Apenas isso, por 1 minuto.",
    instructions: "Sente-se confortavelmente. Feche os olhos. Inspire por 4 segundos, segure por 4, e solte por 4. Repita 3 vezes.",
    icon: Wind,
    color: "bg-[#FFF9F5] border-[#F8E9E2] text-[#A78B95]"
  },
  {
    id: "gratitude",
    category: "Autocuidado",
    title: "Momento de Gratidão",
    description: "Anote uma coisa pequena que deu certo hoje.",
    instructions: "Pode ser o gosto do café, uma mensagem recebida ou simplesmente o fato de você ter começado o dia.",
    icon: Sun,
    color: "bg-[#FFEBEE] border-red-100 text-red-400"
  },
  {
    id: "body-scan",
    category: "Presença",
    title: "Scan Corporal",
    description: "Perceba onde você está guardando tensão agora.",
    instructions: "Dos pés à cabeça, relaxe cada músculo conscientemente. Solte os ombros, relaxe a mandíbula.",
    icon: Eye,
    color: "bg-[#F3E5F5]/30 border-[#F3E5F5] text-[#9C27B0]"
  },
  {
    id: "one-thing",
    category: "Foco",
    title: "Uma Coisa de Cada Vez",
    description: "Escolha uma tarefa e desligue todas as notificações.",
    instructions: "Não tente multitarefar. Seu cérebro ADHD funciona melhor quando você dá permissão para focar em uma única coisa.",
    icon: Target,
    color: "bg-[#E3F2FD]/30 border-[#E3F2FD] text-[#2196F3]"
  },
  {
    id: "sensory-pause",
    category: "Autocuidado",
    title: "Pausa Sensorial",
    description: "Afaste-se das telas por 5 minutos.",
    instructions: "Olhe pela janela, ouça os sons ao redor, sinta a textura de algo próximo a você.",
    icon: Sparkles,
    color: "bg-[#D4E2D4]/30 border-[#D4E2D4] text-[#5C7A5C]"
  },
  {
    id: "intentional-rest",
    category: "Evolução",
    title: "Descanso Intencional",
    description: "O descanso não é um prêmio, é uma necessidade.",
    instructions: "Planeje uma pausa antes de chegar à exaustão. 15 minutos de nada absoluto.",
    icon: Heart,
    color: "bg-orange-50/30 border-orange-100 text-orange-500"
  }
];

export default function DailyExercisesPage() {
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('exercise_logs')
      .select('exercise_id')
      .eq('user_id', user.id)
      .gte('completed_at', today);

    if (data) {
      setCompletedIds(data.map(d => d.exercise_id));
    }
    setLoading(false);
  };

  const toggleComplete = async (exercise: typeof EXERCISES[0]) => {
    const isCompleted = completedIds.includes(exercise.id);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isCompleted) {
      await supabase.from('exercise_logs').delete().eq('user_id', user.id).eq('exercise_id', exercise.id);
      setCompletedIds(prev => prev.filter(id => id !== exercise.id));
    } else {
      await supabase.from('exercise_logs').insert({
        user_id: user.id,
        exercise_id: exercise.id,
        category: exercise.category
      });
      setCompletedIds(prev => [...prev, exercise.id]);
      toast.success(`Parabéns! Você completou: ${exercise.title} ✨`);
      
      // Award points
      const { data: profile } = await supabase.from('profiles').select('total_points').eq('id', user.id).single();
      await supabase.from('profiles').update({ total_points: (profile?.total_points || 0) + 15 }).eq('id', user.id);
    }
  };

  return (
    <TherapeuticShell 
      title="Pílulas de Presença" 
      subtitle="Pequenos exercícios diários para nutrir sua mente."
      activeTab="exercises"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {EXERCISES.map((ex, idx) => (
          <motion.div
            key={ex.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            className="flex"
          >
            <div className={`flex flex-col w-full bg-white rounded-[32px] border transition-all duration-500 overflow-hidden group ${
              completedIds.includes(ex.id) 
                ? "border-gray-100 opacity-60 scale-95" 
                : `${ex.color.split(' ')[1]} shadow-sm hover:shadow-xl`
            }`}>
              <div className={`p-8 flex-1 space-y-4`}>
                <div className="flex items-center justify-between">
                   <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all ${
                     completedIds.includes(ex.id) ? "bg-gray-100 text-gray-400" : "bg-white shadow-sm " + ex.color.split(' ')[2]
                   }`}>
                     {completedIds.includes(ex.id) ? <CheckCircle2 className="h-6 w-6" /> : <ex.icon className="h-6 w-6" />}
                   </div>
                   <span className={`text-[10px] font-black uppercase tracking-widest ${ex.color.split(' ')[2]}`}>{ex.category}</span>
                </div>

                <div className="space-y-2">
                   <h3 className="text-xl font-display font-bold text-[#1F2937]">{ex.title}</h3>
                   <p className="text-sm font-medium text-[#4A4A4A] leading-relaxed">{ex.description}</p>
                </div>

                <div className="pt-4 border-t border-dashed border-gray-100">
                   <p className="text-xs text-[#7A7A7A] leading-relaxed italic">
                     {ex.instructions}
                   </p>
                </div>
              </div>

              <button 
                onClick={() => toggleComplete(ex)}
                className={`w-full py-5 font-bold text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                  completedIds.includes(ex.id) 
                    ? "bg-gray-50 text-gray-300" 
                    : "bg-[#1F2937] text-white hover:bg-black"
                }`}
              >
                {completedIds.includes(ex.id) ? "Concluído" : "Fiz o Exercício"}
              </button>
            </div>
          </motion.div>
        ))}

        {/* Custom Exercise Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6 }}
          className="flex"
        >
          <div className="flex flex-col items-center justify-center w-full bg-white/40 backdrop-blur-sm rounded-[32px] border-2 border-dashed border-[#F8E9E2] p-8 text-center space-y-4 group hover:border-[#A78B95] transition-all cursor-pointer">
             <div className="h-14 w-14 bg-white rounded-full flex items-center justify-center text-[#A78B95] shadow-sm group-hover:scale-110 transition-transform">
                <Plus className="h-6 w-6" />
             </div>
             <h3 className="text-lg font-display font-bold text-[#1F2937]">Algo seu?</h3>
             <p className="text-xs text-[#7A7A7A] font-medium">Crie seu próprio exercício de presença.</p>
          </div>
        </motion.div>
      </div>
    </TherapeuticShell>
  );
}
