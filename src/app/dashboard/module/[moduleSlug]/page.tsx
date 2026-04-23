"use client";

import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, BrainCircuit, CheckCircle2, FileText, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { use } from "react";

export default function DynamicModulePage({ params }: { params: Promise<{ moduleSlug: string }> }) {
  const resolvedParams = use(params);
  const [activeTab, setActiveTab] = useState("learn");
  const [quizScore, setQuizScore] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const handleCompleteConcept = () => {
    setActiveTab("notes");
    toast.success("Progresso salvo! Anote as ideias chaves.");
  };

  const handleSubmitQuiz = () => {
    setQuizScore(100);
    toast.success("Excelente! Você absorveu o conhecimento da aula.", {
      icon: <Target className="text-emerald-500 h-5 w-5" />
    });
    setTimeout(() => setActiveTab("score"), 1000);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background relative selection:bg-primary/20">
      {/* Soft Top Gradient for visual tracking focus */}
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-emerald-500 via-primary to-blue-500" />

      {/* Header */}
      <header className="h-16 border-b flex items-center px-6 md:px-12 bg-card/60 backdrop-blur-md sticky top-0 z-50">
        <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors mr-4 flex items-center justify-center p-2 rounded-full hover:bg-muted">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-col">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">TDAH Constante</span>
          <span className="font-bold text-sm tracking-tight truncate">Fundamentos da Neuroplasticidade</span>
        </div>
      </header>

      {/* Main Framework View */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 md:p-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-14 mb-8 bg-muted/50 p-1 rounded-2xl">
            <TabsTrigger value="learn" className="rounded-xl text-xs md:text-sm transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <BookOpen className="mr-2 h-4 w-4 hidden sm:block" /> Aprendizado
            </TabsTrigger>
            <TabsTrigger value="notes" className="rounded-xl text-xs md:text-sm transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <FileText className="mr-2 h-4 w-4 hidden sm:block" /> Anotações
            </TabsTrigger>
            <TabsTrigger value="quiz" className="rounded-xl text-xs md:text-sm transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <BrainCircuit className="mr-2 h-4 w-4 hidden sm:block" /> Prática (Quiz)
            </TabsTrigger>
            <TabsTrigger value="score" className="rounded-xl text-xs md:text-sm transition-all data-[state=active]:bg-card data-[state=active]:shadow-sm">
              <Target className="mr-2 h-4 w-4 hidden sm:block" /> Resultado
            </TabsTrigger>
          </TabsList>

          {/* 1. O Aprendizado */}
          <TabsContent value="learn" className="mt-0 outline-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="prose prose-neutral dark:prose-invert max-w-none">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">O que é Neuroplasticidade?</h1>
                <p className="text-xl text-muted-foreground leading-relaxed mt-4">
                  O cérebro de uma pessoa com TDAH busca dopamina imediata. Entender a neuroplasticidade é entender que podemos literalmente ensinar novos caminhos ao nosso cérebro.
                </p>
                
                <div className="bg-card border-l-4 border-primary p-6 rounded-r-2xl my-8 text-foreground shadow-sm">
                  <p className="m-0 font-medium">&quot;O cérebro não é uma estrutura fixa de concreto; é um labirinto orgânico que cresce dependendo de por quais caminhos você mais anda.&quot;</p>
                </div>
              </div>

              <div className="flex justify-end pt-8 border-t">
                <Button size="lg" className="rounded-full shadow-lg" onClick={handleCompleteConcept}>
                  Concluí a Leitura
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* 2. As Anotações */}
          <TabsContent value="notes" className="mt-0 outline-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Descarrego Mental (Anotações)</h2>
                <p className="text-muted-foreground">O que você aprendeu que faz sentido para sua vida? Escreva para esvaziar a mente.</p>
              </div>
              <Textarea 
                placeholder="Insira seus maiores aprendizados aqui... (Isso será salvo em nuvem)"
                className="min-h-[300px] text-lg p-6 rounded-2xl resize-none bg-muted/30 focus-visible:ring-primary"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
              <div className="flex justify-between items-center pt-4">
                <span className="text-xs text-muted-foreground flex items-center"><CheckCircle2 className="h-3 w-3 mr-1"/> Salvo automaticamente</span>
                <Button size="lg" variant="secondary" className="rounded-full" onClick={() => setActiveTab("quiz")}>
                  Ir para a Prática
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* 3. O Questionário */}
          <TabsContent value="quiz" className="mt-0 outline-none">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
               <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Fixação de Conteúdo</h2>
                <p className="text-muted-foreground">Testes não devem gerar ansiedade. É o cérebro se testando ativamente. Sem punições.</p>
              </div>
              
              <Card className="rounded-3xl border-muted bg-card shadow-sm">
                <CardContent className="p-8">
                  <h3 className="font-semibold text-lg mb-6">Como a Neuroplasticidade afeta caminhos de recompensa no TDAH?</h3>
                  <RadioGroup defaultValue="1" className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 rounded-xl border border-muted hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="1" id="r1" />
                      <Label htmlFor="r1" className="flex-1 cursor-pointer font-normal text-base">Permite criar um novo hábito substituindo um vício impulsivo.</Label>
                    </div>
                    <div className="flex items-center space-x-3 p-4 rounded-xl border border-muted hover:bg-muted/50 transition-colors cursor-pointer">
                      <RadioGroupItem value="2" id="r2" />
                      <Label htmlFor="r2" className="flex-1 cursor-pointer font-normal text-base">Aumenta a quantidade de dopamina magicamente.</Label>
                    </div>
                  </RadioGroup>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button size="lg" className="rounded-full" onClick={handleSubmitQuiz}>
                  Verificar Resposta
                </Button>
              </div>
            </motion.div>
          </TabsContent>

          {/* 4. O Sistema de Pontuação */}
           <TabsContent value="score" className="mt-0 outline-none">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-16 text-center space-y-6">
              <div className="h-32 w-32 bg-primary/10 text-primary rounded-full flex items-center justify-center mb-4 relative">
                 {quizScore ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring" }}>
                      <Target className="h-16 w-16" />
                    </motion.div>
                 ) : (
                    <BrainCircuit className="h-16 w-16 opacity-50" />
                 )}
                 <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full -z-10" />
              </div>
              
              <h2 className="text-4xl font-extrabold tracking-tight">
                {quizScore ? "+50 Moedas Neurais" : "Finalize o Quiz para Pontuar!"}
              </h2>
              <p className="text-xl text-muted-foreground max-w-md">
                {quizScore ? "Você completou essa etapa sem fricção. Mais um caminho construtivo moldado." : "Estamos torcendo por você."}
              </p>

              {quizScore && (
                <Link href="/dashboard" className="mt-8 relative inline-flex">
                  <Button size="lg" className="rounded-full px-8 h-12 shadow-xl shadow-primary/20 hover:scale-105 transition-all">
                    Voltar para o Painel
                  </Button>
                </Link>
              )}
            </motion.div>
           </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
