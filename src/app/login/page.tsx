"use client";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAppUrl } from "@/lib/app-url";
import { getCheckoutAuthUrl, getCheckoutIntent } from "@/lib/checkout-intent";
import { startCheckout } from "@/lib/start-checkout";
import { supabase } from "@/lib/supabase";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const [registerHref, setRegisterHref] = useState("/register");
  const router = useRouter();

  useEffect(() => {
    const intent = getCheckoutIntent();
    setRegisterHref(intent ? getCheckoutAuthUrl("/register", intent) : "/register");
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Não foi possível entrar. Confira seu e-mail e senha.");
      setIsLoading(false);
      return;
    }

    const checkoutIntent = getCheckoutIntent();
    if (checkoutIntent) {
      toast.success("Login confirmado. Vamos seguir para o pagamento.");
      try {
        await startCheckout(checkoutIntent);
      } catch (checkoutError) {
        toast.error(checkoutError instanceof Error ? checkoutError.message : "Erro ao iniciar checkout.");
        setIsLoading(false);
      }
      return;
    }

    toast.success("Bem-vindo de volta!");
    router.push("/dashboard");
  }

  async function onForgotPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${getAppUrl()}/reset-password`,
    });

    setIsLoading(false);
    if (error) {
      const message = error.message.toLowerCase();

      if (message.includes("error sending recovery email")) {
        toast.error("O serviço de e-mail do Supabase recusou o envio. É necessário configurar um SMTP para enviar a usuários reais.");
      } else if (message.includes("rate limit") || message.includes("too many")) {
        toast.error("Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente novamente.");
      } else if (message.includes("smtp") || message.includes("email")) {
        toast.error(`Falha no envio do e-mail: ${error.message}`);
      } else {
        toast.error(`Não foi possível enviar: ${error.message}`);
      }
      return;
    }

    setForgotSent(true);
  }

  return (
    <AuthShell
      eyebrow={showForgot ? "Recuperação segura" : "Bem-vinda de volta"}
      title={showForgot ? "Vamos criar uma nova senha." : "Continue de onde você parou."}
      description={
        showForgot
          ? "Enviaremos um link de recuperação para o e-mail cadastrado."
          : "Seu espaço de foco, clareza e constância está esperando por você."
      }
    >
      <AnimatePresence mode="wait">
        {!showForgot ? (
          <motion.div
            key="login"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-bold">E-mail</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="nome@exemplo.com"
                  required
                  className="h-12 rounded-lg border-[#CBD8D5] bg-white px-4 focus-visible:ring-[#84A59D]"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <Label htmlFor="password" className="text-sm font-bold">Senha</Label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-xs font-bold text-[#6E8F87] hover:text-[#1F2937]"
                  >
                    Esqueci a senha
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
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

              <Button
                type="submit"
                disabled={isLoading}
                className="h-12 w-full rounded-lg bg-[#1F2937] text-sm font-black text-white hover:bg-[#111827]"
              >
                {isLoading ? "Entrando..." : <>Entrar <ArrowRight className="ml-2 h-4 w-4" /></>}
              </Button>
            </form>

            <div className="mt-7 flex flex-col gap-4 border-t border-[#DCE4E2] pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
              <p className="font-medium text-[#64748B]">
                Ainda não tem conta?{" "}
                <Link href={registerHref} className="font-black text-[#1F2937] underline underline-offset-4">
                  Criar conta
                </Link>
              </p>
              <Link href="/" className="flex items-center gap-2 font-bold text-[#64748B] hover:text-[#1F2937]">
                <ArrowLeft className="h-4 w-4" /> Início
              </Link>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="forgot"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
          >
            {!forgotSent ? (
              <form onSubmit={onForgotPassword} className="space-y-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#E3EEEB] text-[#64877F]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="forgot-email" className="text-sm font-bold">E-mail cadastrado</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    autoComplete="email"
                    placeholder="nome@exemplo.com"
                    required
                    value={forgotEmail}
                    onChange={(event) => setForgotEmail(event.target.value)}
                    className="h-12 rounded-lg border-[#CBD8D5] bg-white px-4 focus-visible:ring-[#84A59D]"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="h-12 w-full rounded-lg bg-[#1F2937] text-sm font-black text-white hover:bg-[#111827]"
                >
                  {isLoading ? "Enviando..." : "Enviar link de recuperação"}
                </Button>
              </form>
            ) : (
              <div className="rounded-lg border border-[#B9D3CC] bg-[#EAF3F1] p-5">
                <p className="font-display text-lg font-black text-[#1F2937]">E-mail enviado</p>
                <p className="mt-2 text-sm leading-6 text-[#526761]">
                  Abra a mensagem enviada para <strong>{forgotEmail}</strong> e clique em
                  “Criar nova senha”.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setShowForgot(false);
                setForgotSent(false);
              }}
              className="mt-6 flex items-center gap-2 text-sm font-bold text-[#64748B] hover:text-[#1F2937]"
            >
              <ArrowLeft className="h-4 w-4" /> Voltar para o login
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </AuthShell>
  );
}
