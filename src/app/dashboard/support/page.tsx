"use client";

import { motion } from "framer-motion";
import {
  Send, User, Loader2, Sparkles,
  ArrowLeft, Mail, BookOpen
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { AnimatedBrain } from "@/components/animated-brain";
import { supabase } from "@/lib/supabase";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

/** Converts **bold** and *italic* markdown into JSX inline elements */
function renderMarkdown(text: string) {
  // Split on **bold** and *italic* patterns
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="font-black text-[#1F2937]">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*")) {
      return <em key={i}>{part.slice(1, -1)}</em>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function SupportPage() {
  const [profile, setProfile] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Olá! Sou seu guia de neuroplasticidade. Como posso te ajudar a sair da paralisia hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function getUserProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (data) {
          setProfile(data);
          const firstName = data.full_name?.split(' ')[0] || "viajante";
          setMessages([{ role: 'assistant', content: `Olá, ${firstName}! Sou seu guia de neuroplasticidade. Como posso te ajudar com o foco hoje?` }]);
        }
      }
    }
    getUserProfile();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: userMessage, 
          history: messages,
          profile: profile // Pass the full profile for deep context
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        throw new Error();
      }
    } catch {
      toast.error("Erro ao processar resposta.");
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    setEscalating(true);
    try {
      const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
      const res = await fetch('/api/support', {
        method: 'POST',
        body: JSON.stringify({
          message: lastUserMsg?.content ?? "",
          context: "Dúvida do usuário que a IA não soube responder."
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        toast.success("E-mail enviado para nossa equipe!");
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: "Pronto! Encaminhei sua dúvida para os humanos. Você receberá um retorno no seu e-mail de cadastro."
        }]);
      } else throw new Error();
    } catch {
      toast.error("Erro ao enviar e-mail. Tente novamente mais tarde.");
    } finally {
      setEscalating(false);
    }
  };

  const quickQuestions = [
    { label: "Método 1-2-3", q: "Como funciona o Método 1-2-3?" },
    { label: "Sistema de Pontos", q: "Como funciona o sistema de pontos?" },
    { label: "Zona de Fluxo", q: "O que é a Zona de Fluxo?" },
  ];

  return (
    <div className="flex-1 w-full flex flex-col h-screen relative bg-[#F5F5F0]">

      {/* ── Header ── */}
      <header className="h-20 border-b border-[#E5E7EB] flex items-center justify-between px-6 md:px-12 bg-white/70 backdrop-blur-md z-30 shrink-0">
        <div className="flex items-center gap-4">
          {/* Animated brain avatar */}
          <div className="relative h-12 w-12 bg-[#1F2937] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10">
            <AnimatedBrain size={30} state={loading ? "thinking" : "idle"} />
            {loading && (
              <motion.div
                className="absolute inset-0 rounded-2xl ring-2 ring-[#84A59D]/40"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h1 className="text-base md:text-xl font-black tracking-tight text-[#1F2937] uppercase">
              Assistente TC
            </h1>
            <p className="text-[10px] font-black uppercase tracking-widest leading-none mt-0.5 text-[#84A59D]">
              {loading ? "Processando sinapses..." : "Segundo Cérebro · Online"}
            </p>
          </div>
        </div>

        <Link
          href="/dashboard"
          className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest hover:text-[#1F2937] flex items-center gap-2"
        >
          <ArrowLeft className="h-3 w-3" /> Voltar
        </Link>
      </header>

      {/* ── Chat messages ── */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full px-4 md:px-10 pt-6">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 pb-6"
          style={{ scrollbarWidth: "none" }}
        >
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[85%] md:max-w-[78%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* Avatar */}
                {msg.role === 'user' ? (
                  <div className="h-10 w-10 rounded-full bg-[#84A59D] flex items-center justify-center text-white shrink-0">
                    <User className="h-5 w-5" />
                  </div>
                ) : (
                  <div className="h-11 w-11 bg-[#1F2937] rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-black/10">
                    <AnimatedBrain size={26} state="idle" />
                  </div>
                )}

                {/* Bubble */}
                <div className={`px-5 py-4 rounded-[24px] text-sm leading-relaxed shadow-sm ${
                  msg.role === 'user'
                    ? 'bg-[#1F2937] text-white rounded-tr-sm font-medium'
                    : 'bg-white text-[#374151] border border-[#E5E7EB] rounded-tl-sm'
                }`}>
                  {msg.role === 'assistant' && (
                    <p className="text-[9px] font-black text-[#84A59D] uppercase tracking-[0.2em] mb-2">
                      TC Assistant
                    </p>
                  )}

                  {/* ── Rendered message with markdown ── */}
                  <p className="font-medium leading-relaxed">
                    {renderMarkdown(msg.content)}
                  </p>

                  {msg.content.includes("encaminhar") && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB]/40">
                      <button
                        onClick={handleEscalate}
                        disabled={escalating}
                        className="flex items-center gap-2 px-4 py-2 bg-[#84A59D]/10 text-[#84A59D] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#84A59D]/20 transition-all"
                      >
                        {escalating
                          ? <Loader2 className="h-3 w-3 animate-spin" />
                          : <Mail className="h-3 w-3" />}
                        Enviar para Equipe
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* ── Thinking indicator ── */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex gap-3">
                <div className="h-11 w-11 bg-[#1F2937] rounded-2xl flex items-center justify-center shrink-0 shadow-md shadow-black/10">
                  <AnimatedBrain size={26} state="thinking" />
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-[24px] rounded-tl-sm px-6 py-4 flex items-center gap-2 shadow-sm">
                  {[0, 0.18, 0.36].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-[#84A59D]"
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.7, delay, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Quick questions ── */}
        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          {quickQuestions.map(({ label, q }) => (
            <button
              key={label}
              onClick={() => {
                setInput(q);
                setTimeout(() => handleSend(), 50);
              }}
              className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:border-[#84A59D] hover:text-[#84A59D] transition-all"
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Input ── */}
        <div className="bg-white px-4 py-3 rounded-[2rem] border border-[#E5E7EB] shadow-2xl shadow-black/5 flex items-center gap-3 focus-within:border-[#1F2937] transition-all mb-4">
          <div className="shrink-0 opacity-60">
            <AnimatedBrain size={26} state={loading ? "thinking" : "idle"} />
          </div>
          <input
            type="text"
            placeholder="Digite sua dúvida aqui..."
            className="flex-1 bg-transparent border-none text-sm font-semibold text-[#1F2937] placeholder:text-[#9CA3AF] focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-11 w-11 bg-[#1F2937] text-white rounded-[1.25rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10 disabled:opacity-40 disabled:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {/* Footer badges */}
        <div className="mb-6 flex justify-center items-center gap-6 text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">Base de Conhecimento</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            <span className="text-[9px] font-black uppercase tracking-[0.15em]">IA de Neuroplasticidade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
