"use client";

import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { fraseAleatoria } from "@/lib/frases-data";
import Link from "next/link";

export default function MeuDiaTarefas() {
  const [loading, setLoading] = useState(true);
  const [frase] = useState(fraseAleatoria());
  const [tarefas, setTarefas] = useState<{
    essencial: { id?: string; titulo: string; feito: boolean };
    leve: { id?: string; titulo: string; feito: boolean };
    opcional: { id?: string; titulo: string; feito: boolean };
  }>({
    essencial: { titulo: "", feito: false },
    leve: { titulo: "", feito: false },
    opcional: { titulo: "", feito: false },
  });

  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const today = new Date().toISOString().split("T")[0];
        const { data: tarefasData } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", user.id)
          .gte("created_at", today + "T00:00:00")
          .lte("created_at", today + "T23:59:59")
          .order("created_at", { ascending: true });

        if (tarefasData && tarefasData.length > 0) {
          const e = tarefasData.find((t: any) => t.priority_level === "essencial");
          const l = tarefasData.find((t: any) => t.priority_level === "importante");
          const o = tarefasData.find((t: any) => t.priority_level === "opcional");
          setTarefas({
            essencial: e ? { id: e.id, titulo: e.title, feito: e.completed } : { titulo: "", feito: false },
            leve: l ? { id: l.id, titulo: l.title, feito: l.completed } : { titulo: "", feito: false },
            opcional: o ? { id: o.id, titulo: o.title, feito: o.completed } : { titulo: "", feito: false },
          });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const saveTarefa = async (tipo: "essencial" | "leve" | "opcional", titulo: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !titulo.trim()) return;

    const prioridade = tipo === "essencial" ? "essencial" : tipo === "leve" ? "importante" : "opcional";
    const tarefa = tarefas[tipo];

    if (tarefa.id) {
      await supabase.from("tasks").update({ title: titulo.trim() }).eq("id", tarefa.id);
      setTarefas((prev) => ({ ...prev, [tipo]: { ...prev[tipo], titulo: titulo.trim() } }));
    } else {
      const { data } = await supabase
        .from("tasks")
        .insert({ user_id: user.id, title: titulo.trim(), priority_level: prioridade })
        .select("id")
        .single();
      if (data) {
        setTarefas((prev) => ({ ...prev, [tipo]: { id: data.id, titulo: titulo.trim(), feito: false } }));
      }
    }
  };

  const marcarFeito = async (tipo: "essencial" | "leve" | "opcional") => {
    const tarefa = tarefas[tipo];
    if (!tarefa.id) return;
    const novoStatus = !tarefa.feito;
    await supabase.from("tasks").update({ completed: novoStatus }).eq("id", tarefa.id);
    setTarefas((prev) => ({ ...prev, [tipo]: { ...prev[tipo], feito: novoStatus } }));
  };

  const totalFeitas = [tarefas.essencial, tarefas.leve, tarefas.opcional].filter(
    (t) => t.feito
  ).length;
  const totalPreenchidas = [tarefas.essencial, tarefas.leve, tarefas.opcional].filter(
    (t) => t.titulo.trim() !== ""
  ).length;

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5F0]">
      <div className="h-8 w-8 rounded-full bg-[#84A59D]/20 animate-pulse" />
    </div>
  );

  return (
    <div className="px-6 py-8 md:px-12 lg:max-w-2xl mx-auto pb-32 min-h-screen">

      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/dashboard"
          className="h-10 w-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#1F2937] transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-lg font-bold text-[#1F2937]">Meu Dia</h1>
          <p className="text-xs text-[#9CA3AF]">3 tarefas. Só isso.</p>
        </div>
      </div>

      {/* Frase */}
      <p className="text-sm text-[#84A59D] italic mb-8 font-medium">"{frase}"</p>

      {/* Tarefas */}
      <div className="space-y-4 mb-10">
        {(["essencial", "leve", "opcional"] as const).map((tipo) => {
          const labels = { essencial: "Essencial", leve: "Leve", opcional: "Opcional" };
          const descricoes = {
            essencial: "A coisa mais importante de hoje",
            leve: "Algo simples que você pode fazer",
            opcional: "Se sobrar energia — sem pressão",
          };
          const dotColors = {
            essencial: "bg-[#1F2937]",
            leve: "bg-[#84A59D]",
            opcional: "bg-[#D1D5DB]",
          };
          const tarefa = tarefas[tipo];

          return (
            <motion.div
              key={tipo}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: tipo === "essencial" ? 0 : tipo === "leve" ? 0.1 : 0.2 }}
              className="bg-white rounded-2xl p-5 border border-[#E5E7EB] shadow-sm"
            >
              <div className="flex items-start gap-3">
                {/* Check button */}
                <button
                  onClick={() => tarefa.id && marcarFeito(tipo)}
                  disabled={!tarefa.id}
                  className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                    tarefa.feito
                      ? `${dotColors[tipo]} border-transparent`
                      : "border-[#D1D5DB] hover:border-[#84A59D]"
                  } ${!tarefa.id ? "opacity-30" : "cursor-pointer"}`}
                >
                  {tarefa.feito && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`h-2 w-2 rounded-full ${dotColors[tipo]}`} />
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">
                      {labels[tipo]}
                    </span>
                  </div>
                  <input
                    type="text"
                    value={tarefa.titulo}
                    placeholder={descricoes[tipo]}
                    onChange={(e) =>
                      setTarefas((prev) => ({
                        ...prev,
                        [tipo]: { ...prev[tipo], titulo: e.target.value },
                      }))
                    }
                    onBlur={(e) => saveTarefa(tipo, e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        saveTarefa(tipo, (e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).blur();
                      }
                    }}
                    className={`w-full bg-transparent text-sm font-medium text-[#1F2937] focus:outline-none placeholder:text-[#D1D5DB] ${
                      tarefa.feito ? "line-through text-[#9CA3AF]" : ""
                    }`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Resumo */}
      {totalPreenchidas > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center space-y-2"
        >
          <p className="text-sm text-[#64748B]">
            {totalFeitas === 0 && "Você ainda não marcou nenhuma. Sem pressa."}
            {totalFeitas === 1 && "1 tarefa feita. Isso já é muito! 🌿"}
            {totalFeitas === 2 && "2 de 3. Está indo lindo!"}
            {totalFeitas === 3 && "Todas feitas! Você merece descansar. 💛"}
          </p>
          {totalFeitas > 0 && (
            <p className="text-xs text-[#84A59D] italic">
              Fiz ✓ mesmo que mínimo — isso conta.
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}
