"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Send, User, Loader2, Sparkles,
  ArrowLeft, Mail, BookOpen, Plus,
  MessageSquare, Trash2, Clock, CheckCircle2,
  Calendar, Zap, Bell
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { AnimatedBrain } from "@/components/animated-brain";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  created_at: string;
}

export default function SupportPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingSessions, setLoadingSessions] = useState(true);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load User and Sessions
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prof } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(prof);

      // Cleanup old sessions (older than 15 days)
      const fifteenDaysAgo = new Date();
      fifteenDaysAgo.setDate(fifteenDaysAgo.getDate() - 15);
      
      await supabase
        .from('chat_sessions')
        .delete()
        .eq('user_id', user.id)
        .lt('created_at', fifteenDaysAgo.toISOString());

      const { data: sess } = await supabase
        .from('chat_sessions')
        .select('*')
        .order('created_at', { ascending: false });
      
      setSessions(sess || []);
      if (sess && sess.length > 0) {
        handleSelectSession(sess[0].id);
      } else {
        createNewSession();
      }
      setLoadingSessions(false);
    }
    init();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const createNewSession = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('chat_sessions')
      .insert({ user_id: user.id, title: "Nova Conversa" })
      .select()
      .single();

    if (data) {
      setSessions([data, ...sessions]);
      setActiveSession(data.id);
      setMessages([{ role: 'assistant', content: "Olá! Como posso te ajudar com seu foco hoje?" }]);
    }
  };

  const handleSelectSession = async (sessionId: string) => {
    setActiveSession(sessionId);
    const { data } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (data && data.length > 0) {
      setMessages(data.map(m => ({ role: m.role, content: m.content })));
    } else {
      setMessages([{ role: 'assistant', content: "Olá! Como posso te ajudar hoje?" }]);
    }
  };

  const deleteSession = async (id: string) => {
    await supabase.from('chat_sessions').delete().eq('id', id);
    const updated = sessions.filter(s => s.id !== id);
    setSessions(updated);
    if (activeSession === id) {
      if (updated.length > 0) handleSelectSession(updated[0].id);
      else createNewSession();
    }
    toast.success("Conversa excluída.");
  };

  const handleSend = async () => {
    if (!input.trim() || loading || !activeSession) return;

    const userMessage = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Save user message to DB
    await supabase.from('chat_messages').insert({
      session_id: activeSession,
      role: 'user',
      content: userMessage
    });

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: userMessage, 
          history: messages,
          profile: profile
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        
        // Save assistant message to DB
        await supabase.from('chat_messages').insert({
          session_id: activeSession,
          role: 'assistant',
          content: data.response
        });

        // Update session title if it's the first message
        if (messages.length <= 1) {
          const newTitle = userMessage.slice(0, 20) + (userMessage.length > 20 ? '...' : '');
          await supabase.from('chat_sessions').update({ title: newTitle }).eq('id', activeSession);
          setSessions(prev => prev.map(s => s.id === activeSession ? { ...s, title: newTitle } : s));
        }
      }
    } catch {
      toast.error("Erro ao processar resposta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F5F0] overflow-hidden">
      
      {/* ── Sidebar: Chat History ── */}
      <aside className="w-80 bg-white border-r border-[#E5E7EB] flex flex-col shrink-0 hidden lg:flex">
        <div className="p-6 border-b border-[#F1F3F5] flex items-center justify-between">
          <h2 className="text-xs font-black uppercase tracking-[0.2em] text-[#1F2937]">Conversas</h2>
          <button 
            onClick={createNewSession}
            className="h-8 w-8 bg-[#1F2937] text-white rounded-lg flex items-center justify-center hover:bg-black transition-all"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingSessions ? (
            <div className="flex justify-center pt-10"><Loader2 className="h-5 w-5 animate-spin text-[#84A59D]" /></div>
          ) : sessions.map((s) => (
            <div 
              key={s.id}
              className={`group flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all ${
                activeSession === s.id ? 'bg-[#F8F9FA] border border-[#E5E7EB]' : 'hover:bg-[#F8F9FA]/50'
              }`}
              onClick={() => handleSelectSession(s.id)}
            >
              <MessageSquare className={`h-4 w-4 ${activeSession === s.id ? 'text-[#84A59D]' : 'text-[#9CA3AF]'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-bold truncate ${activeSession === s.id ? 'text-[#1F2937]' : 'text-[#64748B]'}`}>
                  {s.title}
                </p>
                <p className="text-[9px] text-[#9CA3AF] mt-0.5 uppercase tracking-tighter">
                  {format(new Date(s.created_at), "dd MMM", { locale: ptBR })}
                </p>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); deleteSession(s.id); }}
                className="opacity-0 group-hover:opacity-100 h-6 w-6 text-[#9CA3AF] hover:text-red-500 transition-all"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-[#F8F9FA] border-t border-[#E5E7EB]">
          <div className="flex items-center gap-2 text-[9px] font-black uppercase text-[#9CA3AF] tracking-widest">
            <Clock className="h-3 w-3" /> Auto-limpeza: 15 dias
          </div>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <main className="flex-1 flex flex-col relative bg-[#F5F5F0]">
        
        {/* Header */}
        <header className="h-20 bg-white/70 backdrop-blur-md border-b border-[#E5E7EB] flex items-center justify-between px-8 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-11 w-11 bg-[#1F2937] rounded-2xl flex items-center justify-center shadow-lg">
              <AnimatedBrain size={28} state={loading ? "thinking" : "idle"} />
            </div>
            <div>
              <h1 className="text-base font-black text-[#1F2937] tracking-tight uppercase">TC Assistant</h1>
              <p className="text-[10px] font-bold text-[#84A59D] uppercase tracking-widest">Sincronizado</p>
            </div>
          </div>

          <Link href="/dashboard" className="text-[10px] font-black text-[#9CA3AF] hover:text-[#1F2937] uppercase tracking-widest flex items-center gap-2">
            <ArrowLeft className="h-3 w-3" /> Sair
          </Link>
        </header>

        {/* Messages */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-6 md:px-12 py-8 space-y-6"
          style={{ scrollbarWidth: 'none' }}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${
                    msg.role === 'user' ? 'bg-[#84A59D] text-white' : 'bg-[#1F2937] text-white'
                  }`}>
                    {msg.role === 'user' ? <User className="h-5 w-5" /> : <AnimatedBrain size={22} state="idle" />}
                  </div>
                  <div className={`px-5 py-4 rounded-[1.5rem] text-sm md:text-base leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-[#1F2937] text-white rounded-tr-none' 
                      : 'bg-white text-[#374151] border border-[#E5E7EB] rounded-tl-none shadow-sm'
                  }`}>
                    {msg.content}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <div className="flex justify-start">
               <div className="flex gap-3">
                 <div className="h-10 w-10 bg-[#1F2937] rounded-xl flex items-center justify-center shadow-lg">
                    <AnimatedBrain size={22} state="thinking" />
                 </div>
                 <div className="bg-white border border-[#E5E7EB] rounded-[1.5rem] rounded-tl-none px-6 py-4 flex gap-1 items-center">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="h-1.5 w-1.5 rounded-full bg-[#84A59D]" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: i*0.2 }} />
                    ))}
                 </div>
               </div>
            </div>
          )}
        </div>

        {/* Input & Smart Actions */}
        <div className="p-6 md:p-10 bg-[#F5F5F0] shrink-0">
          <div className="max-w-4xl mx-auto">
            
            {/* Quick Suggestions / Actions */}
            <div className="mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button onClick={() => setInput("Criar uma tarefa...")} className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:border-[#84A59D] hover:text-[#84A59D] transition-all whitespace-nowrap flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" /> Criar Tarefa
              </button>
              <button onClick={() => setInput("Como está meu Power Score?")} className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:border-[#84A59D] hover:text-[#84A59D] transition-all whitespace-nowrap flex items-center gap-2">
                <Zap className="h-3 w-3" /> Ver Progresso
              </button>
              <button onClick={() => setInput("Pausa sensorial de 2 min")} className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:border-[#84A59D] hover:text-[#84A59D] transition-all whitespace-nowrap flex items-center gap-2">
                <Bell className="h-3 w-3" /> Pausa SOS
              </button>
            </div>

            <div className="bg-white rounded-[2rem] border-2 border-[#E5E7EB] p-2 flex items-center gap-3 focus-within:border-[#1F2937] transition-all shadow-xl shadow-black/5">
              <input 
                type="text"
                placeholder="Fale com seu Segundo Cérebro..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-sm font-bold text-[#1F2937]"
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="h-14 w-14 bg-[#1F2937] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20"
              >
                <Send className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
