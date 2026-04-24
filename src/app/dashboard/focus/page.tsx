"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Target, Play, Square, Droplet, Wind, Music, Sparkles, 
  CircleCheck, Brain, Zap, MessageSquare, History, 
  ChevronRight, ArrowLeft, Loader2, Star, TrendingUp
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

const MINDFULNESS_DURATION = 2 * 60; // 2 minutos
const FOCUS_DURATION = 50 * 60; // 50 minutos

type Stage = 'idle' | 'mindfulness' | 'focus' | 'summary';

export default function FocusPage() {
  const [stage, setStage] = useState<Stage>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const [selectedTask, setSelectedTask] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [distractions, setDistractions] = useState(0);
  const [thoughts, setThoughts] = useState<string[]>([]);
  const [currentThought, setCurrentThought] = useState("");
  const [focusScore, setFocusScore] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer Logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            handleStageComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, stage]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Load Tasks
    const { data: tasksData } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .eq('completed', false);
    setTasks(tasksData || []);

    // Load History
    const { data: historyData } = await supabase
      .from('focus_sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    setHistory(historyData || []);

    setLoading(false);
  }

  const handleStageComplete = () => {
    setIsRunning(false);
    if (stage === 'mindfulness') {
      setStage('focus');
      setTimeLeft(FOCUS_DURATION);
      setIsRunning(true);
      setStartTime(Date.now());
    } else if (stage === 'focus') {
      setStage('summary');
      calculateFinalScore();
    }
  };

  const calculateFinalScore = () => {
    const duration = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;
    const baseScore = duration * 10;
    const distractionPenalty = distractions * 5;
    const finalScore = Math.max(baseScore - distractionPenalty, 0);
    setFocusScore(finalScore);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startMindfulness = () => {
    if (!selectedTask) return toast.error("Selecione uma intenção para focar.");
    setStage('mindfulness');
    setTimeLeft(MINDFULNESS_DURATION);
    setIsRunning(true);
  };

  const skipMindfulness = () => {
    setStage('focus');
    setTimeLeft(FOCUS_DURATION);
    setIsRunning(true);
    setStartTime(Date.now());
  };

  const addThought = () => {
    if (!currentThought.trim()) return;
    setThoughts([...thoughts, currentThought.trim()]);
    setCurrentThought("");
    setDistractions(prev => prev + 1);
    toast.info("Pensamento estacionado. Volte ao foco. 🌿", { duration: 2000 });
  };

  const saveSession = async (emotion: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const duration = startTime ? Math.round((Date.now() - startTime) / 60000) : 0;

      const { error } = await supabase
        .from('focus_sessions')
        .insert({
          user_id: user.id,
          task_id: selectedTask !== "manual" ? selectedTask : null,
          duration_minutes: Math.max(duration, 1),
          distractions_count: distractions,
          emotion_post_focus: emotion,
          session_notes: thoughts.join("\n"),
          focus_score: focusScore
        });

      if (error) throw error;

      // Update Total Points and Level in Profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points, current_level')
        .eq('id', user.id)
        .single();

      if (profile) {
        const newPoints = (profile.total_points || 0) + focusScore;
        const newLevel = Math.floor(newPoints / 500) + 1; // 500 points per level

        await supabase
          .from('profiles')
          .update({ 
            total_points: newPoints,
            current_level: newLevel
          })
          .eq('id', user.id);
        
        if (newLevel > (profile.current_level || 1)) {
           toast.success(`🎉 NÍVEL UP! Você agora é Nível ${newLevel}!`);
        }
      }

      toast.success("Sessão salva no seu histórico evolutivo!");
      resetSession();
      loadData();
    } catch (err: any) {
      toast.error("Erro ao salvar: " + err.message);
    }
  };

  const resetSession = () => {
    setStage('idle');
    setIsRunning(false);
    setTimeLeft(FOCUS_DURATION);
    setSelectedTask("");
    setThoughts([]);
    setDistractions(0);
    setFocusScore(0);
    setStartTime(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
      <Loader2 className="h-8 w-8 animate-spin text-[#84A59D]" />
    </div>
  );

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col min-h-screen relative">
        
        {/* Background Visual Effects (Dynamic based on stage) */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <AnimatePresence>
            {stage === 'mindfulness' && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-gradient-to-b from-[#84A59D]/10 to-transparent"
              />
            )}
            {stage === 'focus' && isRunning && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#84A59D08_0%,_transparent_70%)]"
              />
            )}
          </AnimatePresence>
        </div>

        <header className="h-20 border-b border-[#E5E7EB] flex items-center justify-between px-8 md:px-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Target className="h-6 w-6 text-[#84A59D]" />
            <h1 className="text-xl font-black tracking-tight text-[#1F2937] uppercase">Zona de Fluxo</h1>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest leading-none">Power Score</span>
                <span className="text-xl font-black text-[#1F2937] leading-none mt-1">{focusScore}</span>
             </div>
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-6xl mx-auto w-full flex-1 flex flex-col z-10">
          
          <AnimatePresence mode="wait">
            
            {/* IDLE STAGE: Selection & History */}
            {stage === 'idle' && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                className="grid lg:grid-cols-2 gap-12 items-center justify-center h-full"
              >
                <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#84A59D]/10 rounded-full mb-6">
                    <Sparkles className="h-3 w-3 text-[#84A59D]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#84A59D]">Ativação Cognitiva</span>
                  </div>
                  <h2 className="text-5xl font-black text-[#1F2937] leading-[1.1] mb-8">Pronta para construir seu <span className="text-[#84A59D]">Poder de Foco</span>?</h2>
                  
                  <div className="w-full max-w-md space-y-6">
                    <div className="bg-white p-8 rounded-[40px] shadow-sm border border-[#E5E7EB]/50">
                      <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-4">Qual sua intenção agora?</label>
                      <select
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                        className="w-full p-5 rounded-2xl border-2 border-[#F1F5F9] bg-[#F9FAFB] text-sm font-bold text-[#1F2937] focus:outline-none focus:border-[#84A59D] transition-all mb-8 appearance-none"
                      >
                        <option value="">Selecione uma tarefa...</option>
                        {tasks.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                        <option value="manual">-- Outra Atividade --</option>
                      </select>

                      <button
                        onClick={startMindfulness}
                        className="w-full bg-[#1F2937] hover:bg-black text-white font-black h-18 rounded-3xl text-lg shadow-2xl shadow-black/10 transition-all flex items-center justify-center gap-4 group"
                      >
                        Iniciar Protocolo <ChevronRight className="h-6 w-6 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="hidden lg:flex flex-col gap-6">
                   <h3 className="text-xs font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-2">Evolução Recente</h3>
                   {history.map((session, i) => (
                     <div key={session.id} className="bg-white/50 backdrop-blur-sm p-6 rounded-3xl border border-[#E5E7EB] flex items-center justify-between group hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 rounded-2xl bg-[#84A59D]/10 flex items-center justify-center text-[#84A59D]">
                              <Zap className="h-5 w-5" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-[#1F2937] uppercase">{new Date(session.created_at).toLocaleDateString()}</p>
                              <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest">{session.duration_minutes} MINUTOS</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-lg font-black text-[#1F2937]">+{session.focus_score}</p>
                           <p className="text-[8px] font-black text-[#84A59D] uppercase">PTS</p>
                        </div>
                     </div>
                   ))}
                   {history.length === 0 && <p className="text-sm font-bold text-[#9CA3AF]">Sua jornada começa agora. 🚀</p>}
                </div>
              </motion.div>
            )}

            {/* STAGE 1: MINDFULNESS (Descompressão) */}
            {stage === 'mindfulness' && (
              <motion.div 
                key="mindfulness"
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
                className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto text-center"
              >
                <div className="mb-12">
                   <div className="h-24 w-24 bg-[#1F2937] rounded-[35%] flex items-center justify-center mx-auto mb-8 shadow-2xl relative">
                      <Wind className="h-12 w-12 text-[#84A59D] animate-pulse" />
                      <div className="absolute inset-0 bg-[#84A59D]/20 blur-2xl rounded-full scale-150 animate-pulse" />
                   </div>
                   <h2 className="text-4xl font-black text-[#1F2937] mb-4">Fase 01: Silenciando o Ruído</h2>
                   <p className="text-[#64748B] font-medium text-lg leading-relaxed">
                      Sente-se, respire. Escreva abaixo tudo o que está "apitando" na sua mente agora para podermos focar no que importa em seguida.
                   </p>
                </div>

                <div className="text-[64px] font-mono font-black text-[#1F2937] mb-12 tabular-nums">
                   {formatTime(timeLeft)}
                </div>

                <div className="w-full mb-10">
                   <textarea
                    placeholder="Ex: Tenho que pagar o boleto, comprar leite, a música tá alta..."
                    className="w-full bg-white border-2 border-[#E5E7EB] p-8 rounded-[40px] text-lg font-bold text-[#1F2937] focus:border-[#84A59D] focus:outline-none min-h-[160px] shadow-sm transition-all"
                    onChange={(e) => setCurrentThought(e.target.value)}
                    value={currentThought}
                   />
                </div>

                <div className="flex items-center gap-4 w-full">
                   <button 
                    onClick={() => {
                      if (currentThought) setThoughts([currentThought]);
                      handleStageComplete();
                    }}
                    className="flex-1 bg-[#1F2937] text-white py-6 rounded-3xl font-black text-xl hover:bg-black transition-all"
                   >
                     Estou em Silêncio 🌿
                   </button>
                   <button 
                    onClick={skipMindfulness}
                    className="px-8 text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest hover:text-[#333333] transition-colors"
                   >
                     Pular Fase
                   </button>
                </div>
              </motion.div>
            )}

            {/* STAGE 2: FOCUS (Ativação) */}
            {stage === 'focus' && (
              <motion.div 
                key="focus"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="grid lg:grid-cols-3 gap-12 h-full items-start"
              >
                {/* Left: Task Info */}
                <div className="hidden lg:flex flex-col gap-8 pt-20">
                   <div className="bg-white/80 backdrop-blur-sm p-10 rounded-[48px] border border-[#E5E7EB] shadow-sm">
                      <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-4">Intenção Ativa</span>
                      <h3 className="text-2xl font-black text-[#1F2937] leading-tight mb-4">
                        {tasks.find(t => t.id === selectedTask)?.title || "Atividade Manual"}
                      </h3>
                      <div className="flex items-center gap-2 text-[#84A59D]">
                         <Zap className="h-4 w-4" />
                         <span className="text-xs font-black uppercase tracking-widest">Hiperfoco Ativado</span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] px-4">Pensamentos Estacionados</h4>
                      <div className="space-y-2">
                         {thoughts.map((t, i) => (
                           <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} key={i} className="bg-white/40 p-4 rounded-2xl border border-[#E5E7EB] text-xs font-bold text-[#64748B]">
                              {t}
                           </motion.div>
                         ))}
                         {thoughts.length === 0 && <p className="px-4 text-[10px] font-bold text-[#9CA3AF] italic">Mente limpa...</p>}
                      </div>
                   </div>
                </div>

                {/* Center: The Core Timer & Energy Meter */}
                <div className="flex flex-col items-center justify-center pt-10 lg:pt-20">
                   <div className="relative flex items-center justify-center mb-16">
                      {/* Animated Glow */}
                      <motion.div 
                        animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute w-[300px] h-[300px] bg-[#84A59D]/20 blur-[60px] rounded-full"
                      />
                      
                      <svg className="absolute w-[320px] h-[320px] -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" stroke="rgba(0,0,0,0.03)" strokeWidth="1" fill="none" />
                        <motion.circle
                          cx="50" cy="50" r="48"
                          stroke="#1F2937"
                          strokeWidth="2"
                          fill="none"
                          strokeDasharray="301.6"
                          strokeDashoffset={301.6 - (301.6 * ((FOCUS_DURATION - timeLeft) / FOCUS_DURATION))}
                          strokeLinecap="round"
                          className="transition-all duration-1000 ease-linear"
                        />
                      </svg>

                      <div className="relative flex flex-col items-center">
                         <div className="text-[96px] font-mono font-black text-[#1F2937] leading-none tabular-nums tracking-tighter">
                            {formatTime(timeLeft)}
                         </div>
                         <div className="mt-4 flex items-center gap-2">
                            {[1,2,3,4,5].map(i => (
                              <motion.div 
                                key={i}
                                animate={timeLeft % 2 === 0 ? { opacity: [0.3, 1, 0.3] } : {}}
                                className={`h-1.5 w-6 rounded-full ${i <= (Math.floor(((FOCUS_DURATION-timeLeft)/FOCUS_DURATION)*5)+1) ? 'bg-[#84A59D]' : 'bg-[#E5E7EB]'}`}
                              />
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Thought Sandbox (ADHD Essential) */}
                   <div className="w-full max-w-md bg-white p-6 rounded-[32px] border border-[#E5E7EB] shadow-lg mb-10 group focus-within:border-[#1F2937] transition-all">
                      <label className="text-[9px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-3 text-center group-focus-within:text-[#1F2937]">Estacionar Distração (Dê um nome a ela)</label>
                      <div className="flex gap-3">
                         <input 
                          type="text"
                          placeholder="Ex: Lembrei do e-mail..."
                          className="flex-1 bg-transparent border-none text-sm font-bold text-[#1F2937] focus:outline-none"
                          value={currentThought}
                          onChange={(e) => setCurrentThought(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && addThought()}
                         />
                         <button onClick={addThought} className="h-10 w-10 bg-[#1F2937] text-white rounded-xl flex items-center justify-center hover:scale-105 transition-all">
                            <MessageSquare className="h-4 w-4" />
                         </button>
                      </div>
                   </div>

                   <button 
                    onClick={() => handleStageComplete()}
                    className="group bg-white/50 hover:bg-white text-[#1F2937] border-2 border-[#E5E7EB] hover:border-[#1F2937] px-10 py-5 rounded-3xl font-black text-sm uppercase tracking-widest transition-all flex items-center gap-3"
                   >
                     <Square className="h-4 w-4 fill-[#1F2937]" /> Finalizar Sessão
                   </button>
                </div>

                {/* Right: Insights & Motivation */}
                <div className="hidden lg:flex flex-col gap-8 pt-20">
                   <div className="bg-[#1F2937] p-10 rounded-[48px] text-white shadow-2xl relative overflow-hidden">
                      <div className="absolute -top-10 -right-10 h-40 w-40 bg-[#84A59D]/10 rounded-full blur-3xl" />
                      <div className="relative z-10">
                        <Star className="h-8 w-8 text-[#84A59D] mb-6" />
                        <h4 className="text-xl font-black mb-2">Poder Evolutivo</h4>
                        <p className="text-white/60 text-sm font-medium leading-relaxed mb-6">Cada minuto focado aqui está reconfigurando sua rede neural para o controle de impulsos.</p>
                        <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                           <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((FOCUS_DURATION - timeLeft) / FOCUS_DURATION) * 100}%` }}
                            className="h-full bg-[#84A59D]"
                           />
                        </div>
                      </div>
                   </div>

                   <div className="p-8 border-2 border-dashed border-[#E5E7EB] rounded-[40px] flex flex-col items-center text-center">
                      <div className="h-12 w-12 bg-white rounded-2xl flex items-center justify-center text-[#9CA3AF] mb-4">
                        <TrendingUp className="h-6 w-6" />
                      </div>
                      <p className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest">Sua sequência atual:</p>
                      <p className="text-2xl font-black text-[#1F2937]">{history.length > 0 ? history.length : 0} Dias</p>
                   </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3: SUMMARY (Avaliação) */}
            {stage === 'summary' && (
              <motion.div 
                key="summary"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center max-w-4xl mx-auto w-full"
              >
                <div className="bg-white rounded-[60px] p-12 md:p-20 shadow-[0_40px_100px_rgba(0,0,0,0.06)] border border-[#E5E7EB]/50 w-full text-center relative overflow-hidden">
                   <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#84A59D] via-[#1F2937] to-[#84A59D]" />
                   
                   <div className="h-24 w-24 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#84A59D]">
                      <CircleCheck className="h-12 w-12" />
                   </div>
                   
                   <h2 className="text-4xl font-black text-[#1F2937] mb-2 text-center uppercase tracking-tight">Sessão Concluída!</h2>
                   <div className="flex items-center justify-center gap-4 mb-12">
                      <div className="flex flex-col items-center">
                         <span className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em]">Poder Ganho</span>
                         <span className="text-4xl font-black text-[#1F2937]">+{focusScore}</span>
                      </div>
                   </div>

                   <div className="grid md:grid-cols-2 gap-10 mb-16">
                      <div className="text-left">
                         <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-6">Mapeamento de Distrações</h4>
                         <div className="space-y-3">
                            {thoughts.map((t, i) => (
                              <div key={i} className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB] text-xs font-bold text-[#64748B] flex items-center gap-3">
                                 <div className="h-2 w-2 rounded-full bg-[#84A59D]" /> {t}
                              </div>
                            ))}
                            {thoughts.length === 0 && <p className="text-sm font-bold text-[#9CA3AF] italic">Nenhuma distração registrada. Foco total! 💎</p>}
                         </div>
                      </div>

                      <div className="text-left">
                         <h4 className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.2em] mb-6">Auto-Avaliação Psicológica</h4>
                         <p className="text-sm font-bold text-[#64748B] mb-8 leading-relaxed">Como você descreveria sua clareza mental agora em comparação ao início?</p>
                         <div className="grid grid-cols-3 gap-4">
                            <button onClick={() => saveSession('leve')} className="p-5 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-3 group">
                              <span className="text-3xl group-hover:scale-110 transition-transform">✨</span>
                              <span className="text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest">Leve</span>
                            </button>
                            <button onClick={() => saveSession('focada')} className="p-5 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-3 group">
                              <span className="text-3xl group-hover:scale-110 transition-transform">⚡</span>
                              <span className="text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest">Focada</span>
                            </button>
                            <button onClick={() => saveSession('cansada')} className="p-5 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-3 group">
                              <span className="text-3xl group-hover:scale-110 transition-transform">😴</span>
                              <span className="text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest">Cansada</span>
                            </button>
                         </div>
                      </div>
                   </div>

                   <button 
                    onClick={resetSession}
                    className="w-full text-[10px] font-black text-[#9CA3AF] uppercase tracking-[0.3em] hover:text-[#1F2937] transition-colors"
                   >
                     Descartar e Voltar
                   </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}
