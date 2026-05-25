"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { BrainCircuit, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [ready, setReady] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Supabase injeta a sessão via hash na URL após o clique no link do email
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const target = event.target as typeof event.target & {
      password: { value: string };
      confirm: { value: string };
    };

    const password = target.password.value;
    const confirm = target.confirm.value;

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
      toast.error("Erro ao redefinir senha: " + error.message);
      return;
    }

    setDone(true);
    setTimeout(() => router.push("/dashboard"), 2500);
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
        <Card className="border-primary/10 shadow-2xl bg-card/60 backdrop-blur-xl">
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                {done ? <CheckCircle className="h-6 w-6" /> : <BrainCircuit className="h-6 w-6" />}
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">
              {done ? "Senha redefinida!" : "Nova senha"}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {done
                ? "Sua senha foi atualizada. Redirecionando para o dashboard..."
                : "Digite e confirme sua nova senha."}
            </CardDescription>
          </CardHeader>

          {!done && (
            <CardContent>
              {!ready ? (
                <p className="text-center text-sm text-muted-foreground py-4">
                  Verificando link... se nada acontecer, volte ao e-mail e clique novamente no link.
                </p>
              ) : (
                <form onSubmit={onSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nova senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="mínimo 6 caracteres"
                      required
                      minLength={6}
                      className="bg-background/50 h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm">Confirmar nova senha</Label>
                    <Input
                      id="confirm"
                      type="password"
                      placeholder="repita a senha"
                      required
                      minLength={6}
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
                        Salvando...
                      </span>
                    ) : (
                      "Salvar nova senha"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
