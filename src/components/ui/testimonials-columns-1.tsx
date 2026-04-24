"use client";
import React from "react";
import { motion } from "framer-motion";

export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: { text: string; image: string; name: string; role: string }[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <div 
                  className="p-8 rounded-[32px] bg-white border border-[#E5E7EB] shadow-xl shadow-black/5 max-w-xs w-full" 
                  key={`${index}-${i}`}
                >
                  <div className="text-sm font-medium text-[#64748B] leading-relaxed italic">"{text}"</div>
                  <div className="flex items-center gap-3 mt-6">
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt={name}
                      className="h-10 w-10 rounded-full border-2 border-[#84A59D]/20 shadow-sm"
                    />
                    <div className="flex flex-col">
                      <div className="font-black text-[#1F2937] text-[11px] uppercase tracking-wider">{name}</div>
                      <div className="text-[9px] font-bold text-[#84A59D] uppercase tracking-widest">{role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.div>
    </div>
  );
};

export const Testimonials = () => {
  const testimonials = [
    {
      text: "Finalmente um app que entende como meu cérebro funciona. O método 1-2-3 mudou minha produtividade.",
      image: "https://i.pravatar.cc/150?u=1",
      name: "Ana Silveira",
      role: "Designer & TDAH",
    },
    {
      text: "O 'Descarrego Mental' é minha parte favorita. Consigo dormir melhor tirando tudo da cabeça.",
      image: "https://i.pravatar.cc/150?u=2",
      name: "Lucas Braga",
      role: "Desenvolvedor",
    },
    {
      text: "Nunca consegui manter uma rotina por mais de 3 dias. Com o TDAH Constante, já estou há 3 semanas!",
      image: "https://i.pravatar.cc/150?u=3",
      name: "Mariana Costa",
      role: "Estudante",
    },
    {
      text: "A gamificação é o que faltava. Ganhar pontos por focar me dá o 'shot' de dopamina que eu preciso.",
      image: "https://i.pravatar.cc/150?u=4",
      name: "Pedro Henrique",
      role: "Empreendedor",
    },
    {
      text: "O SOS me salvou em dias de paralisia total. É acolhedor e não gera culpa.",
      image: "https://i.pravatar.cc/150?u=5",
      name: "Julia Mendes",
      role: "Arquiteta",
    },
    {
      text: "Simples, elegante e direto ao ponto. Sem distrações desnecessárias.",
      image: "https://i.pravatar.cc/150?u=6",
      name: "Roberto Faria",
      role: "Escritor",
    },
  ];

  const firstColumn = testimonials.slice(0, 2);
  const secondColumn = testimonials.slice(2, 4);
  const thirdColumn = testimonials.slice(4, 6);

  return (
    <section className="bg-[#F5F5F0] py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-[9px] font-black uppercase tracking-widest bg-white text-[#1F2937] rounded-full border border-[#E5E7EB]">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[#1F2937] mb-6 uppercase">
            O QUE NOSSOS USUÁRIOS <br /> <span className="text-[#84A59D]">ESTÃO DIZENDO</span>
          </h2>
          <p className="text-[#64748B] font-medium">
            Junte-se a centenas de pessoas que redescobriram a constância.
          </p>
        </motion.div>

        <div className="flex justify-center gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_20%,black_80%,transparent)] max-h-[600px] overflow-hidden">
          <TestimonialsColumn testimonials={firstColumn} duration={20} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={25} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={22} />
        </div>
      </div>
    </section>
  );
};
