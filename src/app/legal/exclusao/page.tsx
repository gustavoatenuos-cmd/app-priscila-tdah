"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Trash2, AlertCircle } from "lucide-react";

export default function ExclusaoPage() {
  const router = useRouter();
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);

  const REQUIRED = "EXCLUIR MINHA CONTA";

  async function requestDeletion() {
    if (confirmText.trim() !== REQUIRED) {
      toast.error(`Digite exatamente: ${REQUIRED}`);
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Você precisa estar logada para excluir sua conta.");
        router.push("/login");
        return;
      }

      // Send a deletion request — actual hard-delete must run via a privileged
      // server route or scheduled job (Supabase admin SDK). We mark a request
      // and notify support, then sign the user out.
      const res = await fetch("/api/account/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, email: user.email }),
      });

      if (!res.ok) {
        // Fall back to a support email so the request is never lost.
        await fetch("/api/support", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            subject: "Pedido de exclusão de conta (LGPD)",
            message: `Usuária ${user.email} (${user.id}) solicitou exclusão da conta.`,
          }),
        });
      }

      await supabase.auth.signOut();
      toast.success("Pedido recebido. Sua conta será excluída em até 30 dias.");
      router.push("/");
    } catch (err: any) {
      toast.error(err.message || "Não foi possível registrar o pedido. Tente de novo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="text-[#1F2937] leading-relaxed">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#84A59D] mb-4">
        Exclusão de conta
      </p>
      <h1 className="text-4xl md:text-5xl font-display font-black tracking-tight mb-4">
        Excluir minha conta
      </h1>
      <p className="text-sm text-[#64748B] mb-12">
        Direito garantido pela LGPD (art. 18, VI)
      </p>

      <p className="mb-6">
        Você pode pedir a exclusão da sua conta a qualquer momento. Quando confirmamos
        o pedido, fazemos o seguinte:
      </p>

      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Encerramos sua assinatura imediatamente (sem cobrança futura).</li>
        <li>Apagamos seus dados pessoais e de uso em até <strong>30 dias</strong>.</li>
        <li>Mantemos somente o que a lei nos obriga a guardar (ex.: notas fiscais por 5 anos).</li>
        <li>Encaminhamos uma confirmação por e-mail quando a exclusão for concluída.</li>
      </ul>

      <div className="rounded-3xl bg-[#FEF3C7] border border-[#FDE68A] p-6 mb-10 flex gap-3">
        <AlertCircle className="h-5 w-5 text-[#92400E] shrink-0 mt-0.5" />
        <p className="text-[#92400E] text-sm">
          Esta ação é <strong>irreversível</strong>. Tarefas, journal, sessões de foco,
          analytics e personalização serão removidas. Recomendamos baixar seus dados
          antes (Configurações → Exportar dados).
        </p>
      </div>

      <h2 className="text-2xl font-display font-black mt-12 mb-4">Confirmar exclusão</h2>
      <p className="mb-4 text-[#64748B]">
        Para evitar exclusão acidental, digite exatamente <strong>{REQUIRED}</strong> abaixo:
      </p>
      <input
        type="text"
        value={confirmText}
        onChange={(e) => setConfirmText(e.target.value)}
        placeholder={REQUIRED}
        className="w-full bg-white border border-[#E5E7EB] rounded-2xl px-5 py-4 text-base font-mono mb-6 focus:outline-none focus:border-[#84A59D]"
      />
      <button
        onClick={requestDeletion}
        disabled={loading || confirmText.trim() !== REQUIRED}
        className="bg-[#991B1B] hover:bg-[#7F1D1D] disabled:bg-[#E5E7EB] disabled:text-[#9CA3AF] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all"
      >
        <Trash2 className="h-5 w-5" />
        {loading ? "Enviando pedido..." : "Excluir minha conta"}
      </button>

      <p className="mt-10 text-sm text-[#64748B]">
        Prefere falar com a gente antes? Escreva para{" "}
        <a href="mailto:contato@tdahconstante.com.br" className="text-[#84A59D] font-bold underline">
          contato@tdahconstante.com.br
        </a>
        .
      </p>
    </article>
  );
}
