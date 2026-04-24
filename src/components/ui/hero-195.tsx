import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BorderBeam } from "@/components/ui/border-beam"
import { motion } from "framer-motion"
import Link from "next/link"

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className,
    )}
    {...props}
  />
))
Card.displayName = "Card"

export function Hero195() {
  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-[#F5F5F0]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-[10px] font-black uppercase tracking-widest bg-[#84A59D]/10 text-[#84A59D] rounded-full border border-[#84A59D]/20">
              O Ecossistema da Constância
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter text-[#1F2937] mb-8 leading-[0.9]"
          >
            DOMINE SUA MENTE <br /> 
            <span className="text-[#84A59D]">COM CLAREZA.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-[#64748B] font-medium mb-12 max-w-2xl leading-relaxed"
          >
            O primeiro sistema de neuroplasticidade projetado para o TDAH. 
            Menos barulho, mais constância. Planeje, foque e vença sua jornada diária.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/register">
              <Button size="lg" className="bg-[#1F2937] text-white px-10 rounded-2xl font-black text-lg h-16 shadow-2xl hover:scale-105 transition-all">
                COMEÇAR AGORA
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-2 border-[#1F2937] text-[#1F2937] px-10 rounded-2xl font-black text-lg h-16 hover:bg-[#1F2937]/5 transition-all">
                ENTRAR NO APP
              </Button>
            </Link>
          </motion.div>
        </div>

        {/* Hero Image/Mockup Area */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-20 relative max-w-5xl mx-auto"
        >
          <div className="relative rounded-[40px] border-4 border-[#1F2937] overflow-hidden bg-white shadow-[0_50px_100px_rgba(0,0,0,0.1)]">
            <BorderBeam size={400} duration={20} />
            <img 
              src="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=2070" 
              alt="Dashboard Preview" 
              className="w-full h-auto"
            />
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -top-10 -right-10 h-32 w-32 bg-[#84A59D]/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 bg-[#64748B]/10 rounded-full blur-3xl" />
        </div>
      </div>
    </section>
  );
}
