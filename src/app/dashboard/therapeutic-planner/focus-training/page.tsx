"use client";

import { TherapeuticShell } from "@/components/therapeutic/therapeutic-shell";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Timer as TimerIcon, Play, Pause, 
  RotateCcw, Sparkles, Heart,
  Minus, Plus, CheckCircle2,
  Wind
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function FocusTrainingPage() {
  const [minutes, setMinutes] = useState(5);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"); // Soft chime sound
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isActive, timeLeft]);

  const handleStart = () => setIsActive(true);
  const handlePause = () => setIsActive(false);
  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(minutes * 60);
    setIsCompleted(false);
  };

  const handleComplete = async () => {
    setIsActive(false);
    setIsCompleted(true);
    
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked"));
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('focus_sessions').insert({
        user_id: user.id,
        duration_minutes: minutes,
        emotion_post_focus: 'focada'
      });
      
      const { data: profile } = await supabase.from('profiles').select('total_points').eq('id', user.id).single();
      await supabase.from('profiles').update({ total_points: (profile?.total_points || 0) + (minutes * 2) }).eq('id', user.id);
      
      toast.success(`Foco concluído! +${minutes * 2} pontos de clareza. 🌿`);
    }
  };

  const adjustMinutes = (amount: number) => {
    if (isActive) return;
    const newMins = Math.max(1, Math.min(60, minutes + amount));
    setMinutes(newMins);
    setTimeLeft(newMins * 60);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const progress = (timeLeft / (minutes * 60)) * 100;

  return (
    <TherapeuticShell 
      title="Treino de Foco" 
      subtitle="Pequenos momentos de presença constroem grandes mudanças."
      activeTab="focus"
    >
      <div className="flex flex-col items-center justify-center py-12 space-y-12 max-w-xl mx-auto">
        
        {/* Timer Display */}
        <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center">
          {/* Breathing Glow */}
          {isActive && (
            <motion.div 
              animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-[#A78B95] rounded-full blur-[60px]"
            />
          )}

          {/* Progress Ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <circle 
              cx="50%" cy="50%" r="48%" 
              className="stroke-gray-100 fill-none" 
              strokeWidth="6" 
            />
            <motion.circle 
              cx="50%" cy="50%" r="48%" 
              className="stroke-[#A78B95] fill-none" 
              strokeWidth="8"
              strokeLinecap="round"
              initial={{ strokeDasharray: "301.59 301.59", strokeDashoffset: 0 }}
              animate={{ strokeDashoffset: 301.59 * (1 - progress / 100) }}
              transition={{ ease: "linear" }}
              style={{ strokeDasharray: 301.59 }}
            />
          </svg>

          <AnimatePresence mode="wait">
            {!isCompleted ? (
              <motion.div 
                key="timer"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center z-10"
              >
                <span className="text-6xl md:text-7xl font-display font-black text-[#1F2937] tracking-tighter">
                  {formatTime(timeLeft)}
                </span>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#A78B95] mt-2">
                  {isActive ? "Focando agora..." : "Pronta para começar?"}
                </p>
              </motion.div>
            ) : (
              <motion.div 
                key="completed"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center z-10 space-y-2"
              >
                <CheckCircle2 className="h-16 w-16 text-[#84A59D] mx-auto" />
                <h3 className="text-xl font-display font-bold text-[#1F2937]">Excelente!</h3>
                <p className="text-xs text-[#7A7A7A]">Você esteve presente.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-8 w-full">
           <div className="flex items-center gap-6">
              <button 
                onClick={() => adjustMinutes(-1)} 
                disabled={isActive}
                className="h-12 w-12 bg-white rounded-2xl border border-[#F8E9E2] flex items-center justify-center text-[#A78B95] hover:bg-[#F8E9E2] transition-all disabled:opacity-30"
              >
                <Minus className="h-5 w-5" />
              </button>
              
              <div className="text-center min-w-[80px]">
                <span className="text-2xl font-display font-bold text-[#1F2937]">{minutes}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#A78B95] block">minutos</span>
              </div>

              <button 
                onClick={() => adjustMinutes(1)} 
                disabled={isActive}
                className="h-12 w-12 bg-white rounded-2xl border border-[#F8E9E2] flex items-center justify-center text-[#A78B95] hover:bg-[#F8E9E2] transition-all disabled:opacity-30"
              >
                <Plus className="h-5 w-5" />
              </button>
           </div>

           <div className="flex items-center gap-4">
              {isActive ? (
                <button 
                  onClick={handlePause}
                  className="h-20 w-20 bg-[#F8E9E2] text-[#A78B95] rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95"
                >
                  <Pause className="h-8 w-8" />
                </button>
              ) : (
                <button 
                  onClick={handleStart}
                  disabled={isCompleted}
                  className="h-20 w-20 bg-[#A78B95] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#A78B95]/30 transition-transform active:scale-95 disabled:bg-gray-200 disabled:shadow-none"
                >
                  <Play className="h-8 w-8 ml-1" />
                </button>
              )}
              
              <button 
                onClick={handleReset}
                className="h-14 w-14 bg-white text-gray-300 rounded-full border border-gray-100 flex items-center justify-center hover:text-[#A78B95] hover:border-[#A78B95] transition-all"
              >
                <RotateCcw className="h-6 w-6" />
              </button>
           </div>
        </div>

        {/* Supportive Messages */}
        <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[32px] border border-white text-center space-y-4 shadow-sm w-full">
           <div className="flex items-center justify-center gap-2 text-[#84A59D]">
              <Wind className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Guia Mental</span>
           </div>
           <p className="text-sm font-medium text-[#7A7A7A] leading-relaxed">
             {isActive 
              ? "Respire profundamente. Sinta seus pés no chão. Você está fazendo um ótimo trabalho focando apenas nisso agora."
              : "Escolha um tempo curto para começar. Cinco minutos são suficientes para criar um novo caminho neural de presença."}
           </p>
        </div>
      </div>
    </TherapeuticShell>
  );
}
