"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, Check, Snowflake, ChevronRight, BrainCircuit, Sparkles, Wind, CheckSquare, BookMarked, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { fraseDodia } from "@/lib/frases-data";
import { PRESENCA_365 } from "@/lib/presenca-data";

export default function MeuDia() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [currentDate, setCurrentDate] = useState("");
  const [frase, setFrase] = useState("");

  // Presença 365
  const [diaAtual, setDiaAtual] = useState(1);
  const [presencaHoje, setPresencaHoje] = useState(false);

  // Tarefas do dia (3 máximo)
  const [tarefas, setTarefas] = useState<{
    essencial: { id?: string; titulo: string; feito: boolean };
    leve: { id?: string; titulo: string; feito: boolean };
    opcional: { id?: string; titulo: string; feito: boolean };
  }>({
    essencial: { titulo: "", feito: false },
    leve: { titulo: "", feito: false },
    opcional: { titulo: "", feito: false },
  });

  // Constância semanal
  const [diasSemana, setDiasSemana] = useState<boolean[]>([false, false, false, false, false, false, false]);
  const [diasPresente, setDiasPresente] = useState(0);

  // IA Insight
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);

  // Travei modal
  const [traveiAberto, setTraveiAberto] = useState(false);
  const [traveiStep, setTraveiStep] = useState<"opcoes" | "timer" | "respirar" | "minima" | "feito">("opcoes");
  const [traveiTimer, setTraveiTimer] = useState(60);
  const [traveiAcao, setTraveiAcao] = useState("");

  useEffect(() => {
    setMounted(true);
    setCurrentDate(format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR }));
    setFrase(fraseDodia());

    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { router.push("/login"); return; }

        // Profile
        const { data: profileData } = await supabase
          .from("profiles").select("*").eq("id", user.id).single();
        const pData = profileData || { full_name: "Você", id: user.id };
        setProfile(pData);

        const today = new Date().toISOString().split("T")[0];

        // Carregar ou Gerar Insight da IA
        if (pData.last_insight_date === today && pData.daily_insight) {
          setInsight(pData.daily_insight);
        } else if (pData.occupation) {
          setLoadingInsight(true);
          try {
            const res = await fetch('/api/insights', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(pData)
            });
            const d = await res.json();
            if (d.insight) {
              setInsight(d.insight);
              // Tenta salvar no Supabase de forma otimista (se a coluna existir)
              supabase.from('profiles').update({
                daily_insight: d.insight,
                last_insight_date: today
              }).eq('id', user.id).then();
            }
          } catch (e) {
            console.error("Erro ao gerar insight:", e);
          } finally {
            setLoadingInsight(false);
          }
        }

        // Calcular dia atual do 365
        const { data: presencas } = await supabase
          .from("presenca_diaria")
          .select("dia_numero")
          .eq("user_id", user.id)
          .eq("completado", true)
          .order("dia_numero", { ascending: false })
          .limit(1);

        const ultimoDia = presencas?.[0]?.dia_numero || 0;
        const proximoDia = Math.min(ultimoDia + 1, 365);
        setDiaAtual(proximoDia);

        // Verificar se já marcou presença hoje
        const { data: presencaHojeData } = await supabase
          .from("presenca_diaria")
          .select("id")
          .eq("user_id", user.id)
          .eq("dia_numero", proximoDia)
          .eq("completado", true)
          .maybeSingle();
        setPresencaHoje(!!presencaHojeData);

        // Carregar tarefas de hoje
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

        // Constância da semana
        const now = new Date();
        const dayOfWeek = now.getDay(); // 0=dom
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - dayOfWeek);
        startOfWeek.setHours(0, 0, 0, 0);

        const { data: constanciaData } = await supabase
          .from("constancia")
          .select("data")
          .eq("user_id", user.id)
          .gte("data", startOfWeek.toISOString().split("T")[0])
          .lte("data", now.toISOString().split("T")[0]);

        const diasSet = new Set(constanciaData?.map((c: any) => c.data) || []);
        const semana: boolean[] = [];
        for (let i = 0; i <= 6; i++) {
          const d = new Date(startOfWeek);
          d.setDate(startOfWeek.getDate() + i);
          const dStr = d.toISOString().split("T")[0];
          semana.push(diasSet.has(dStr));
        }
        setDiasSemana(semana);
        setDiasPresente(semana.filter(Boolean).length);

        // Registrar que apareceu hoje
        await supabase.from("constancia").upsert(
          { user_id: user.id, data: today, apareceu: true },
          { onConflict: "user_id,data" }
        );
      } catch (err) {
        console.error("Erro ao carregar dados:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  // Timer do Travei
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (traveiStep === "timer" && traveiTimer > 0) {
      timer = setInterval(() => {
        setTraveiTimer((prev) => {
          if (prev <= 1) { setTraveiStep("feito"); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [traveiStep, traveiTimer]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = profile?.full_name?.split(" ")[0] || "Você";
    if (hour < 12) return `Bom dia, ${name}`;
    if (hour < 18) return `Boa tarde, ${name}`;
    return `Boa noite, ${name}`;
  };

  const saveTarefa = async (tipo: "essencial" | "leve" | "opcional", titulo: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !titulo.trim()) return;

    const prioridade = tipo === "essencial" ? "essencial" : tipo === "leve" ? "importante" : "opcional";
    const tarefa = tarefas[tipo];

    if (tarefa.id) {
      await supabase.from("tasks").update({ title: titulo.trim() }).eq("id", tarefa.id);
      setTarefas((prev) => ({ ...prev, [tipo]: { ...prev[tipo], titulo: titulo.trim() } }));
    } else {
      const { data } = await supabase.from("tasks")
        .insert({ user_id: user.id, title: titulo.trim(), priority_level: prioridade })
        .select("id")
        .single();
      if (data) setTarefas((prev) => ({ ...prev, [tipo]: { id: data.id, titulo: titulo.trim(), feito: false } }));
    }
  };

  const marcarFeito = async (tipo: "essencial" | "leve" | "opcional") => {
    const tarefa = tarefas[tipo];
    if (!tarefa.id) return;
    const novoStatus = !tarefa.feito;
    await supabase.from("tasks").update({ completed: novoStatus }).eq("id", tarefa.id);
    setTarefas((prev) => ({ ...prev, [tipo]: { ...prev[tipo], feito: novoStatus } }));
  };

  const abrirTravei = () => {
    setTraveiAberto(true);
    setTraveiStep("opcoes");
    setTraveiTimer(60);
    setTraveiAcao("");
  };

  const handleTraveiFeito = async () => {
    if (traveiStep === "minima" && traveiAcao.trim()) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const newTitle = `Micro-ação: ${traveiAcao.trim()}`;
          const { data } = await supabase.from("tasks").insert({
            user_id: user.id,
            title: newTitle,
            priority_level: "opcional",
            completed: true
          }).select("id").single();

          if (data) {
            setTarefas(prev => ({
              ...prev,
              opcional: { id: data.id, titulo: newTitle, feito: true }
            }));
          }
        }
      } catch (err) {
        console.error(err);
      }
    }
    setTraveiStep("feito");
    setFrase("Um passo minúsculo ainda é um passo para frente. Orgulho de você! 🌿");
  };

  const limparTarefas = async () => {
    if (!confirm("Isso vai apagar suas tarefas de hoje para você poder recomeçar sem peso. Tem certeza?")) return;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      await supabase.from("tasks")
        .delete()
        .eq("user_id", user.id)
        .gte("created_at", today + "T00:00:00")
        .lte("created_at", today + "T23:59:59");

      setTarefas({
        essencial: { titulo: "", feito: false },
        leve: { titulo: "", feito: false },
        opcional: { titulo: "", feito: false },
      });

      setFrase("Você não falhou, você pausou. É seguro recomeçar. 🌿");
    } catch (err) {
      console.error(err);
    }
  };

  const diaData = PRESENCA_365.find((d) => d.dia === diaAtual);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#F5F5F0]">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="h-12 w-12 rounded-full bg-[#84A59D]/20 flex items-center justify-center">
          <div className="h-6 w-6 rounded-full bg-[#84A59D]/40" />
        </div>
      </motion.div>
    </div>
  );

  if (!mounted) return <div className="min-h-screen bg-[#F5F5F0]" />;

  return (
    <>
      <div className="px-6 py-8 md:px-12 lg:max-w-5xl mx-auto pb-32">

        {/* ── SAUDAÇÃO ── */}
        <header className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1F2937]">{getGreeting()}</h1>
          <p className="text-sm text-[#9CA3AF] mt-1 capitalize">{currentDate}</p>
        </header>

        {/* ── BENTO GRID COMMAND CENTER ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

          {/* ── MÓDULO CÉREBRO (IA INSIGHT) ── */}
          <section className="md:col-span-12 bg-gradient-to-br from-[#1F2937] to-[#111827] rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <BrainCircuit className="w-32 h-32 text-white" />
            </div>
            <div className="relative z-10 flex flex-col md:flex-row gap-6 md:items-center justify-between">
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2 text-[#84A59D]">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Seu Cérebro Hoje</span>
                </div>
                {loadingInsight ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="h-5 w-5 animate-spin text-[#84A59D]" />
                    <p className="text-sm text-[#D1D5DB] animate-pulse">Sincronizando biometria neural com sua profissão...</p>
                  </div>
                ) : insight ? (
                  <h2 className="text-lg md:text-xl font-medium text-white leading-relaxed max-w-3xl">
                    "{insight}"
                  </h2>
                ) : (
                  <h2 className="text-lg md:text-xl font-medium text-white leading-relaxed max-w-3xl">
                    "{frase}"
                  </h2>
                )}
                {profile?.occupation && !loadingInsight && insight && (
                  <p className="text-xs text-[#9CA3AF] font-semibold mt-2 border border-[#84A59D]/30 inline-block px-3 py-1 rounded-full bg-[#84A59D]/10">
                    Know-how gerado para: {profile.occupation}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* ── 365 DIAS DE PRESENÇA ── */}
          <Link href="/dashboard/presenca-365" className="md:col-span-8">
            <motion.section
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm cursor-pointer h-full flex flex-col justify-center relative overflow-hidden"
            >
              <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none translate-x-1/4 translate-y-1/4">
                <Wind className="w-48 h-48" />
              </div>
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-5">
                  <div className="h-14 w-14 bg-[#84A59D]/10 rounded-2xl flex items-center justify-center shrink-0">
                    <BookOpen className="h-7 w-7 text-[#84A59D]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-1">
                      Dia {diaAtual} de 365
                    </p>
                    <h3 className="text-lg md:text-xl font-bold text-[#1F2937]">
                      {presencaHoje ? "✅ Presente hoje!" : "Sua presença de hoje te espera"}
                    </h3>
                  </div>
                </div>
                <ChevronRight className="h-6 w-6 text-[#D1D5DB]" />
              </div>
            </motion.section>
          </Link>

          {/* ── CONSTÂNCIA DA SEMANA ── */}
          <section className="md:col-span-4 bg-white rounded-3xl p-6 border border-[#E5E7EB] shadow-sm flex flex-col justify-center">
            <h2 className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-wider mb-4 text-center">Constância Semanal</h2>
            <div className="flex items-center justify-center gap-2 mb-3">
              {["D", "S", "T", "Q", "Q", "S", "S"].map((dia, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5">
                  <span className="text-[9px] font-bold text-[#9CA3AF]">{dia}</span>
                  <div
                    className={`h-6 w-6 md:h-7 md:w-7 rounded-full flex items-center justify-center transition-all ${diasSemana[i]
                        ? "bg-[#84A59D] shadow-sm"
                        : i <= new Date().getDay()
                          ? "bg-[#F1F5F9]"
                          : "bg-[#F9FAFB] border border-dashed border-[#E5E7EB]"
                      }`}
                  >
                    {diasSemana[i] && <Check className="h-3 w-3 text-white" strokeWidth={3} />}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#64748B] text-center font-medium mt-2">
              <span className="font-bold text-[#1F2937]">{diasPresente}</span> {diasPresente === 1 ? "dia" : "dias"} na semana 🌿
            </p>
          </section>

          {/* ── PLANNER: 3 TAREFAS DO DIA ── */}
          <section className="md:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-[#E5E7EB] shadow-sm space-y-6 relative overflow-hidden">
             <div className="absolute right-0 top-0 opacity-5 pointer-events-none -translate-y-1/4 translate-x-1/4">
                <CheckSquare className="w-64 h-64" />
             </div>
             <div className="relative z-10">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-[#1F2937]/5 rounded-xl flex items-center justify-center">
                    <CheckSquare className="h-5 w-5 text-[#1F2937]" />
                  </div>
                  <div>
                    <h2 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider">Planner Diário</h2>
                    <p className="text-sm font-bold text-[#1F2937]">Minhas 3 tarefas de hoje</p>
                  </div>
                </div>
                <button
                  onClick={limparTarefas}
                  className="text-[10px] font-bold text-[#84A59D] hover:text-[#1F2937] transition-colors uppercase tracking-wider bg-[#84A59D]/10 hover:bg-[#84A59D]/20 px-3 py-1.5 rounded-lg"
                >
                  Recomeçar
                </button>
              </div>

              <div className="space-y-4">
                {(["essencial", "leve", "opcional"] as const).map((tipo) => {
                  const labels = { essencial: "Essencial", leve: "Leve", opcional: "Opcional" };
                  const colors = {
                    essencial: "bg-[#1F2937]",
                    leve: "bg-[#84A59D]",
                    opcional: "bg-[#D1D5DB]",
                  };
                  const tarefa = tarefas[tipo];

                  return (
                    <div key={tipo} className="flex items-center gap-4 bg-[#F8F9FA] p-3 rounded-2xl border border-transparent hover:border-[#E5E7EB] transition-colors">
                      <button
                        onClick={() => tarefa.id && marcarFeito(tipo)}
                        disabled={!tarefa.id}
                        className={`h-7 w-7 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${tarefa.feito
                            ? `${colors[tipo]} border-transparent`
                            : "border-[#D1D5DB] hover:border-[#84A59D] bg-white"
                          } ${!tarefa.id ? "opacity-30" : "cursor-pointer"}`}
                      >
                        {tarefa.feito && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
                      </button>

                      <div className="flex-1 min-w-0">
                        <label className="text-[9px] font-bold text-[#9CA3AF] uppercase tracking-wider block mb-0.5">
                          {labels[tipo]}
                        </label>
                        <input
                          type="text"
                          value={tarefa.titulo}
                          placeholder={`Tarefa ${labels[tipo].toLowerCase()}...`}
                          onChange={(e) =>
                            setTarefas((prev) => ({
                              ...prev,
                              [tipo]: { ...prev[tipo], titulo: e.target.value },
                            }))
                          }
                          onBlur={(e) => saveTarefa(tipo, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveTarefa(tipo, (e.target as HTMLInputElement).value);
                          }}
                          className={`w-full bg-transparent text-sm font-semibold text-[#1F2937] focus:outline-none placeholder:text-[#D1D5DB] ${tarefa.feito ? "line-through text-[#9CA3AF]" : ""
                            }`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ── ATALHOS: SOS, DIÁRIO, PERFIL ── */}
          <section className="md:col-span-4 grid grid-cols-2 gap-4">
             <Link href="/dashboard/sos" className="bg-[#1F2937] hover:bg-black rounded-3xl p-5 shadow-sm flex flex-col justify-center items-center gap-3 transition-colors group">
                <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Snowflake className="h-6 w-6 text-white" />
                </div>
                <span className="text-xs font-bold text-white uppercase tracking-wider">SOS Travei</span>
             </Link>
             
             <Link href="/dashboard/journal" className="bg-white hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded-3xl p-5 shadow-sm flex flex-col justify-center items-center gap-3 transition-colors group">
                <div className="h-12 w-12 bg-[#84A59D]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <BookMarked className="h-6 w-6 text-[#84A59D]" />
                </div>
                <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Diário</span>
             </Link>
             
             <Link href="/dashboard/presenca" className="bg-white hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded-3xl p-5 shadow-sm flex flex-col justify-center items-center gap-3 transition-colors group">
                <div className="h-12 w-12 bg-[#84A59D]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Wind className="h-6 w-6 text-[#84A59D]" />
                </div>
                <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider text-center">Momento<br/>Presença</span>
             </Link>
             
             <Link href="/dashboard/profile" className="bg-white hover:bg-[#F8F9FA] border border-[#E5E7EB] rounded-3xl p-5 shadow-sm flex flex-col justify-center items-center gap-3 transition-colors group">
                <div className="h-12 w-12 bg-[#84A59D]/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <User className="h-6 w-6 text-[#84A59D]" />
                </div>
                <span className="text-xs font-bold text-[#1F2937] uppercase tracking-wider">Meu Perfil</span>
             </Link>
          </section>

        </div>
      </div>

      {/* ── BOTÃO TRAVEI (FLUTUANTE) ── */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={abrirTravei}
        className="fixed bottom-24 md:bottom-8 right-6 md:right-8 bg-[#1F2937] text-white px-6 py-4 rounded-2xl shadow-lg shadow-black/10 flex items-center gap-3 z-40 group"
      >
        <Snowflake className="h-5 w-5 group-hover:rotate-45 transition-transform" />
        <span className="font-bold text-sm">Travei</span>
      </motion.button>

      {/* ── MODAL TRAVEI ── */}
      <AnimatePresence>
        {traveiAberto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/30 backdrop-blur-sm p-4"
            onClick={() => setTraveiAberto(false)}
          >
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              {/* OPÇÕES */}
              {traveiStep === "opcoes" && (
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="h-14 w-14 bg-[#F1F5F9] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Snowflake className="h-7 w-7 text-[#64748B]" />
                    </div>
                    <h2 className="text-lg font-bold text-[#1F2937]">
                      Você não está travada.
                    </h2>
                    <p className="text-sm text-[#64748B] mt-1">
                      Seu cérebro está sobrecarregado. Escolha uma saída:
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => { setTraveiTimer(60); setTraveiStep("timer"); }}
                      className="w-full bg-[#F8F9FA] hover:bg-[#F1F5F9] p-5 rounded-2xl text-left transition-all group"
                    >
                      <p className="font-bold text-[#1F2937] flex items-center gap-2">
                        ⏱️ Começar com 1 minuto
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        Só 60 segundos. Depois você decide.
                      </p>
                    </button>

                    <button
                      onClick={() => setTraveiStep("respirar")}
                      className="w-full bg-[#F8F9FA] hover:bg-[#F1F5F9] p-5 rounded-2xl text-left transition-all"
                    >
                      <p className="font-bold text-[#1F2937] flex items-center gap-2">
                        🌬️ Levantar e respirar
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        Saia da cadeira. 3 respirações. Volte.
                      </p>
                    </button>

                    <button
                      onClick={() => setTraveiStep("minima")}
                      className="w-full bg-[#F8F9FA] hover:bg-[#F1F5F9] p-5 rounded-2xl text-left transition-all"
                    >
                      <p className="font-bold text-[#1F2937] flex items-center gap-2">
                        ✅ Versão mínima
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-1">
                        Qual a menor parte da tarefa que você pode fazer agora?
                      </p>
                    </button>
                  </div>
                </div>
              )}

              {/* TIMER 1 MIN */}
              {traveiStep === "timer" && (
                <div className="text-center space-y-6">
                  <p className="text-sm text-[#9CA3AF] font-medium">Só 1 minuto. Você consegue.</p>
                  <div className="text-7xl font-bold text-[#1F2937] font-mono tabular-nums">
                    0:{traveiTimer.toString().padStart(2, "0")}
                  </div>
                  <div className="h-2 bg-[#F1F5F9] rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-[#84A59D] rounded-full"
                      initial={{ width: "100%" }}
                      animate={{ width: `${(traveiTimer / 60) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <button
                    onClick={handleTraveiFeito}
                    className="text-sm font-medium text-[#84A59D] underline"
                  >
                    Consegui antes do tempo!
                  </button>
                </div>
              )}

              {/* RESPIRAR */}
              {traveiStep === "respirar" && (
                <div className="text-center space-y-8 py-4">
                  <p className="text-sm text-[#9CA3AF]">Siga o ritmo do círculo</p>
                  <motion.div
                    animate={{ scale: [1, 1.6, 1] }}
                    transition={{ duration: 6, repeat: 2, ease: "easeInOut" }}
                    onAnimationComplete={handleTraveiFeito}
                    className="w-28 h-28 rounded-full bg-[#84A59D]/15 border-2 border-[#84A59D]/30 mx-auto"
                  />
                  <p className="text-sm text-[#64748B] italic animate-pulse">
                    Inspire... segure... expire...
                  </p>
                  <button
                    onClick={handleTraveiFeito}
                    className="text-xs text-[#9CA3AF] underline"
                  >
                    Pular
                  </button>
                </div>
              )}

              {/* VERSÃO MÍNIMA */}
              {traveiStep === "minima" && (
                <div className="space-y-5">
                  <div className="text-center">
                    <h3 className="font-bold text-[#1F2937]">Qual a menor versão dessa tarefa?</h3>
                    <p className="text-xs text-[#9CA3AF] mt-1">
                      Ex: "abrir o documento", "ler 1 parágrafo", "pegar o material"
                    </p>
                  </div>
                  <input
                    type="text"
                    value={traveiAcao}
                    onChange={(e) => setTraveiAcao(e.target.value)}
                    placeholder="Minha micro-ação é..."
                    className="w-full bg-[#F8F9FA] border border-[#E5E7EB] p-4 rounded-2xl text-sm font-medium text-[#1F2937] focus:outline-none focus:border-[#84A59D]"
                    autoFocus
                  />
                  <button
                    onClick={handleTraveiFeito}
                    disabled={!traveiAcao.trim()}
                    className="w-full bg-[#1F2937] text-white py-4 rounded-2xl font-bold text-sm disabled:opacity-40 transition-all"
                  >
                    Fiz ✓
                  </button>
                </div>
              )}

              {/* FEITO */}
              {traveiStep === "feito" && (
                <div className="text-center space-y-5 py-4">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 200 }}
                    className="h-16 w-16 bg-[#84A59D]/10 rounded-full flex items-center justify-center mx-auto"
                  >
                    <Check className="h-8 w-8 text-[#84A59D]" />
                  </motion.div>
                  <h3 className="text-lg font-bold text-[#1F2937]">Isso conta. 🌿</h3>
                  <p className="text-sm text-[#64748B]">
                    Você saiu da paralisia. Isso é coragem.
                  </p>
                  <button
                    onClick={() => setTraveiAberto(false)}
                    className="w-full bg-[#F8F9FA] text-[#1F2937] py-4 rounded-2xl font-bold text-sm hover:bg-[#F1F5F9] transition-all"
                  >
                    Voltar ao meu dia
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
