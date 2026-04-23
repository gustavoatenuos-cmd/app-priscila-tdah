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
import { motion } from "framer-motion";
import { ArrowLeft, BrainCircuit } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function onSubmit(event: React.SyntheticEvent) {
    event.preventDefault();
    setIsLoading(true);

    const target = event.target as typeof event.target & {
      name: { value: string };
      email: { value: string };
      password: { value: string };
      whatsapp: { value: string };
    };

    const name = target.name.value;
    const email = target.email.value;
    const password = target.password.value;
    const whatsapp = target.whatsapp.value;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          whatsapp: whatsapp,
        }
      }
    });

    if (error) {
      toast.error("Erro ao cadastrar: " + error.message);
      setIsLoading(false);
      return;
    }

    // In Next.js App Router, signUp might auto-login or require confirmation
    toast.success("Conta criada! Verifique seu e-mail.");
    
    // Create initial profile
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: data.user?.id, full_name: name }
      ]);

    if (profileError) {
       console.error("Erro ao criar perfil:", profileError);
    }

    setIsLoading(false);
    router.push("/onboarding");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background glow */}
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
          <CardHeader className="space-y-1 text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                <BrainCircuit className="h-6 w-6" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Criar sua Conta</CardTitle>
            <CardDescription className="text-muted-foreground">
              Preencha seus dados para acessar o ecossistema de neuroplasticidade.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  placeholder="Seu nome"
                  required
                  className="bg-background/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail Especial</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nome@exemplo.com"
                  required
                  className="bg-background/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha Forte</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="bg-background/50 h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp (com DDD)</Label>
                <Input
                  id="whatsapp"
                  type="tel"
                  placeholder="(11) 99999-9999"
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
                  <span className="flex items-center relative">
                    <span className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                    Validando...
                  </span>
                ) : (
                  "Finalizar Cadastro"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center justify-center border-t border-border/40 p-6 bg-muted/20">
            <p className="text-xs text-muted-foreground text-center">
              Ao se cadastrar, você concorda com nossos{" "}
              <Link href="#" className="underline hover:text-primary">
                Termos de Uso
              </Link>{" "}
              e{" "}
              <Link href="#" className="underline hover:text-primary">
                Política de Privacidade
              </Link>.
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
