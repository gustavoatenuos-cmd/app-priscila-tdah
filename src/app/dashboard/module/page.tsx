"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2, ChevronRight, PlayCircle, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export default function ModulePage() {
  const [activeLesson, setActiveLesson] = useState(1);

  const lessons = [
    { id: 1, title: "O que é Neuroplasticidade?", duration: "5 min", type: "video", completed: true },
    { id: 2, title: "O Caminho da Recompensa", duration: "12 min", type: "text", completed: true },
    { id: 3, title: "Identificando Padrões do TDAH", duration: "15 min", type: "video", completed: false },
    { id: 4, title: "Exercício Prático: Âncoras", duration: "10 min", type: "interactive", completed: false },
  ];

  const currentLesson = lessons.find(l => l.id === activeLesson);
  const progressPercent = (lessons.filter(l => l.completed).length / lessons.length) * 100;

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Sidebar: Course Navigation */}
      <aside className="w-80 border-r bg-card/60 backdrop-blur-xl flex flex-col z-10 hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b">
          <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mr-4">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <span className="font-semibold text-sm tracking-tight truncate">A Mágica da Neuroplasticidade</span>
        </div>
        
        <div className="p-6 border-b">
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Seu Progresso</p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">{Math.round(progressPercent)}%</span>
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <h4 className="text-sm font-bold text-muted-foreground mb-4 px-2 mt-4 uppercase tracking-wider">Módulo 1: Fundações</h4>
          {lessons.map((lesson) => (
            <button
              key={lesson.id}
              onClick={() => setActiveLesson(lesson.id)}
              className={cn(
                "w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all",
                activeLesson === lesson.id 
                  ? "bg-primary text-primary-foreground shadow-md" 
                  : "hover:bg-muted/50 text-foreground"
              )}
            >
              <div className="mt-0.5 flex-shrink-0">
                {lesson.completed ? (
                  <CheckCircle2 className={cn("h-5 w-5", activeLesson === lesson.id ? "text-primary-foreground/90" : "text-primary")} />
                ) : lesson.type === 'video' ? (
                  <PlayCircle className={cn("h-5 w-5", activeLesson === lesson.id ? "text-primary-foreground/90" : "text-muted-foreground")} />
                ) : (
                  <BookOpen className={cn("h-5 w-5", activeLesson === lesson.id ? "text-primary-foreground/90" : "text-muted-foreground")} />
                )}
              </div>
              <div>
                <p className={cn("text-sm font-medium leading-tight mb-1", activeLesson === lesson.id && "font-semibold")}>
                  {lesson.title}
                </p>
                <p className={cn("text-xs", activeLesson === lesson.id ? "text-primary-foreground/80" : "text-muted-foreground")}>
                  {lesson.duration}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto z-10">
        <header className="h-16 border-b flex items-center px-8 md:hidden bg-card">
          <Link href="/dashboard" className="text-muted-foreground mr-4"><ArrowLeft className="h-5 w-5"/></Link>
          <span className="font-semibold text-sm">A Mágica da Neuroplasticidade</span>
        </header>

        <div className="max-w-4xl mx-auto p-6 md:p-12 pb-24">
          <motion.div
            key={activeLesson}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Type Identifier */}
            <div className="inline-flex items-center rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-semibold uppercase tracking-wider mb-6">
              {currentLesson?.type === 'video' ? 'Vídeo Aula' : 'Leitura Guiada'}
            </div>

            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">
              {currentLesson?.title}
            </h1>

            {/* Video Mockup placeholder */}
            {currentLesson?.type === 'video' && (
              <div className="aspect-video bg-muted/30 border border-border/50 rounded-3xl overflow-hidden relative mb-10 group cursor-pointer shadow-lg flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-60 z-10" />
                <div className="h-20 w-20 rounded-full bg-primary/90 text-primary-foreground flex items-center justify-center z-20 shadow-xl group-hover:scale-110 transition-transform">
                  <PlayCircle className="h-10 w-10 ml-1" />
                </div>
              </div>
            )}

            {/* Content Mockup */}
            <div className="prose prose-neutral dark:prose-invert max-w-none text-lg leading-relaxed text-muted-foreground">
              <p>
                A neuroplasticidade é a capacidade do cérebro de se reorganizar, tanto fisicamente quanto funcionalmente, ao longo da vida, em resposta às suas experiências, comportamentos e estímulos.
              </p>
              <h3 className="text-foreground mt-8 font-bold">Por que isso importa para o TDAH?</h3>
              <p>
                Pessoas com TDAH frequentemente sentem que são escravas dos seus próprios impulsos ou da desatenção. Pela lente da neuroplasticidade, percebemos que o cérebro não é uma caixa estática. Seus caminhos de recompensa podem ser remodelados.
              </p>
              
              <div className="bg-card border-l-4 border-primary p-6 rounded-r-2xl my-8 text-foreground">
                <p className="m-0 italic">"Você não é a falha dos seus hábitos antigos; você é a arquitetura dos seus novos hábitos."</p>
              </div>

              <p>
                Durante este desafio, aplicaremos pequenos gatilhos diários para enfraquecer as rotas neurais associadas à procrastinação e fortalecer a via de ação imediata. A consistência é o oxigênio da plasticidade.
              </p>
            </div>

            {/* Completion & Next Actions */}
            <div className="mt-16 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
              <Button variant="outline" size="lg" className="rounded-full w-full sm:w-auto h-12 px-8">
                <CheckCircle2 className="mr-2 h-5 w-5" />
                Marcar como Concluído
              </Button>
              <Button size="lg" className="rounded-full w-full sm:w-auto h-12 px-8 group">
                Próxima Aula
                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
