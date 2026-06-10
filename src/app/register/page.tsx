"use client";

import { AuthShell } from "@/components/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getAppUrl } from "@/lib/app-url";
import { getCheckoutAuthUrl, getCheckoutIntent } from "@/lib/checkout-intent";
import { startCheckout } from "@/lib/start-checkout";
import { supabase } from "@/lib/supabase";
import { ArrowLeft, ArrowRight, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginHref, setLoginHref] = useState("/login");
  const router = useRouter();

  useEffect(() => {
    const intent = getCheckoutIntent();
    setLoginHref(intent ? getCheckoutAuthUrl("/login", intent) : "/login");
  }, []);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "");
    const email = String(form.get("email") || "");
    const password = String(form.get("password") || "");
    const whatsapp = String(form.get("whatsapp") || "");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${getAppUrl()}/login?confirmed=1`,
        data: {
          full_name: name,
          whatsapp,
        },
      },
    });

    if (error) {
      toast.error("Não foi possível criar sua conta: " + error.message);
      setIsLoading(false);
      return;
    }

    const checkoutIntent = getCheckoutIntent();
    if (checkoutIntent) {
      if (data.session?.access_token) {
        toast.success("Conta criada. Vamos seguir para o pagamento.");
        try {
          await startCheckout(checkoutIntent);
        } catch (checkoutError) {
          toast.error(checkoutError instanceof Error ? checkoutError.message : "Erro ao iniciar checkout.");
          setIsLoading(false);
        }
        return;
      }

      toast.success("Conta criada. Confirme seu e-mail e entre para continuar.");
      router.push(getCheckoutAuthUrl("/login", checkoutIntent));
      return;
    }

    if (!data.session) {
      toast.success("Conta criada! Confirme seu e-mail para continuar.");
      router.push("/login?checkEmail=1");
      return;
    }

    toast.success("Conta criada! Agora vamos personalizar sua experiência.");
    router.push("/onboarding");
  }

  return (
    <AuthShell
      eyebrow="Comece com leveza"
      title="Construa um espaço que entenda seu ritmo."
      description="Crie sua conta para organizar prioridades, descarregar pensamentos e receber apoio contextual."
    >
      <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name" className="text-sm font-bold">Nome completo</Label>
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Como você gostaria de ser chamada?"
            required
            className="h-12 rounded-lg border-[#CBD8D5] bg-white px-4 focus-visible:ring-[#84A59D]"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
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
          <Label htmlFor="password" className="text-sm font-bold">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              minLength={6}
              required
              className="h-12 rounded-lg border-[#CBD8D5] bg-white px-4 pr-11 focus-visible:ring-[#84A59D]"
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
          <Label htmlFor="whatsapp" className="text-sm font-bold">WhatsApp</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            autoComplete="tel"
            placeholder="(11) 99999-9999"
            required
            className="h-12 rounded-lg border-[#CBD8D5] bg-white px-4 focus-visible:ring-[#84A59D]"
          />
        </div>

        <p className="text-xs font-medium leading-5 text-[#64748B] sm:col-span-2">
          Ao criar sua conta, você concorda com os{" "}
          <Link href="/legal/termos" className="font-bold text-[#1F2937] underline underline-offset-4">
            Termos
          </Link>{" "}
          e com a{" "}
          <Link href="/legal/privacidade" className="font-bold text-[#1F2937] underline underline-offset-4">
            Política de Privacidade
          </Link>.
        </p>

        <Button
          type="submit"
          disabled={isLoading}
          className="h-12 rounded-lg bg-[#1F2937] text-sm font-black text-white hover:bg-[#111827] sm:col-span-2"
        >
          {isLoading ? "Criando sua conta..." : <>Criar minha conta <ArrowRight className="ml-2 h-4 w-4" /></>}
        </Button>
      </form>

      <div className="mt-7 flex flex-col gap-4 border-t border-[#DCE4E2] pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
        <p className="font-medium text-[#64748B]">
          Já possui uma conta?{" "}
          <Link href={loginHref} className="font-black text-[#1F2937] underline underline-offset-4">
            Entrar
          </Link>
        </p>
        <Link href="/" className="flex items-center gap-2 font-bold text-[#64748B] hover:text-[#1F2937]">
          <ArrowLeft className="h-4 w-4" /> Início
        </Link>
      </div>
    </AuthShell>
  );
}
