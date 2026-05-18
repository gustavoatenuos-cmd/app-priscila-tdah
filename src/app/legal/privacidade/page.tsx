export const metadata = {
  title: "Política de Privacidade — TDAH Constante",
  description: "Como o TDAH Constante coleta, armazena e protege seus dados pessoais sob a LGPD.",
};

export default function PrivacidadePage() {
  return (
    <article className="text-[#1F2937] leading-relaxed">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D] mb-4">
        Documento legal
      </p>
      <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
        Política de Privacidade
      </h1>
      <p className="text-sm text-[#64748B] mb-12">
        Última atualização: 09 de maio de 2026 · Conforme Lei nº 13.709/2018 (LGPD)
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">1. Quem somos</h2>
      <p className="mb-6">
        O <strong>TDAH Constante</strong> é uma plataforma digital de apoio à constância e
        organização da rotina, voltada a mulheres com TDAH. Esta política descreve como
        tratamos seus dados pessoais quando você usa o site, o app e os serviços relacionados.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">2. Quais dados coletamos</h2>
      <p className="mb-3">Coletamos apenas o estritamente necessário para a finalidade do serviço:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Identificação:</strong> nome, e-mail, número de WhatsApp (opcional).</li>
        <li><strong>Perfil cognitivo e contexto:</strong> respostas do onboarding sobre rotina, energia, padrões de foco e estilo de suporte preferido. Essas respostas são tratadas como dados sensíveis (saúde) e exigem seu consentimento explícito.</li>
        <li><strong>Uso do produto:</strong> tarefas, sessões de foco, anotações, descarrego mental, registros de journal, conquistas.</li>
        <li><strong>Pagamento:</strong> processado pela Stripe; nós não armazenamos dados de cartão.</li>
        <li><strong>Logs técnicos:</strong> IP, tipo de dispositivo, navegador, erros e métricas de uso anonimizadas.</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">3. Para que usamos seus dados</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Personalizar a experiência (sugestões de prioridades, ritual de foco, mensagens).</li>
        <li>Operar funcionalidades como planner, foco, journal, analytics e suporte.</li>
        <li>Cobrar assinaturas e emitir nota fiscal.</li>
        <li>Enviar e-mails operacionais (boas-vindas, recibos, recuperação de senha) e — somente com seu consentimento — comunicações de produto.</li>
        <li>Cumprir obrigações legais e prevenir fraude.</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">4. Bases legais (LGPD)</h2>
      <p className="mb-6">
        Tratamos seus dados com base em <strong>consentimento</strong> (especialmente para
        dados sensíveis do onboarding e marketing), <strong>execução de contrato</strong>{" "}
        (assinatura paga), <strong>cumprimento de obrigação legal</strong> (fiscal/contábil) e{" "}
        <strong>legítimo interesse</strong> (segurança e melhoria do produto, sempre limitado pelo
        teste de proporcionalidade).
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">5. Com quem compartilhamos</h2>
      <p className="mb-3">Nunca vendemos dados. Compartilhamos apenas com operadores estritamente necessários:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li><strong>Supabase</strong> — hospedagem do banco de dados e autenticação.</li>
        <li><strong>Vercel</strong> — hospedagem da aplicação web.</li>
        <li><strong>Stripe</strong> — processamento de pagamentos.</li>
        <li><strong>Resend</strong> — envio de e-mails transacionais.</li>
        <li><strong>OpenAI / Groq</strong> — processamento das mensagens enviadas ao TC Assistant. Nenhum dado é usado para treinar modelos públicos.</li>
        <li>Autoridades públicas, quando legalmente exigido.</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">6. Onde seus dados ficam</h2>
      <p className="mb-6">
        Os dados são armazenados em servidores localizados nos Estados Unidos e na União
        Europeia (Supabase / Vercel). Os fornecedores adotam padrões internacionais de
        segurança (criptografia em trânsito e em repouso, RLS por usuário no banco).
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">7. Por quanto tempo guardamos</h2>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Dados de conta e perfil: enquanto sua conta estiver ativa.</li>
        <li>Após exclusão da conta: removemos os dados pessoais em até 30 dias, exceto
          aqueles que precisamos manter por obrigação legal (ex.: notas fiscais por 5 anos).</li>
        <li>Dados anonimizados podem ser retidos para fins estatísticos.</li>
      </ul>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">8. Seus direitos como titular</h2>
      <p className="mb-3">A LGPD garante os seguintes direitos, que você pode exercer a qualquer momento:</p>
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Confirmação e acesso aos seus dados.</li>
        <li>Correção de dados incompletos ou desatualizados.</li>
        <li>Anonimização, bloqueio ou eliminação de dados desnecessários.</li>
        <li>Portabilidade dos dados.</li>
        <li>Revogação do consentimento.</li>
        <li>Exclusão da conta — disponível em <em>/legal/exclusao</em> ou nas configurações do perfil.</li>
      </ul>
      <p className="mb-6">
        Para exercer qualquer direito, escreva para{" "}
        <a href="mailto:contato@tdahconstante.com.br" className="text-[#84A59D] font-bold underline">
          contato@tdahconstante.com.br
        </a>
        . Respondemos em até 15 dias.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">9. Cookies</h2>
      <p className="mb-6">
        Usamos cookies estritamente necessários para autenticação e funcionamento do app, e
        cookies opcionais de medição de produto (apenas com seu consentimento). Você pode
        gerenciar preferências no banner que aparece no primeiro acesso.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">10. Crianças e adolescentes</h2>
      <p className="mb-6">
        O serviço é destinado a maiores de 18 anos. Não coletamos intencionalmente dados de
        menores. Se você tomar conhecimento de qualquer cadastro indevido, nos avise.
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">11. Encarregada (DPO)</h2>
      <p className="mb-6">
        Encarregada pelo tratamento de dados: <strong>Priscilla Gànimi</strong> —{" "}
        <a href="mailto:dpo@tdahconstante.com.br" className="text-[#84A59D] font-bold underline">
          dpo@tdahconstante.com.br
        </a>
        .
      </p>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">12. Atualizações</h2>
      <p className="mb-6">
        Esta política pode ser atualizada. Mudanças relevantes serão comunicadas por e-mail
        e dentro do app com pelo menos 15 dias de antecedência.
      </p>
    </article>
  );
}
