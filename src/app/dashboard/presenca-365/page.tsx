"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Check, Lock, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fetchTasks, upsertTasks, saveEmotionalCheck } from "@/lib/presenca-data";
import { PRESENCA_365 } from "@/lib/presenca-data";
import { useRouter } from "next/navigation";

export default function Presenca365Page() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [diaAtual, setDiaAtual] = useState(1);
  const [diaVisualizado, setDiaVisualizado] = useState(1);
  const [diasCompletados, setDiasCompletados] = useState<Set<number>>(new Set());
  const [marcando, setMarcando] = useState(false);
  // New state for tasks and emotional check
  const [tasks, setTasks] = useState<string[]>(["", "", ""]);
  const [emotional, setEmotional] = useState<number | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        // Buscar todos os dias completados
        const { data: presencas } = await supabase
          .from("presenca_diaria")
          .select("dia_numero")
          .eq("user_id", user.id)
          .eq("completado", true);

        const completados = new Set((presencas || []).map((p: any) => p.dia_numero));
        setDiasCompletados(completados);

        // Calcular dia atual (próximo não completado, ou o último +1)
        let proximo = 1;
        for (let i = 1; i <= 365; i++) {
          if (!completados.has(i)) { proximo = i; break; }
          proximo = i + 1;
        }
        proximo = Math.min(proximo, PRESENCA_365.length);
        setDiaAtual(proximo);
        setDiaVisualizado(proximo);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [router]);

  useEffect(() => {
    async function loadDayData() {
      if (!diaVisualizado) return;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        const fetchedTasks = await fetchTasks(user.id, diaVisualizado);
        setTasks([
          fetchedTasks[0]?.description ?? "",
          fetchedTasks[1]?.description ?? "",
          fetchedTasks[2]?.description ?? "",
        ]);

        const { data: emoData } = await supabase
          .from("emotional_checks")
          .select("level")
          .eq("user_id", user.id)
          .eq("dia_numero", diaVisualizado)
          .single();
        setEmotional(emoData?.level ?? null);
      } catch (err) {
        console.error("Error loading day data:", err);
      }
    }
    loadDayData();
  }, [diaVisualizado]);

  const marcarPresente = async () => {
    setMarcando(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Salvar tarefas
      await upsertTasks(user.id, diaVisualizado, tasks.map((desc, idx) => ({ task_number: idx + 1, description: desc })));
      // Salvar check emocional se houver
      if (emotional !== null) {
        await saveEmotionalCheck(user.id, diaVisualizado, emotional);
      }
      // Marcar presença
      await supabase.from("presenca_diaria").upsert(
        {
          user_id: user.id,
          dia_numero: diaVisualizado,
          completado: true,
          completado_em: new Date().toISOString(),
        },
        { onConflict: "user_id,dia_numero" }
      );

      setDiasCompletados((prev) => new Set([...prev, diaVisualizado]));
    } catch (err) {
      console.error(err);
    } finally {
      setMarcando(false);
    }
  };

  const navegarDia = (direcao: "anterior" | "proximo") => {
    if (direcao === "anterior" && diaVisualizado > 1) {
      setDiaVisualizado(diaVisualizado - 1);
    } else if (direcao === "proximo") {
      // Pode avançar até o dia atual (não além)
      if (diaVisualizado < diaAtual) {
        setDiaVisualizado(diaVisualizado + 1);
      }
    }
  };

  const diaData = PRESENCA_365.find((d) => d.dia === diaVisualizado);
  const diaCompletado = diasCompletados.has(diaVisualizado);
  const diaBloqueado = diaVisualizado > diaAtual;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="h-10 w-10 rounded-full bg-[#84A59D]/20" />
      </motion.div>
    </div>
  );

  return (
    <div className="px-6 py-8 md:px-12 lg:max-w-2xl mx-auto pb-32 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/dashboard"
          className="h-10 w-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#1F2937] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#1F2937]">365 Dias de Presença</h1>
          <p className="text-xs text-[#9CA3AF]">
            {diasCompletados.size} de {PRESENCA_365.length} dias completados
          </p>
        </div>
      </div>

      {/* Progresso mini */}
      <div className="h-1.5 bg-[#F1F5F9] rounded-full mb-8 overflow-hidden">
        <motion.div
          className="h-full bg-[#84A59D] rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(diasCompletados.size / PRESENCA_365.length) * 100}%` }}
          transition={{ duration: 0.8 }}
        />
      </div>

      {/* Navegação entre dias */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navegarDia("anterior")}
          disabled={diaVisualizado <= 1}
          className="h-10 w-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#1F2937] disabled:opacity-30 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <span className="text-sm font-bold text-[#1F2937]">
          Dia {diaVisualizado} de {PRESENCA_365.length}
        </span>

        <button
          onClick={() => navegarDia("proximo")}
          disabled={diaVisualizado >= diaAtual}
          className="h-10 w-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#9CA3AF] hover:text-[#1F2937] disabled:opacity-30 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Conteúdo do dia */}
      {diaData && !diaBloqueado ? (
        <motion.div
          key={diaVisualizado}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm space-y-8"
        >
          {/* Título do dia (vindo do livro) */}
          {diaData.titulo && (
            <div className="text-center">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D] mb-2">
                Dia {diaData.dia}
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-black text-[#1F2937] tracking-tight leading-tight">
                {diaData.titulo}
              </h2>
            </div>
          )}

          {/* Frase do dia */}
          <div className="text-center">
            <p className="text-lg md:text-xl italic text-[#64748B] leading-snug">
              &ldquo;{diaData.frase}&rdquo;
            </p>
          </div>

          {diaData.placeholder && (
            <p className="text-center text-[10px] uppercase tracking-widest font-bold text-[#9CA3AF]">
              Este dia será revisado em breve.
            </p>
          )}

          {/* Reflexão */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Reflexão</h3>
            <p className="text-sm text-[#64748B] leading-relaxed">{diaData.reflexao}</p>
          </div>

          {/* Ação */}
          <div className="bg-[#F8F9FA] rounded-2xl p-5 space-y-2">
            <h3 className="text-xs font-bold text-[#84A59D] uppercase tracking-wider">Ação de hoje</h3>
            <p className="text-sm font-medium text-[#1F2937] leading-relaxed">{diaData.acao}</p>
          </div>

          {/* Tarefas do dia (3) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-[#84A59D] uppercase tracking-wider">Minhas 3 tarefas</h3>
            {tasks.map((t, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Tarefa ${idx + 1}`}
                className="w-full px-4 py-3 bg-[#F8F9FA] border-none rounded-xl focus:outline-none focus:ring-2 focus:ring-[#84A59D] text-sm text-[#1F2937] transition-all"
                value={t}
                onChange={(e) => {
                  const newTasks = [...tasks];
                  newTasks[idx] = e.target.value;
                  setTasks(newTasks);
                }}
                disabled={diaCompletado}
              />
            ))}
          </div>

          {/* Check Emocional */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-[#84A59D] uppercase tracking-wider mb-3">Como se sente?</h3>
            <div className="flex gap-3">
              {[0, 1, 2].map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  disabled={diaCompletado}
                  className={`flex-1 p-3 rounded-xl border transition-all flex justify-center items-center ${
                    emotional === lvl 
                      ? "bg-[#84A59D] text-white border-[#84A59D] scale-105" 
                      : "bg-white border-[#E5E7EB] text-[#64748B] hover:bg-[#F8F9FA] hover:scale-105 disabled:hover:scale-100 disabled:opacity-50"
                  }`}
                  onClick={() => setEmotional(lvl)}
                >
                  <span className="text-2xl">{lvl === 0 ? "😔" : lvl === 1 ? "😐" : "😄"}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Botão de presença */}
          {diaCompletado ? (
            <div className="flex items-center justify-center gap-2 py-4">
              <div className="h-8 w-8 bg-[#84A59D]/10 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-[#84A59D]" />
              </div>
              <p className="text-sm font-bold text-[#84A59D]">Presente! ✅</p>
            </div>
          ) : (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={marcarPresente}
              disabled={marcando}
              className="w-full bg-[#1F2937] text-white py-4 rounded-2xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50"
            >
              {marcando ? "Marcando..." : "Fiz mesmo (mínimo) ✓"}
            </motion.button>
          )}
        </motion.div>
      ) : diaBloqueado ? (
        <div className="bg-white rounded-3xl p-8 border border-[#E5E7EB] shadow-sm text-center space-y-4">
          <Lock className="h-8 w-8 text-[#D1D5DB] mx-auto" />
          <p className="text-sm text-[#9CA3AF]">
            Este dia ainda não está disponível.
          </p>
          <p className="text-xs text-[#D1D5DB] italic">
            Os dias são liberados um a um, sem pulo.
          </p>
        </div>
      ) : null}
    </div>
  );
}
