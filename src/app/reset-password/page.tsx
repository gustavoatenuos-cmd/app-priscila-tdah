"use client";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Eye, EyeOff, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [linkError, setLinkError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const prepareRecoverySession = async () => {
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const recoveryType = url.searchParams.get("type") || hashParams.get("type");

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setLinkError("Este link expirou ou já foi utilizado. Solicite uma nova recuperação.");
          return;
        }

        setReady(true);
        window.history.replaceState({}, document.title, "/reset-password");
        return;
      }

      if (recoveryType === "recovery" && hashParams.get("access_token")) {
        setReady(true);
        return;
      }

      setLinkError("Link de recuperação inválido. Solicite um novo e-mail.");
    };

    prepareRecoverySession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
        setLinkError("");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    const confirm = String(form.get("confirm") || "");

    if (password !== confirm) {
      toast.error("As senhas não coincidem.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast.error("A senha deve ter pelo menos 6 caracteres.");
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (error) {
      toast.error("Não foi possível salvar a nova senha.");
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2200);
  }

  return (
    <AuthShell
      eyebrow="Segurança da conta"
      title={done ? "Sua nova senha está pronta." : "Crie uma senha nova e segura."}
      description={
        done
          ? "Você já pode voltar para sua rotina com acesso restaurado."
          : "Escolha uma senha diferente da anterior para proteger seu espaço."
      }
    >
      {done ? (
        <div className="rounded-lg border border-[#B9D3CC] bg-[#EAF3F1] p-6">
          <CheckCircle2 className="h-8 w-8 text-[#64877F]" />
          <p className="mt-4 font-display text-xl font-black">Senha redefinida</p>
          <p className="mt-2 text-sm leading-6 text-[#526761]">
            Redirecionando você para o aplicativo...
          </p>
        </div>
      ) : !ready ? (
        <div className="rounded-lg border border-[#D7DEDC] bg-white p-6">
          <KeyRound className="h-7 w-7 text-[#6E8F87]" />
          <p className="mt-4 font-display text-lg font-black">
            {linkError ? "Não conseguimos validar o link" : "Validando seu acesso"}
          </p>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            {linkError || "Aguarde enquanto confirmamos sua solicitação de recuperação."}
          </p>
          {linkError && (
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/login")}
              className="mt-5 h-11 rounded-lg border-[#CBD8D5]"
            >
              Solicitar novo link
            </Button>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-bold">Nova senha</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                minLength={6}
                required
                className="h-12 rounded-lg border-[#CBD8D5] bg-white px-4 pr-12 focus-visible:ring-[#84A59D]"
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#81918D] hover:text-[#1F2937]"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm" className="text-sm font-bold">Confirmar nova senha</Label>
            <Input
              id="confirm"
              name="confirm"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={6}
              required
              className="h-12 rounded-lg border-[#CBD8D5] bg-white px-4 focus-visible:ring-[#84A59D]"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-lg bg-[#1F2937] text-sm font-black text-white hover:bg-[#111827]"
          >
            {isLoading ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
