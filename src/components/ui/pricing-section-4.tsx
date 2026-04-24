"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card-premium";
import { Sparkles as SparklesComp } from "@/components/ui/sparkles";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Degustação",
    description: "Experimente o poder da constância sem compromisso.",
    price: 0,
    yearlyPrice: 0,
    buttonText: "Iniciar 7 Dias Grátis",
    buttonVariant: "outline" as const,
    includes: [
      "O que está incluso:",
      "7 dias de acesso total",
      "Planner Guiado (Brain Dump)",
      "Timer de Foco Básico",
      "Suporte via IA limitado",
    ],
  },
  {
    name: "Constante",
    description: "O sistema essencial para manter seu cérebro no trilho todos os dias.",
    price: 49.90,
    yearlyPrice: 499,
    buttonText: "Assinar Agora",
    buttonVariant: "default" as const,
    popular: true,
    includes: [
      "Tudo no Grátis, mais:",
      "Histórico de Evolução Completo",
      "Metas Semanais Assistidas",
      "Suporte SOS IA Ilimitado",
      "Dashboard de Nível e Gamificação",
    ],
  },
  {
    name: "Robusto",
    description: "Alta performance com suporte de grupo e ferramentas avançadas.",
    price: 97.90,
    yearlyPrice: 970,
    buttonText: "Assinar Agora",
    buttonVariant: "outline" as const,
    includes: [
      "Tudo no Constante, mais:",
      "Acesso à Comunidade VIP",
      "Workshops de Foco Mensais",
      "Relatórios Cognitivos Detalhados",
      "Prioridade em Novas Funcionalidades",
    ],
  },
];

const PricingSwitch = ({ onSwitch }: { onSwitch: (value: string) => void }) => {
  const [selected, setSelected] = useState("0");

  const handleSwitch = (value: string) => {
    setSelected(value);
    onSwitch(value);
  };

  return (
    <div className="flex justify-center">
      <div className="relative z-10 mx-auto flex w-fit rounded-full bg-[#1F2937] border border-gray-700 p-1">
        <button
          onClick={() => handleSwitch("0")}
          className={cn(
            "relative z-10 w-fit h-10 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "0" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "0" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-[#84A59D] border-[#84A59D] bg-gradient-to-t from-[#84A59D] to-[#6b8c85]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative text-[10px] font-black uppercase tracking-widest">Mensal</span>
        </button>

        <button
          onClick={() => handleSwitch("1")}
          className={cn(
            "relative z-10 w-fit h-10 flex-shrink-0 rounded-full sm:px-6 px-3 sm:py-2 py-1 font-medium transition-colors",
            selected === "1" ? "text-white" : "text-gray-200",
          )}
        >
          {selected === "1" && (
            <motion.span
              layoutId={"switch"}
              className="absolute top-0 left-0 h-10 w-full rounded-full border-4 shadow-sm shadow-[#84A59D] border-[#84A59D] bg-gradient-to-t from-[#84A59D] to-[#6b8c85]"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
            Anual <span className="bg-white/20 px-1.5 py-0.5 rounded text-[8px]">-20%</span>
          </span>
        </button>
      </div>
    </div>
  );
};

export default function PricingSection() {
  const [isYearly, setIsYearly] = useState(false);
  const pricingRef = useRef<HTMLDivElement>(null);

  const revealVariants = {
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.4,
        duration: 0.5,
      },
    }),
    hidden: {
      filter: "blur(10px)",
      y: -20,
      opacity: 0,
    },
  };

  const togglePricingPeriod = (value: string) =>
    setIsYearly(Number.parseInt(value) === 1);

  return (
    <div
      className="min-h-screen mx-auto relative bg-[#0a0a0a] overflow-x-hidden py-24"
      ref={pricingRef}
    >
      <TimelineContent
        animationNum={4}
        timelineRef={pricingRef}
        customVariants={revealVariants}
        className="absolute top-0 h-96 w-screen overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)]"
      >
        <div className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3a01_1px,transparent_1px)] bg-[size:70px_80px]"></div>
        <SparklesComp
          density={800}
          direction="bottom"
          speed={1}
          color="#84A59D"
          className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
        />
      </TimelineContent>

      <article className="text-center mb-16 max-w-3xl mx-auto space-y-4 relative z-50">
        <span className="inline-block px-4 py-1.5 mb-2 text-[9px] font-black uppercase tracking-widest bg-white/10 text-[#84A59D] rounded-full border border-[#84A59D]/20">
          INVESTIMENTO
        </span>
        <h2 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter">
          <VerticalCutReveal
            splitBy="words"
            staggerDuration={0.15}
            staggerFrom="first"
            reverse={true}
            containerClassName="justify-center"
            transition={{
              type: "spring",
              stiffness: 250,
              damping: 40,
              delay: 0,
            }}
          >
            Escolha o plano para sua mente
          </VerticalCutReveal>
        </h2>

        <TimelineContent
          as="p"
          animationNum={0}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="text-gray-400 font-medium max-w-xl mx-auto"
        >
          Junte-se a centenas de usuários que redescobriram o foco e a produtividade com o sistema TDAH Constante.
        </TimelineContent>

        <TimelineContent
          as="div"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="pt-8"
        >
          <PricingSwitch onSwitch={togglePricingPeriod} />
        </TimelineContent>
      </article>

      <div className="grid md:grid-cols-3 max-w-6xl gap-8 px-4 mx-auto relative z-50">
        {plans.map((plan, index) => (
          <TimelineContent
            key={plan.name}
            as="div"
            animationNum={2 + index}
            timelineRef={pricingRef}
            customVariants={revealVariants}
          >
            <Card
              className={`relative text-white border-neutral-800 rounded-[40px] overflow-hidden p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-[#1F2937] to-black shadow-[0px_-13px_150px_0px_rgba(132,165,157,0.15)] z-20 border-[#84A59D]/30"
                  : "bg-[#111111] z-10"
              }`}
            >
              <CardHeader className="text-left p-0 mb-8">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-black uppercase tracking-tight text-white">{plan.name}</h3>
                  {plan.popular && (
                    <span className="bg-[#84A59D] text-white text-[8px] font-black px-2 py-1 rounded-full uppercase tracking-widest">
                      Mais Popular
                    </span>
                  )}
                </div>
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-black text-white">
                    R$
                    <NumberFlow
                      value={isYearly ? plan.yearlyPrice : plan.price}
                      className="text-5xl font-black ml-1"
                    />
                  </span>
                  <span className="text-gray-500 font-bold ml-1 text-xs uppercase tracking-widest">
                    /{isYearly ? "ano" : "mês"}
                  </span>
                </div>
                <p className="text-xs text-gray-400 font-medium leading-relaxed">{plan.description}</p>
              </CardHeader>

              <CardContent className="p-0">
                <button
                  className={`w-full mb-8 py-5 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl transition-all duration-300 hover:scale-[1.02] active:scale-95 ${
                    plan.popular
                      ? "bg-[#84A59D] text-white shadow-lg shadow-[#84A59D]/20"
                      : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                  }`}
                >
                  {plan.buttonText}
                </button>

                <div className="space-y-4 pt-8 border-t border-white/5">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-[#84A59D]">
                    {plan.includes[0]}
                  </h4>
                  <ul className="space-y-3">
                    {plan.includes.slice(1).map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <div className="h-4 w-4 bg-[#84A59D]/10 rounded-full flex items-center justify-center">
                           <Check className="h-2.5 w-2.5 text-[#84A59D]" />
                        </div>
                        <span className="text-xs text-gray-400 font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TimelineContent>
        ))}
      </div>
    </div>
  );
}
