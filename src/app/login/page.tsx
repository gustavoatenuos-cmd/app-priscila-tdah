"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BrainCircuit, LogIn, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const target = event.target as typeof event.target & {
      email: { value: string };
      password: { value: string };
    };

    const email = target.email.value;
    const password = target.password.value;

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      toast.error("Erro ao entrar: " + error.message);
      setIsLoading(false);
      return;
    }

    toast.success("Bem-vindo de volta!");
    setIsLoading(false);
    router.push("/dashboard");
  }

  async function onForgotPassword(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(forgotEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (error) {
      toast.error("Erro ao enviar e-mail: " + error.message);
      return;
    }

    setForgotSent(true);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para Home
        </Link>

        <Card className="border-primary/10 shadow-2xl bg-card/60 backdrop-blur-xl">
          <AnimatePresence mode="wait">
            {!showForgot ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
              >
                <CardHeader className="space-y-1 text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <BrainCircuit className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">Entrar no Ecossistema</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Acesse suas ferramentas de neuroplasticidade e foco.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nome@exemplo.com"
                        required
                        className="bg-background/50 h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Senha</Label>
                        <button
                          type="button"
                          onClick={() => setShowForgot(true)}
                          className="text-xs text-primary hover:underline font-medium"
                        >
                          Esqueci a senha
                        </button>
                      </div>
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        required
                        className="bg-background/50 h-11"
                      />
                    </div>

                    <Button
                      className="w-full h-11 text-base font-semibold mt-4"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <span className="flex items-center">
                          <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                          Autenticando...
                        </span>
                      ) : (
                        <span className="flex items-center">
                          Entrar <LogIn className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                  </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center justify-center border-t border-border/40 p-6 bg-muted/20">
                  <p className="text-sm font-medium text-muted-foreground">
                    Não tem uma conta?{" "}
                    <Link href="/register" className="text-primary font-bold underline hover:no-underline">
                      Cadastrar-se
                    </Link>
                  </p>
                </CardFooter>
              </motion.div>
            ) : (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.25 }}
              >
                <CardHeader className="space-y-1 text-center pb-8">
                  <div className="flex justify-center mb-4">
                    <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                      <Mail className="h-6 w-6" />
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-bold tracking-tight">
                    {forgotSent ? "E-mail enviado!" : "Redefinir senha"}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {forgotSent
                      ? `Enviamos um link para ${forgotEmail}. Verifique sua caixa de entrada.`
                      : "Digite seu e-mail e enviaremos um link para criar uma nova senha."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {!forgotSent ? (
                    <form onSubmit={onForgotPassword} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="forgot-email">E-mail</Label>
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="nome@exemplo.com"
                          required
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="bg-background/50 h-11"
                        />
                      </div>
                      <Button
                        className="w-full h-11 text-base font-semibold mt-4"
                        type="submit"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <span className="flex items-center">
                            <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            Enviando...
                          </span>
                        ) : (
                          "Enviar link de redefinição"
                        )}
                      </Button>
                    </form>
                  ) : (
                    <Button
                      className="w-full h-11 text-base font-semibold"
                      onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(""); }}
                    >
                      Voltar para o login
                    </Button>
                  )}
                </CardContent>
                {!forgotSent && (
                  <CardFooter className="flex justify-center border-t border-border/40 p-6 bg-muted/20">
                    <button
                      type="button"
                      onClick={() => setShowForgot(false)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      ← Voltar para o login
                    </button>
                  </CardFooter>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>
    </div>
  );
}
