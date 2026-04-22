"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Brain, CheckCircle, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Premium Hero Section */}
      <section className="relative px-6 pt-32 pb-20 md:pt-48 md:pb-32 max-w-7xl mx-auto flex flex-col items-center text-center">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background"></div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          <span>Transforme sua mente em 365 dias</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60"
        >
          O Poder da <span className="text-primary">Neuroplasticidade</span>
          <br /> em suas Mãos
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
        >
          Ferramentas práticas, Planner de TDAH e um guia guiado para reestruturar seu cérebro, aumentar a produtividade e vencer desafios diários.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/register">
            <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold group">
              Começar Agora
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          <Link href="#conteudo">
            <Button variant="outline" size="lg" className="rounded-full px-8 h-12 text-base font-semibold">
              <Brain className="mr-2 h-4 w-4" />
              Saber mais
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Features Showcase */}
      <section id="conteudo" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Baseado em Conhecimento Real</h2>
            <p className="text-muted-foreground">Tudo o que você precisa está organizado em um único ecossistema.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Planner do TDAH", desc: "Organização pensada exclusivamente para mentes neurodivergentes." },
              { title: "365 Dias de Desafio", desc: "Passo a passo diário para construir novos caminhos neurais." },
              { title: "A Mágica da Neuroplasticidade", desc: "A base científica traduzida para atividades lúdicas e interativas." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-card p-8 rounded-3xl border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
