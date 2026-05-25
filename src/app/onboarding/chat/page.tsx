"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Brain, Sparkles, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { AnimatedBrain } from "@/components/animated-brain";
import { toast } from "sonner";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function OnboardingChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Olá! Sou seu Assistente TC. Estou aqui para calibrar seu Segundo Cérebro. Antes de começarmos, me diga: com o que você trabalha hoje e qual seu maior desafio de foco?" 
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [profileData, setProfileData] = useState<any>({});
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading || isFinished) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      // In the onboarding chat, we use a specialized prompt to extract profile info
      const res = await fetch('/api/chat', {
        method: 'POST',
        body: JSON.stringify({ 
          message: userMsg, 
          history: messages,
          onboardingMode: true // Special flag for the API to be in "diagnostic mode"
        }),
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await res.json();

      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
        
        // If the AI detected profile info, it can send it back in a hidden field
        if (data.extractedProfile) {
          setProfileData((prev: any) => ({ ...prev, ...data.extractedProfile }));
        }

        // Check if the onboarding is "complete" (the AI decided it has enough info)
        if (data.isComplete || messages.length > 8) {
           // We allow a bit more conversation, but eventually we offer to finish
        }
      }
    } catch (err) {
      toast.error("Erro na conexão sináptica.");
    } finally {
      setLoading(false);
    }
  };

  const finalizeOnboarding = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Save everything we learned to the profile
        await supabase.from('profiles').upsert({
          id: user.id,
          ...profileData,
          onboarding_completed: true,
          updated_at: new Date()
        });

        toast.success("Arquitetura Cognitiva Calibrada!");
        router.push("/dashboard");
      }
    } catch (err) {
      toast.error("Erro ao salvar perfil.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#84A59D]/20 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#1F2937]/10 blur-[120px] rounded-full animate-pulse" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-3xl h-[80vh] bg-white rounded-[3rem] shadow-2xl border border-white/50 backdrop-blur-xl flex flex-col overflow-hidden relative z-10"
      >
        {/* Header */}
        <header className="px-10 py-8 border-b border-[#F1F3F5] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-[#1F2937] rounded-2xl flex items-center justify-center shadow-lg">
              <AnimatedBrain size={30} state={loading ? "thinking" : "idle"} />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#1F2937] tracking-tight uppercase">Diagnóstico Neural</h1>
              <p className="text-[10px] font-bold text-[#84A59D] uppercase tracking-widest">Sincronizando Segundo Cérebro</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 w-6 rounded-full transition-all ${messages.length > i*2 ? 'bg-[#84A59D]' : 'bg-[#E5E7EB]'}`} />
            ))}
          </div>
        </header>

        {/* Chat Area */}
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-8 md:px-12 py-10 space-y-8 scroll-smooth"
          style={{ scrollbarWidth: 'none' }}
        >
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[85%] px-6 py-4 rounded-[2rem] text-sm md:text-base leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-[#1F2937] text-white rounded-tr-none font-medium' 
                    : 'bg-[#F8F9FA] text-[#374151] rounded-tl-none border border-[#E5E7EB]'
                }`}>
                  {msg.content}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {loading && (
            <div className="flex justify-start">
               <div className="bg-[#F8F9FA] px-6 py-4 rounded-[2rem] rounded-tl-none border border-[#E5E7EB] flex gap-2">
                 {[0, 1, 2].map(i => (
                   <motion.div 
                     key={i}
                     className="h-2 w-2 rounded-full bg-[#84A59D]"
                     animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                     transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                   />
                 ))}
               </div>
            </div>
          )}

          {/* Completion Card */}
          {messages.length >= 6 && !isFinished && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#84A59D]/10 border border-[#84A59D]/20 p-8 rounded-[2.5rem] text-center space-y-6 mt-10"
            >
              <div className="h-16 w-16 bg-[#84A59D] rounded-full flex items-center justify-center mx-auto shadow-lg shadow-[#84A59D]/30">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-black text-[#1F2937]">Mapeamento Concluído</h3>
                <p className="text-sm font-medium text-[#64748B] mt-2">Já entendi como você funciona. Pronto para ativar seu Córtex Externo?</p>
              </div>
              <button 
                onClick={finalizeOnboarding}
                className="w-full bg-[#1F2937] text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] hover:bg-black transition-all flex items-center justify-center gap-3 group"
              >
                Ativar Aplicativo <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="px-8 pb-10 pt-4 bg-white shrink-0">
          <div className="bg-[#F8F9FA] rounded-[2rem] border-2 border-[#E5E7EB] p-2 flex items-center gap-3 focus-within:border-[#1F2937] transition-all group">
            <input 
              type="text"
              placeholder="Responda aqui..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              disabled={loading || isFinished}
              className="flex-1 bg-transparent border-none outline-none px-6 py-4 text-sm font-bold text-[#1F2937] placeholder:text-[#9CA3AF]"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || loading || isFinished}
              className="h-14 w-14 bg-[#1F2937] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-20 disabled:scale-100"
            >
              <Send className="h-6 w-6" />
            </button>
          </div>
          <p className="text-center text-[10px] font-bold text-[#9CA3AF] mt-4 uppercase tracking-widest">Sua conversa é privada e criptografada</p>
        </div>

      </motion.div>
    </div>
  );
}
