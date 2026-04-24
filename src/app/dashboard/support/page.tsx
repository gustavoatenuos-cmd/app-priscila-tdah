"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  MessageSquare, Send, Bot, User, Loader2, Sparkles, 
  ArrowLeft, Mail, ChevronRight, HelpCircle, BookOpen, ExternalLink
} from "lucide-react";
import { Sidebar } from "@/components/sidebar";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import Link from "next/link";

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
      // Fetch the knowledge base
      const docsRes = await fetch('/llms.txt');
      const docsText = await docsRes.text();

      // Simple keyword-based logic (Simulating the agent from the template)
      // In a real scenario, this would call an LLM API with the context
      setTimeout(() => {
        let response = "Desculpe, ainda estou aprendendo sobre esse ponto específico. Deseja que eu encaminhe sua dúvida para nossa equipe via e-mail?";
        
        const lowerMsg = userMessage.toLowerCase();
        
        if (lowerMsg.includes("1-2-3") || lowerMsg.includes("planejamento")) {
          response = "A metodologia 1-2-3 consiste em escolher 1 tarefa Essencial, 2 Importantes e 3 Opcionais. Isso ajuda a reduzir a paralisia por análise e garante que você foque no que realmente importa.";
        } else if (lowerMsg.includes("pontos") || lowerMsg.includes("nível") || lowerMsg.includes("score")) {
          response = "Você ganha Pontos de Clareza ao planejar seu dia (+50 pts) e Power Score ao completar sessões de foco. A cada 500 pontos, você sobe de nível!";
        } else if (lowerMsg.includes("foco") || lowerMsg.includes("timer")) {
          response = "Nossa Zona de Fluxo inclui um Mindfulness de 2 minutos para silenciar o ruído mental e um 'Thought Sandbox' para você anotar distrações sem perder o foco.";
        } else if (lowerMsg.includes("plano b") || lowerMsg.includes("sos")) {
          response = "O Plano B é para dias difíceis. Ele reduz suas metas ao mínimo absoluto para evitar a culpa. Você pode ativá-lo no Dashboard.";
        }

        setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        setLoading(false);
      }, 1000);

    } catch (err) {
      toast.error("Erro ao processar resposta.");
      setLoading(false);
    }
  };

  const handleEscalate = async () => {
    setEscalating(true);
    try {
      // Call the escalation API
      const res = await fetch('/api/support', {
        method: 'POST',
        body: JSON.stringify({ 
          message: messages[messages.length - 2].content, // The user's last message
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
    <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans overflow-hidden">
      <Sidebar />

      <main className="flex-1 w-full flex flex-col h-screen relative">
        
        <header className="h-20 border-b border-[#E5E7EB] flex items-center justify-between px-8 md:px-12 bg-white/60 backdrop-blur-md z-30">
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-[#1F2937] rounded-xl flex items-center justify-center text-[#84A59D]">
               <Bot className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight text-[#1F2937] uppercase">IA de Suporte</h1>
              <p className="text-[10px] font-black text-[#84A59D] uppercase tracking-widest leading-none mt-1">Metodologia Constante</p>
            </div>
          </div>
          
          <Link href="/dashboard" className="text-[10px] font-black text-[#9CA3AF] uppercase tracking-widest hover:text-[#1F2937] flex items-center gap-2">
            <ArrowLeft className="h-3 w-3" /> Voltar
          </Link>
        </header>

        <div className="flex-1 overflow-hidden flex flex-col max-w-4xl mx-auto w-full p-6 md:p-10">
          
          {/* Chat Container */}
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
                <div className={`flex gap-4 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${msg.role === 'user' ? 'bg-[#84A59D] text-white' : 'bg-white border border-[#E5E7EB] text-[#1F2937]'}`}>
                      {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                   </div>
                   <div className={`p-5 rounded-[28px] text-sm font-medium leading-relaxed shadow-sm ${
                     msg.role === 'user' ? 'bg-[#1F2937] text-white rounded-tr-none' : 'bg-white text-[#1F2937] border border-[#E5E7EB] rounded-tl-none'
                   }`}>
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
            {loading && (
              <div className="flex justify-start">
                 <div className="flex gap-4">
                    <div className="h-10 w-10 rounded-full bg-white border border-[#E5E7EB] flex items-center justify-center">
                       <Loader2 className="h-5 w-5 animate-spin text-[#84A59D]" />
                    </div>
                 </div>
              </div>
            )}
          </div>

          {/* Quick Questions */}
          <div className="mb-6 flex flex-wrap gap-2 justify-center">
             <button onClick={() => { setInput("Como funciona o 1-2-3?"); handleSend(); }} className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:border-[#1F2937] hover:text-[#1F2937] transition-all">Método 1-2-3</button>
             <button onClick={() => { setInput("Como ganho pontos?"); handleSend(); }} className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:border-[#1F2937] hover:text-[#1F2937] transition-all">Sistema de Pontos</button>
             <button onClick={() => { setInput("O que é a Zona de Fluxo?"); handleSend(); }} className="px-4 py-2 bg-white border border-[#E5E7EB] rounded-full text-[10px] font-black text-[#64748B] uppercase tracking-widest hover:border-[#1F2937] hover:text-[#1F2937] transition-all">Zona de Fluxo</button>
          </div>

          {/* Input Area */}
          <div className="bg-white p-4 rounded-[32px] border border-[#E5E7EB] shadow-2xl flex items-center gap-4 focus-within:border-[#1F2937] transition-all">
             <input 
              type="text"
              placeholder="Digite sua dúvida aqui..."
              className="flex-1 bg-transparent border-none text-sm font-bold text-[#1F2937] focus:outline-none px-4"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
             />
             <button 
              onClick={handleSend}
              className="h-12 w-12 bg-[#1F2937] text-white rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-black/10"
             >
                <Send className="h-5 w-5" />
             </button>
          </div>

          <div className="mt-6 flex justify-center items-center gap-6 text-[#9CA3AF]">
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

      </main>
    </div>
  );
}
