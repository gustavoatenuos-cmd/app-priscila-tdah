export const metadata = {
  title: "Termos de Uso — TDAH Constante",
  description: "Regras de uso do TDAH Constante: assinatura, cancelamento, propriedade intelectual e limites do serviço.",
};

export default function TermosPage() {
  return (
    <article className="text-[#1F2937] leading-relaxed">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D] mb-4">
        Documento legal
      </p>
      <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
        Termos de Uso
      </h1>
      <p className="text-sm text-[#64748B] mb-12">
        Última atualização: 09 de maio de 2026
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">1. Aceitação</h2>
      <p className="mb-6">
        Ao criar uma conta no TDAH Constante, você concorda com estes Termos e com a
        Política de Privacidade. Se não concordar, não use o serviço.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">2. Sobre o serviço</h2>
      <p className="mb-6">
        O TDAH Constante é uma plataforma digital de apoio à organização da rotina, foco e
        autoconhecimento, com base em método educativo desenvolvido pela equipe da Priscilla
        Gànimi. <strong>O serviço é uma ferramenta de apoio comportamental e educacional;
        não substitui acompanhamento médico, psicológico, psiquiátrico ou terapêutico.</strong>{" "}
        Consulte sempre profissionais habilitados para diagnóstico e tratamento.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">3. Cadastro</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Você precisa ter 18 anos ou mais.</li>
        <li>As informações fornecidas devem ser verdadeiras e atualizadas.</li>
        <li>A conta é pessoal e intransferível. Você é responsável por manter a senha em sigilo.</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">4. Plano gratuito e assinatura</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Oferecemos uma janela inicial de uso gratuito de 7 dias, sem necessidade de cartão.</li>
        <li>O plano pago é cobrado mensalmente ou anualmente, conforme escolhido no checkout.</li>
        <li>A renovação é automática até o cancelamento.</li>
        <li>Você pode cancelar a qualquer momento na área de configurações; o acesso permanece até o final do período já pago.</li>
        <li>Reembolsos seguem o Código de Defesa do Consumidor: até 7 dias após a primeira contratação, sem necessidade de justificativa.</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">5. Propriedade intelectual</h2>
      <p className="mb-6">
        Todo o conteúdo do app — textos, método, marca, design, código, e-books vinculados —
        é de propriedade do TDAH Constante e/ou da Priscilla Gànimi. É proibido reproduzir,
        revender ou redistribuir sem autorização escrita.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">6. Conteúdo da pessoa usuária</h2>
      <p className="mb-6">
        Os dados que você registra no app (tarefas, journal, descarrego mental, sessões de
        foco, respostas do onboarding) pertencem a você. Concedemos a nós uma licença
        limitada e não exclusiva apenas para operar e personalizar o serviço.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">7. Uso adequado</h2>
      <p className="mb-3">Você concorda em não:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Usar o serviço para fins ilícitos ou que violem direitos de terceiros.</li>
        <li>Tentar burlar mecanismos de segurança ou acessar contas de outras pessoas.</li>
        <li>Fazer engenharia reversa, scraping ou uso automatizado não autorizado.</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">8. Limitação de responsabilidade</h2>
      <p className="mb-6">
        O serviço é fornecido &quot;como está&quot;. Faremos o nosso melhor para mantê-lo
        funcionando, mas não garantimos disponibilidade ininterrupta. Não nos
        responsabilizamos por decisões pessoais, de saúde ou financeiras tomadas com base
        no uso do app — ele é uma ferramenta de apoio, não uma orientação profissional.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">9. Suspensão e encerramento</h2>
      <p className="mb-6">
        Podemos suspender ou encerrar contas que violem estes Termos, mediante aviso
        prévio quando possível.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">10. Alterações</h2>
      <p className="mb-6">
        Podemos alterar estes Termos. Mudanças relevantes serão comunicadas por e-mail e no
        app com 15 dias de antecedência.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">11. Foro</h2>
      <p className="mb-6">
        Estes Termos seguem a legislação brasileira. Fica eleito o foro da comarca de
        residência da pessoa usuária para dirimir eventuais controvérsias.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">12. Contato</h2>
      <p className="mb-6">
        Dúvidas: <a href="mailto:contato@tdahconstante.com.br" className="text-[#84A59D] font-bold underline">contato@tdahconstante.com.br</a>.
      </p>
    </article>
  );
}
