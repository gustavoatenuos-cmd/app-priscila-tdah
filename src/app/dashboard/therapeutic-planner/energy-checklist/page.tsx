"use client";

import { TherapeuticShell } from "@/components/therapeutic/therapeutic-shell";
import { motion } from "framer-motion";
import { 
  Heart, ShieldCheck, Zap, 
  Wind, Brain, CheckCircle2,
  Sparkles, Coffee, Moon,
  Smile, UserCheck
} from "lucide-react";
import { useState } from "react";

export default function EnergyChecklistPage() {
  const [completed, setCompleted] = useState<string[]>([]);

  const items = [
    {
      id: "small",
      title: "Começar Pequeno",
      description: "Qual é o menor passo possível agora? Faça apenas ele.",
      icon: Wind,
      color: "bg-[#FFF9F5] border-[#F8E9E2] text-[#A78B95]",
      message: "Respeite seu ritmo hoje."
    },
    {
      id: "failure",
      title: "Constância não é Perfeição",
      description: "Falhou? Recomece agora. O recomeço é a alma da constância.",
      icon: ShieldCheck,
      color: "bg-[#F3E5F5]/30 border-[#F3E5F5] text-[#9C27B0]",
      message: "Você é maior que suas falhas."
    },
    {
      id: "distractions",
      title: "Anotar Distrações",
      description: "Se algo vier à mente, anote no Descarrego e volte ao que estava fazendo.",
      icon: Brain,
      color: "bg-[#E3F2FD]/30 border-[#E3F2FD] text-[#2196F3]",
      message: "Proteja sua energia."
    },
    {
      id: "breathe",
      title: "Pausa para Respirar",
      description: "Pare por 30 segundos. Sinta o ar entrando e saindo.",
      icon: Zap,
      color: "bg-orange-50/30 border-orange-100 text-orange-500",
      message: "Oxigene seu cérebro."
    },
    {
      id: "donotabandon",
      title: "Não se Abandonar",
      description: "Se estiver difícil, peça ajuda ou mude de ambiente. Não se force além do limite.",
      icon: Heart,
      color: "bg-red-50/30 border-red-100 text-red-400",
      message: "Seu bem-estar vem primeiro."
    },
    {
      id: "sensory",
      title: "Check-in Sensorial",
      description: "Bebeu água? Está com fome? Como está a luz e o som ao seu redor?",
      icon: Coffee,
      color: "bg-[#D4E2D4]/30 border-[#D4E2D4] text-[#5C7A5C]",
      message: "Cuide do seu corpo."
    },
    {
      id: "silence",
      title: "Momento de Silêncio",
      description: "Tente ficar 2 minutos sem nenhum estímulo sonoro ou visual.",
      icon: Moon,
      color: "bg-indigo-50/30 border-indigo-100 text-indigo-400",
      message: "Acalme o sistema nervoso."
    },
    {
      id: "kindness",
      title: "Autocompaixão",
      description: "Fale com você mesma como falaria com uma melhor amiga agora.",
      icon: Smile,
      color: "bg-yellow-50/30 border-yellow-100 text-yellow-600",
      message: "Seja gentil internamente."
    }
  ];

  const toggleItem = (id: string) => {
    setCompleted(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <TherapeuticShell 
      title="Checklist de Energia" 
      subtitle="Um suporte emocional e funcional para os momentos de sobrecarga."
      activeTab="overview"
    >
      <div className="max-w-3xl mx-auto space-y-8 pb-24">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <button 
                onClick={() => toggleItem(item.id)}
                className={`w-full text-left p-6 rounded-[32px] border-2 transition-all duration-500 flex flex-col gap-4 relative overflow-hidden group h-full ${
                  completed.includes(item.id) 
                    ? "bg-white border-gray-100 opacity-60 scale-95" 
                    : `${item.color} shadow-sm hover:shadow-xl hover:-translate-y-1`
                }`}
              >
                <div className="flex items-center justify-between w-full">
                   <div className={`shrink-0 h-10 w-10 rounded-2xl flex items-center justify-center transition-all ${
                     completed.includes(item.id) ? "bg-gray-100 text-gray-400" : "bg-white shadow-sm"
                   }`}>
                     {completed.includes(item.id) ? <CheckCircle2 className="h-5 w-5" /> : <item.icon className="h-5 w-5" />}
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest opacity-40">{item.message}</span>
                </div>

                <div className="space-y-1">
                   <h3 className={`text-lg font-display font-bold ${completed.includes(item.id) ? "text-gray-400 line-through" : "text-[#1F2937]"}`}>
                     {item.title}
                   </h3>
                   <p className={`text-xs leading-relaxed ${completed.includes(item.id) ? "text-gray-300" : "text-[#4A4A4A] font-medium"}`}>
                     {item.description}
                   </p>
                </div>

                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-opacity">
                   <Sparkles className="h-8 w-8" />
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {completed.length > 0 && (
          <div className="text-center pt-8">
             <p className="text-xs font-bold text-[#A78B95] uppercase tracking-widest">
               {completed.length} de {items.length} verificações concluídas
             </p>
          </div>
        )}

        {completed.length === items.length && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#D4E2D4] p-10 rounded-[40px] text-center text-white shadow-xl space-y-4"
          >
             <Heart className="h-12 w-12 mx-auto" />
             <h3 className="text-2xl font-display font-bold">Você se cuidou hoje.</h3>
             <p className="font-medium">
               Isso é o que realmente importa. Agora, com a bateria recarregada, <br />
               você pode dar o próximo pequeno passo com clareza.
             </p>
          </motion.div>
        )}

      </div>
    </TherapeuticShell>
  );
}
