"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Wind, Play, Pause, Check } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Duration = 2 | 5 | 10;

const GUIDES: Record<Duration, { titulo: string; passos: string[] }> = {
  2: {
    titulo: "2 minutos para voltar a respirar",
    passos: [
      "Sente onde estiver. Solte os ombros.",
      "Inspire pelo nariz contando até 4. Segure 2. Solte pela boca contando até 6.",
      "Repita esse ciclo. Quando a mente fugir, volte gentilmente.",
      "Antes de abrir os olhos, lembre: você só precisa começar.",
    ],
  },
  5: {
    titulo: "5 minutos para reencontrar o foco",
    passos: [
      "Tire um momento para chegar — beba um gole de água, ajuste a postura.",
      "Por 1 minuto, só observe a sua respiração. Sem mudar nada.",
      "Por 3 minutos, repita: inspire 4, segure 2, expire 6.",
      "No último minuto, pense: qual é o menor próximo passo agora?",
      "Quando o timer acabar, faça esse passo. Só ele.",
    ],
  },
  10: {
    titulo: "10 minutos para acalmar a mente",
    passos: [
      "Encontre um lugar tranquilo. Pode sentar ou deitar.",
      "Comece com 5 respirações longas — inspire 4, segure 4, expire 8.",
      "Por 5 minutos, observe os pensamentos passando. Não segure nenhum.",
      "Nos próximos 3 minutos, lembre de algo gentil que você fez por si recentemente.",
      "Termine escolhendo uma palavra para hoje. Só uma.",
      "Anote ou guarde essa palavra. Ela é o seu norte do dia.",
    ],
  },
};

function PresencaSession({ duration, onClose }: { duration: Duration; onClose: () => void }) {
  const totalSeconds = duration * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [running, setRunning] = useState(true);
  const [done, setDone] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!running) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          setDone(true);
          setRunning(false);
          // Save session
          (async () => {
            try {
              const { data: { user } } = await supabase.auth.getUser();
              if (user) {
                await supabase.from("presence_sessions").insert({
                  user_id: user.id,
                  duration_minutes: duration,
                  completed: true,
                });
              }
            } catch (e) {
              console.error(e);
            }
          })();
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running, duration]);

  const guide = GUIDES[duration];
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const progress = (totalSeconds - secondsLeft) / totalSeconds;

  if (done) {
    return (
      <div className="text-center py-12">
        <div className="h-20 w-20 bg-[#84A59D]/15 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="h-10 w-10 text-[#84A59D]" />
        </div>
        <h2 className="text-2xl font-display font-black text-[#1F2937] mb-3">
          Você esteve aqui.
        </h2>
        <p className="text-[#64748B] mb-10 max-w-sm mx-auto leading-relaxed">
          {duration} minutos de presença é mais do que parece. Carregue essa pausa
          com você no resto do dia.
        </p>
        <button
          onClick={onClose}
          className="bg-[#1F2937] hover:bg-black text-white px-8 py-4 rounded-2xl font-bold"
        >
          Voltar
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D] mb-3">
        Momento presença
      </p>
      <h2 className="text-2xl md:text-3xl font-display font-black text-[#1F2937] mb-2">
        {guide.titulo}
      </h2>
      <p className="text-sm italic text-[#64748B] mb-10 max-w-sm mx-auto">
        Você não precisa fazer perfeito. Só precisa começar.
      </p>

      {/* Timer circular */}
      <div className="relative h-48 w-48 mx-auto mb-10">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#E5E7EB" strokeWidth="3" />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="#84A59D"
            strokeWidth="3"
            strokeDasharray={`${progress * 283} 283`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-display font-black text-[#1F2937]">
            {mins}:{secs.toString().padStart(2, "0")}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
            {running ? "respirando" : "pausada"}
          </span>
        </div>
      </div>

      {/* Passos guiados */}
      <ul className="text-left max-w-md mx-auto space-y-2 mb-10">
        {guide.passos.map((p, i) => (
          <li
            key={i}
            className="flex items-start gap-3 text-sm text-[#64748B] leading-relaxed"
          >
            <span className="inline-block h-5 w-5 rounded-full bg-[#84A59D]/15 text-[#84A59D] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
              {i + 1}
            </span>
            {p}
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-3">
        <button
          onClick={() => setRunning((v) => !v)}
          className="bg-[#1F2937] hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2"
        >
          {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {running ? "Pausar" : "Continuar"}
        </button>
        <button
          onClick={onClose}
          className="bg-white hover:bg-[#F5F5F0] border border-[#E5E7EB] text-[#64748B] px-6 py-3 rounded-2xl font-bold"
        >
          Sair sem culpa
        </button>
      </div>
    </div>
  );
}

export default function PresencaPage() {
  const [active, setActive] = useState<Duration | null>(null);

  return (
    <div className="px-6 py-8 md:px-12 lg:max-w-2xl mx-auto pb-32 min-h-screen">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="h-10 w-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#1F2937]"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#1F2937]">Momento Presença</h1>
          <p className="text-xs text-[#9CA3AF]">Respire. Volte. Comece.</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {active ? (
          <motion.div
            key={`session-${active}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
          >
            <PresencaSession duration={active} onClose={() => setActive(null)} />
          </motion.div>
        ) : (
          <motion.div
            key="picker"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="bg-[#84A59D]/10 border border-[#84A59D]/20 rounded-3xl p-6 mb-8 flex items-start gap-3">
              <Wind className="h-5 w-5 text-[#84A59D] shrink-0 mt-1" />
              <p className="text-sm text-[#1F2937] leading-relaxed">
                Você não precisa fazer perfeito. Só precisa começar. Escolha quanto
                tempo você tem agora — qualquer um é o tempo certo.
              </p>
            </div>

            <div className="grid gap-4">
              {([2, 5, 10] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setActive(d)}
                  className="text-left bg-white hover:bg-[#F5F5F0] border border-[#E5E7EB] hover:border-[#84A59D] rounded-3xl p-6 transition-all group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D]">
                      {d === 2 ? "Vou tentar" : d === 5 ? "Tenho um respiro" : "Quero pausar de verdade"}
                    </span>
                    <Play className="h-4 w-4 text-[#9CA3AF] group-hover:text-[#84A59D] transition-colors" />
                  </div>
                  <p className="text-3xl font-display font-black text-[#1F2937] mb-1">
                    {d} minutos
                  </p>
                  <p className="text-sm text-[#64748B]">
                    {GUIDES[d].titulo}
                  </p>
                </button>
              ))}
            </div>

            <p className="text-center text-xs text-[#9CA3AF] mt-10 italic">
              Áudios da Priscilla chegam no Mês 3.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
