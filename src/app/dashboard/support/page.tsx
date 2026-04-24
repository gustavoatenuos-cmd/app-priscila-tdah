"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, Bot, User, Loader2, Sparkles, 
  ArrowLeft, Mail, BookOpen
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { AnimatedBrain } from "@/components/animated-brain";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Olá! Sou seu guia de neuroplasticidade. Como posso te ajudar com a metodologia ou com o app hoje?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [escalating, setEscalating] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

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
          history: messages 
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erro ao processar resposta.");
    } finally {
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    setEscalating(true);
    try {
      const res = await fetch('/api/support', {
        method: 'POST',
        body: JSON.stringify({ 
          message: messages[messages.length - 2].content,
          context: "Dúvida do usuário que a IA não soube responder."
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        toast.success("E-mail enviado para nossa equipe! Responderemos em breve.");
        setMessages(prev => [...prev, { role: 'assistant', content: "Pronto! Encaminhei sua dúvida para os humanos. Você receberá um retorno no seu e-mail de cadastro." }]);
      } else {
        throw new Error();
      }
    } catch (err) {
      toast.error("Erro ao enviar e-mail. Tente novamente mais tarde.");
    } finally {
      setEscalating(false);
    }
  };

  return (
    <div className="flex-1 w-full flex flex-col h-screen relative bg-[#F5F5F0]">

      {/* ── Header ── */}
      <header className="h-20 border-b border-[#E5E7EB] flex items-center justify-between px-8 md:px-12 bg-white/70 backdrop-blur-md z-30">
        <div className="flex items-center gap-4">
          {/* Animated brain in a dark rounded square */}
          <div className="h-12 w-12 bg-[#1F2937] rounded-2xl flex items-center justify-center shadow-lg shadow-black/10 relative overflow-visible">
            <AnimatedBrain size={32} state={loading ? "thinking" : "idle"} />
            {/* Outer glow when thinking */}
            {loading && (
              <motion.div
                className="absolute inset-0 rounded-2xl bg-[#84A59D]/20"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              />
            )}
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-[#1F2937] uppercase">Assistente TC</h1>
            <p className="text-[10px] font-black text-[#84A59D] uppercase tracking-widest leading-none mt-0.5">
              {loading ? "Pensando..." : "Seu Segundo Cérebro · Online"}
            </p>
          </div>
        </div>
        
        <Link href="/dashboard" className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest hover:text-[#1F2937] flex items-center gap-2">
          <ArrowLeft className="h-3 w-3" /> Voltar
        </Link>
      </header>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full p-6 md:p-10">
        
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto space-y-6 pb-10 scrollbar-hide"
        >
          {messages.map((msg, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                {/* ── Avatar ── */}
                <div className={`shrink-0 flex items-center justify-center ${
                  msg.role === 'user' 
                    ? 'h-10 w-10 rounded-full bg-[#84A59D] text-white'
                    : 'h-12 w-12 bg-[#1F2937] rounded-2xl shadow-md shadow-black/10'
                }`}>
                  {msg.role === 'user' 
                    ? <User className="h-5 w-5" />
                    : <AnimatedBrain size={28} state="idle" />
                  }
                </div>

                {/* ── Bubble ── */}
                <div className={`p-5 rounded-[28px] text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#1F2937] text-white rounded-tr-none' 
                    : 'bg-white text-[#1F2937] border border-[#E5E7EB] rounded-tl-none'
                }`}>
                  {msg.role === 'assistant' && (
                    <p className="text-[9px] font-black text-[#84A59D] uppercase tracking-[0.2em] mb-2">
                      TC Assistant
                    </p>
                  )}
                  {msg.content}
                  
                  {msg.content.includes("encaminhar sua dúvida") && (
                    <div className="mt-4 pt-4 border-t border-[#E5E7EB]/30 flex gap-2">
                      <button 
                        onClick={handleEscalate}
                        disabled={escalating}
                        className="flex items-center gap-2 px-4 py-2 bg-[#84A59D]/10 text-[#84A59D] rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#84A59D]/20 transition-all"
                      >
                        {escalating ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3 w-3" />}
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
                <div className="h-12 w-12 bg-[#1F2937] rounded-2xl flex items-center justify-center shadow-md shadow-black/10">
                  <AnimatedBrain size={28} state="thinking" />
                </div>
                <div className="bg-white border border-[#E5E7EB] rounded-[28px] rounded-tl-none px-6 py-5 flex items-center gap-2 shadow-sm">
                  {[0, 0.2, 0.4].map((delay, i) => (
                    <motion.div
                      key={i}
                      className="h-2 w-2 rounded-full bg-[#84A59D]"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, delay, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* ── Quick questions ── */}
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {[
            { label: "Método 1-2-3", q: "Como funciona o 1-2-3?" },
            { label: "Sistema de Pontos", q: "Como ganho pontos?" },
            { label: "Zona de Fluxo", q: "O que é a Zona de Fluxo?" },
          ].map(({ label, q }) => (
            <button
              key={label}
              onClick={() => { setInput(q); setTimeout(handleSend, 0); }}
              className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:border-[#84A59D] hover:text-[#84A59D] transition-all"
            >
              {label}
            </button>
          ))}
        </div>

        {/* ── Input ── */}
        <div className="bg-white p-4 rounded-[32px] border border-[#E5E7EB] shadow-2xl flex items-center gap-4 focus-within:border-[#1F2937] transition-all">
          <div className="h-8 w-8 ml-1 opacity-60">
            <AnimatedBrain size={28} state={loading ? "thinking" : "idle"} />
          </div>
          <input 
            type="text"
            placeholder="Digite sua dúvida aqui..."
            className="flex-1 bg-transparent border-none text-sm font-bold text-[#1F2937] focus:outline-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <button 
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="h-12 w-12 bg-[#1F2937] text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10 disabled:opacity-40 disabled:scale-100"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 flex justify-center items-center gap-6 text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <BookOpen className="h-3 w-3" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Poder de llms.txt</span>
          </div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">IA de Neuroplasticidade</span>
          </div>
        </div>
      </div>
    </div>
  );
}
