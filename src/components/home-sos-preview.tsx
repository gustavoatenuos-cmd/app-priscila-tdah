"use client";

import { motion } from "framer-motion";
import { Zap, ArrowRight, Heart } from "lucide-react";

export function HomeSosPreview() {
  return (
    <section className="py-32 bg-[#1F2937] text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-[#84A59D]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-white/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full mb-8">
              <Zap className="h-4 w-4 text-[#84A59D]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#84A59D]">
                Recurso Anti-Paralisia
              </span>
            </div>
            
            <h2 className="text-4xl md:text-6xl font-display font-black mb-8 leading-tight">
              Para os dias em que a mente <span className="italic text-[#84A59D]">trava</span>.
            </h2>
            
            <p className="text-xl text-white/60 font-medium mb-12 leading-relaxed">
              O botão SOS não é apenas um atalho. É uma ferramenta de neuroplasticidade para vencer a paralisia e reduzir a resistência da primeira ação.
            </p>

            <div className="space-y-8">
              <SosStep 
                number="01" 
                title="Aperte o SOS" 
                desc="Disponível em qualquer tela do app, para quando você se sentir sobrecarregada." 
              />
              <SosStep 
                number="02" 
                title="Receba o 'Passo Ridículo'" 
                desc="Nós quebramos a sua maior trava em uma ação tão pequena que é impossível não começar." 
              />
              <SosStep 
                number="03" 
                title="Destrave em 30s" 
                desc="O cérebro TDAH precisa de dopamina rápida. O primeiro passo gera o momentum para o resto do dia." 
              />
            </div>
          </div>

          <div className="relative">
             <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="bg-white/5 backdrop-blur-xl p-8 md:p-12 rounded-[4rem] border border-white/10 shadow-2xl relative"
             >
                <div className="flex flex-col items-center text-center">
                   <div className="h-20 w-20 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 mb-8 animate-pulse">
                      <Heart className="h-10 w-10 fill-red-500" />
                   </div>
                   <h3 className="text-2xl font-display font-black mb-4 uppercase tracking-tight">Protocolo SOS Ativo</h3>
                   <p className="text-white/40 text-sm font-bold mb-10">QUAL É A ÚNICA COISA QUE PRECISAMOS FAZER AGORA?</p>
                   <div className="w-full bg-white/5 p-6 rounded-3xl border border-white/10 text-left mb-8">
                      <p className="text-xs font-black text-[#84A59D] uppercase tracking-widest mb-2">Primeiro Passo Ridículo:</p>
                      <p className="text-lg font-bold">Apenas abra o documento e escreva o título.</p>
                   </div>
                   <button className="w-full bg-[#84A59D] text-[#1F2937] py-5 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-white transition-all">
                      Eu consigo fazer isso
                   </button>
                </div>
             </motion.div>
             
             {/* Abstract circles to add "Safe" feeling */}
             <div className="absolute -top-10 -left-10 h-32 w-32 bg-[#84A59D]/20 rounded-full blur-2xl" />
             <div className="absolute -bottom-10 -right-10 h-40 w-40 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SosStep({ number, title, desc }: { number: string, title: string, desc: string }) {
  return (
    <div className="flex gap-6 group">
      <span className="text-2xl font-display font-black text-[#84A59D]/40 group-hover:text-[#84A59D] transition-colors">
        {number}
      </span>
      <div>
        <h4 className="text-xl font-display font-black mb-2">{title}</h4>
        <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm">{desc}</p>
      </div>
    </div>
  );
}
