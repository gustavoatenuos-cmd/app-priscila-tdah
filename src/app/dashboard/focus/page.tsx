"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Target, Play, Square, Droplet, Wind, Music, Sparkles, CircleCheck, Sidebar as SidebarIcon } from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useState, useEffect, useRef } from "react";

const FOCUS_DURATION = 50 * 60; // 50 minutos em segundos

export default function FocusPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [showRitual, setShowRitual] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [microStep, setMicroStep] = useState("");
  const [distractions, setDistractions] = useState(0);
  const [selectedTask, setSelectedTask] = useState("");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(FOCUS_DURATION);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timer regressivo real
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!);
            setIsRunning(false);
            setShowSummary(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);

  useEffect(() => {
    async function loadTasks() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .eq('completed', false);

      setTasks(data || []);
      setLoading(false);
    }
    loadTasks();
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const startFocus = () => {
    if (!selectedTask) return toast.error("Selecione uma tarefa para focar.");
    setShowRitual(true);
  };

  const completeRitual = () => {
    setShowRitual(false);
    setIsRunning(true);
    setStartTime(Date.now());
    setTimeLeft(FOCUS_DURATION);
  };

  const stopFocus = async (emotion?: string) => {
    try {
      if (intervalRef.current) clearInterval(intervalRef.current);
      setIsRunning(false);

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
          emotion_post_focus: emotion || 'focada'
        });

      if (error) throw error;

      if (emotion) {
        setShowSummary(false);
        setSelectedTask("");
        setDistractions(0);
        setMicroStep("");
        setTimeLeft(FOCUS_DURATION);
        toast.success("Sessão salva! Ótimo trabalho. 🌿");
      } else {
        setShowSummary(true);
      }
    } catch (err: any) {
      toast.error("Erro ao salvar sessão: " + err.message);
    }
  };

  const progressPct = ((FOCUS_DURATION - timeLeft) / FOCUS_DURATION) * 100;

  if (loading) return <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0] text-[#64748B] font-bold">Entrando em Modo Deep...</div>;

  return (
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col min-h-screen">
        <header className="h-20 border-b border-[#E5E7EB] flex items-center px-8 md:px-12 bg-white/60 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold tracking-tight text-[#1F2937]">Zona de Fluxo (Deep Work)</h1>
            {isRunning && (
              <span className="text-[10px] font-black bg-[#84A59D]/10 text-[#84A59D] px-3 py-1 rounded-full uppercase tracking-widest animate-pulse">
                Em Sessão
              </span>
            )}
          </div>
        </header>

        <div className="p-8 md:p-12 max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center">

          <AnimatePresence mode="wait">
            {showSummary ? (
              <motion.div
                key="summary-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-[40px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 w-full max-w-xl text-center"
              >
                <div className="h-20 w-20 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#84A59D]">
                  <CircleCheck className="h-10 w-10" />
                </div>
                <h2 className="text-3xl font-black text-[#1F2937] mb-2">Sessão Finalizada!</h2>
                <p className="text-[#64748B] font-medium mb-10 text-lg">Como você se sentiu saindo dessa sessão?</p>

                <div className="grid grid-cols-3 gap-4 mb-10">
                  <button onClick={() => stopFocus('leve')} className="p-4 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-2">
                    <span className="text-2xl">✨</span>
                    <span className="text-[10px] font-black uppercase text-[#9CA3AF]">Leve</span>
                  </button>
                  <button onClick={() => stopFocus('focada')} className="p-4 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-2">
                    <span className="text-2xl">⚡</span>
                    <span className="text-[10px] font-black uppercase text-[#9CA3AF]">Focada</span>
                  </button>
                  <button onClick={() => stopFocus('cansada')} className="p-4 rounded-2xl border-2 border-[#F1F5F9] hover:border-[#84A59D] transition-all flex flex-col items-center gap-2">
                    <span className="text-2xl">😴</span>
                    <span className="text-[10px] font-black uppercase text-[#9CA3AF]">Cansada</span>
                  </button>
                </div>

                <button
                  onClick={() => { setShowSummary(false); setSelectedTask(""); setTimeLeft(FOCUS_DURATION); }}
                  className="w-full bg-[#333333] text-white py-5 rounded-2xl font-bold text-lg hover:bg-black transition-all"
                >
                  Apenas Voltar
                </button>
              </motion.div>
            ) : !showRitual ? (
              <motion.div
                key="focus-card"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="flex flex-col items-center w-full max-w-lg"
              >
                <div className="bg-white rounded-[40px] p-12 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 flex flex-col items-center w-full relative overflow-hidden">
                  <div className="absolute top-6 left-6 h-8 w-8 rounded-full bg-[#64748B]/10 flex items-center justify-center">
                    <Target className="h-4 w-4 text-[#64748B]" />
                  </div>

                  {!isRunning ? (
                    <div className="w-full mb-10">
                      <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-3 text-center">O que vamos focar agora?</label>
                      <select
                        value={selectedTask}
                        onChange={(e) => setSelectedTask(e.target.value)}
                        className="w-full p-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm font-bold text-[#1F2937] focus:outline-none focus:border-[#64748B]"
                      >
                        <option value="">Selecione uma tarefa...</option>
                        {tasks.map(t => (
                          <option key={t.id} value={t.id}>{t.title}</option>
                        ))}
                        <option value="manual">-- Outra atividade --</option>
                      </select>
                    </div>
                  ) : (
                    <div className="text-center mb-10">
                      <h3 className="text-xs font-black text-[#9CA3AF] uppercase tracking-widest mb-2">Focando em:</h3>
                      <p className="text-xl font-bold text-[#1F2937]">{tasks.find(t => t.id === selectedTask)?.title || "Em Fluxo..."}</p>
                    </div>
                  )}

                  {/* Timer regressivo real com anel de progresso */}
                  <div className="relative flex items-center justify-center mb-12">
                    <svg className="absolute w-56 h-56 -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="46" stroke="#F1F5F9" strokeWidth="4" fill="none" />
                      <circle
                        cx="50" cy="50" r="46"
                        stroke={isRunning ? "#84A59D" : "#E5E7EB"}
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray="289"
                        strokeDashoffset={289 - (289 * progressPct) / 100}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <div className={`text-[72px] md:text-[80px] font-mono leading-none tracking-tighter text-[#1F2937] tabular-nums ${!isRunning ? 'opacity-30' : ''}`}>
                      {formatTime(timeLeft)}
                    </div>
                  </div>

                  {isRunning && (
                    <div className="w-full mb-10">
                      <label className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest block mb-3 text-center">Seu micro-passo atual:</label>
                      <input
                        type="text"
                        value={microStep}
                        onChange={(e) => setMicroStep(e.target.value)}
                        placeholder="Ex: Abrir o documento no Chrome"
                        className="w-full p-4 rounded-2xl border border-[#E5E7EB] bg-[#F9FAFB] text-sm font-medium text-center focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-6 w-full">
                    {!isRunning ? (
                      <button
                        onClick={startFocus}
                        className="w-full bg-[#333333] hover:bg-[#000000] text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-black/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                      >
                        <Play className="h-6 w-6" /> Iniciar Sessão
                      </button>
                    ) : (
                      <div className="flex flex-col gap-4 w-full">
                        <button
                          onClick={() => stopFocus()}
                          className="w-full bg-[#84A59D] hover:bg-[#6c8c84] text-white font-bold h-16 rounded-2xl text-lg shadow-xl shadow-[#84A59D]/10 transition-all hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                          <Square className="h-6 w-6" /> Concluir Sessão
                        </button>
                        <button
                          onClick={() => setDistractions(d => d + 1)}
                          className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest hover:text-[#333333] transition-colors"
                        >
                          Fui distraída ({distractions})
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-8 text-[#9CA3AF] font-bold text-center uppercase tracking-widest text-[10px]">TDAH Constante: Zona de Fluxo</p>
              </motion.div>
            ) : (
              <motion.div
                key="ritual-card"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                className="bg-white rounded-[40px] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-[#E5E7EB]/50 w-full max-w-xl text-center"
              >
                <div className="h-16 w-16 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto mb-8 text-[#84A59D]">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-black text-[#1F2937] mb-4">Ritual de Foco (20s)</h2>
                <p className="text-[#64748B] font-medium mb-10 leading-relaxed">Prepare seu corpo. O ritual reduz a inércia e avisa ao cérebro que agora é hora de fluxo.</p>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <RitualOption icon={<Droplet />} label="Água" />
                  <RitualOption icon={<Wind />} label="Respiração" />
                  <RitualOption icon={<Music />} label="Onda Alpha" />
                  <RitualOption icon={<SidebarIcon />} label="Mesa Limpa" />
                </div>

                <button
                  onClick={completeRitual}
                  className="w-full bg-[#333333] text-white py-5 rounded-2xl font-bold text-lg shadow-lg hover:bg-black transition-all"
                >
                  Estou pronta 🚀
                </button>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>
    </div>
  );
}

function RitualOption({ icon, label }: { icon: any, label: string }) {
  return (
    <div className="p-4 rounded-2xl border-2 border-[#E5E7EB] hover:border-[#84A59D] transition-all cursor-pointer flex flex-col items-center gap-3 group">
      <div className="text-[#9CA3AF] group-hover:text-[#84A59D] transition-colors">{icon}</div>
      <span className="text-xs font-bold text-[#64748B] group-hover:text-[#333333] uppercase tracking-wider">{label}</span>
    </div>
  );
}
