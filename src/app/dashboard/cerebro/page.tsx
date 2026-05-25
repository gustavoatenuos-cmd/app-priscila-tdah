"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { AnimatedBrain } from "@/components/animated-brain";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGESTOES = [
  "Estou travado e não sei por onde começar",
  "Preciso de ajuda para focar agora",
  "Minha cabeça está uma bagunça hoje",
  "Quero entender por que procrastino tanto",
];

export default function CerebroPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, occupation, interaction_tone")
          .eq("id", user.id)
          .single();
        setProfile(data);

        const nome = data?.full_name?.split(" ")[0] || "você";
        setMessages([
          {
            role: "assistant",
            content: `Olá, ${nome}! Sou seu TC Assistant. Estou aqui para te ajudar a organizar os pensamentos, quebrar tarefas grandes e navegar pelos momentos difíceis. O que está passando pela sua cabeça agora?`,
          },
        ]);
      }
    }
    loadProfile();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async (texto?: string) => {
    const msg = (texto ?? input).trim();
    if (!msg || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: msg,
          history: messages,
          profile,
        }),
      });

      const data = await res.json();

      if (data.response) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ]);
      }
    } catch {
      toast.error("Erro na conexão. Tente novamente.");
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#F5F5F0]">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#E5E7EB] bg-white flex items-center gap-4 shrink-0">
        <Link
          href="/dashboard"
          className="h-9 w-9 rounded-full border border-[#E5E7EB] flex items-center justify-center text-[#64748B] hover:text-[#1F2937] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div className="h-10 w-10 bg-[#1F2937] rounded-2xl flex items-center justify-center shadow-md">
          <AnimatedBrain size={24} state={loading ? "thinking" : "idle"} />
        </div>
        <div>
          <h1 className="text-sm font-black text-[#1F2937] uppercase tracking-tight">TC Assistant</h1>
          <p className="text-[10px] text-[#84A59D] font-bold uppercase tracking-widest">
            {loading ? "Pensando..." : "Seu companheiro diário"}
          </p>
        </div>
      </header>

      {/* Chat Area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-4"
        style={{ scrollbarWidth: "none" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "assistant" && (
                <div className="h-7 w-7 bg-[#1F2937] rounded-xl flex items-center justify-center mr-2 mt-1 shrink-0">
                  <Sparkles className="h-3.5 w-3.5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] md:max-w-[65%] px-5 py-3.5 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-[#1F2937] text-white rounded-tr-sm font-medium"
                    : "bg-white text-[#374151] rounded-tl-sm border border-[#E5E7EB] shadow-sm"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="h-7 w-7 bg-[#1F2937] rounded-xl flex items-center justify-center mr-2 mt-1 shrink-0">
              <Sparkles className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="bg-white border border-[#E5E7EB] px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-[#84A59D]"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
                  transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Sugestões iniciais */}
        {messages.length === 1 && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-2"
          >
            <p className="text-[10px] font-bold text-[#9CA3AF] uppercase tracking-widest mb-3 ml-9">
              Sugestões para começar
            </p>
            <div className="flex flex-col gap-2 ml-9">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  className="text-left text-sm text-[#64748B] bg-white border border-[#E5E7EB] px-4 py-2.5 rounded-xl hover:border-[#84A59D] hover:text-[#1F2937] transition-all font-medium"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Input */}
      <div className="px-4 md:px-8 pb-6 pt-3 bg-[#F5F5F0] shrink-0">
        <div className="bg-white rounded-2xl border-2 border-[#E5E7EB] p-1.5 flex items-center gap-2 focus-within:border-[#1F2937] transition-all max-w-3xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder="Como está sendo seu dia?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={loading}
            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-sm font-medium text-[#1F2937] placeholder:text-[#9CA3AF]"
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            className="h-10 w-10 bg-[#1F2937] text-white rounded-xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-30 disabled:scale-100"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
        <p className="text-center text-[10px] font-medium text-[#9CA3AF] mt-2">
          Conversa privada • não compartilhada
        </p>
      </div>
    </div>
  );
}
