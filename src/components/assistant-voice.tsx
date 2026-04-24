"use client";

import { motion } from "framer-motion";
import { Sparkles, Brain } from "lucide-react";

interface AssistantVoiceProps {
  message: string;
  className?: string;
}

export function AssistantVoice({ message, className = "" }: AssistantVoiceProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-4 bg-white/40 backdrop-blur-md p-6 rounded-[32px] border border-[#84A59D]/20 shadow-sm ${className}`}
    >
      <div className="h-10 w-10 bg-[#1F2937] rounded-2xl flex items-center justify-center text-[#84A59D] shrink-0 shadow-lg">
        <Sparkles className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
           <span className="text-[10px] font-black text-[#1F2937] uppercase tracking-[0.2em]">TC Assistant</span>
           <div className="h-1 w-1 rounded-full bg-[#84A59D]" />
           <span className="text-[9px] font-bold text-[#84A59D] uppercase tracking-widest">Ativo Agora</span>
        </div>
        <p className="text-sm font-medium text-[#4B5563] leading-relaxed italic">
          "{message}"
        </p>
      </div>
    </motion.div>
  );
}
