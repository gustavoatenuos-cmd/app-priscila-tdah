import { AlertTriangle, Heart, Phone } from "lucide-react";

export const metadata = {
  title: "Aviso clínico — TDAH Constante",
  description: "O TDAH Constante é uma ferramenta de apoio comportamental e não substitui acompanhamento médico ou psicológico.",
};

export default function DisclaimerPage() {
  return (
    <article className="text-[#1F2937] leading-relaxed">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D] mb-4">
        Aviso importante
      </p>
      <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
        Aviso clínico
      </h1>
      <p className="text-sm text-[#64748B] mb-12">
        Última atualização: 09 de maio de 2026
      </p>

      <div className="rounded-3xl bg-[#FEF3C7] border border-[#FDE68A] p-6 md:p-8 mb-12 flex gap-4">
        <AlertTriangle className="h-6 w-6 text-[#92400E] shrink-0 mt-1" />
        <div>
          <h2 className="text-xl font-display font-black text-[#92400E] mb-2">
            O TDAH Constante não é um serviço de saúde.
          </h2>
          <p className="text-[#92400E]/90">
            Somos uma plataforma digital de apoio comportamental e organização de rotina,
            inspirada em conteúdo educativo sobre TDAH e neurociência. <strong>Em nenhuma
            hipótese substituímos avaliação, diagnóstico, tratamento ou acompanhamento por
            profissionais de saúde habilitados</strong> (médicos, psiquiatras, psicólogos,
            terapeutas ocupacionais e demais).
          </p>
        </div>
      </div>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">O que oferecemos</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Estruturas leves de organização (planner por método, três prioridades, descarrego mental).</li>
        <li>Apoio à constância e à retomada após interrupções.</li>
        <li>Conteúdo educativo sobre TDAH, funções executivas e neuroplasticidade.</li>
        <li>Ferramentas de foco, journal e autoconhecimento.</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">O que não oferecemos</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Diagnóstico de TDAH ou de qualquer outra condição de saúde.</li>
        <li>Prescrição, recomendação ou indicação de medicamentos.</li>
        <li>Psicoterapia, atendimento clínico, aconselhamento médico ou psicológico individualizado.</li>
        <li>Avaliação ou tratamento de comorbidades (ansiedade, depressão, transtornos alimentares etc.).</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">Quando procurar ajuda profissional</h2>
      <p className="mb-3">Procure imediatamente um profissional de saúde se você:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Está em sofrimento emocional intenso ou prolongado.</li>
        <li>Tem pensamentos de se machucar ou de tirar a própria vida.</li>
        <li>Apresenta sintomas que comprometem sua segurança, sua saúde ou a de outras pessoas.</li>
        <li>Quer iniciar, ajustar ou interromper qualquer medicação.</li>
      </ul>

      <div className="rounded-3xl bg-[#FEE2E2] border border-[#FCA5A5] p-6 md:p-8 mb-12">
        <div className="flex items-start gap-4 mb-4">
          <Phone className="h-6 w-6 text-[#991B1B] shrink-0 mt-1" />
          <div>
            <h3 className="text-xl font-display font-black text-[#991B1B] mb-2">Em situação de crise</h3>
            <p className="text-[#991B1B]/90 mb-4">
              Se você está em crise ou tem pensamentos de se machucar, procure ajuda agora.
            </p>
            <ul className="space-y-2 text-[#991B1B]/90">
              <li>
                <strong>CVV — Centro de Valorização da Vida:</strong> ligue 188 (24h, ligação
                gratuita) ou converse pelo chat em <a href="https://www.cvv.org.br" className="underline" target="_blank" rel="noopener noreferrer">cvv.org.br</a>.
              </li>
              <li>
                <strong>SAMU:</strong> 192. <strong>Emergência:</strong> 190.
              </li>
              <li>
                <strong>CAPS</strong> (Centro de Atenção Psicossocial) mais próximo de você — atendimento gratuito do SUS.
              </li>
            </ul>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">Sobre o conteúdo</h2>
      <p className="mb-6">
        O conteúdo disponibilizado pelo TDAH Constante (textos, mensagens do TC Assistant,
        livros e materiais vinculados) tem caráter <strong>educativo e motivacional</strong>.
        Foi elaborado com base em referências sérias de neurociência e prática clínica, mas
        não considera o seu caso individual. Decisões sobre saúde devem sempre passar por
        um profissional habilitado.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">Sobre a inteligência artificial</h2>
      <p className="mb-6">
        O TC Assistant usa modelos de linguagem para gerar respostas. Esses modelos podem
        cometer erros, produzir informações imprecisas ou inadequadas ao seu contexto.
        <strong> Nunca tome decisões de saúde, financeiras ou jurídicas com base apenas no
        que o assistente disser.</strong> Use as respostas como ponto de partida para
        reflexão, não como conselho profissional.
      </p>

      <div className="rounded-3xl bg-[#84A59D]/10 border border-[#84A59D]/30 p-6 md:p-8 flex gap-4">
        <Heart className="h-6 w-6 text-[#84A59D] shrink-0 mt-1" />
        <p className="text-[#1F2937]">
          Você merece cuidado de verdade. O TDAH Constante caminha junto com você — mas
          não caminha no lugar de quem pode te ajudar profissionalmente.
        </p>
      </div>
    </article>
  );
}
