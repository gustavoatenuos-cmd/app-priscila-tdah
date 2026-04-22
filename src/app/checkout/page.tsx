"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, CreditCard, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulação de gateway de pagamento (ex: Mercado Pago / Stripe)
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Pagamento Aprovado!", {
        description: "Seu acesso completo ao app foi liberado."
      });
      router.push("/dashboard");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/20 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8 items-start">
        
        {/* Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div>
            <h1 className="text-3xl font-bold mb-2">Desbloqueie sua Mente</h1>
            <p className="text-muted-foreground">O acesso vitalício a todo o ecossistema NeuroMente.</p>
          </div>

          <Card className="border-primary/20 bg-primary/5 shadow-none pb-2">
            <CardHeader>
              <CardTitle className="text-lg">Plano Premium (Acesso Total)</CardTitle>
              <div className="text-3xl font-bold mt-2">R$ 97,00<span className="text-sm text-muted-foreground font-normal"> / único</span></div>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Planner do TDAH Completo",
                "Desafio de 365 Dias",
                "A Mágica da Neuroplasticidade",
                "Notificações diárias no WhatsApp",
                "Suporte prioritário"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Payment Form */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <Card className="shadow-lg border-muted">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4 text-primary">
                <Lock className="h-8 w-8" />
              </div>
              <CardTitle>Pagamento Seguro</CardTitle>
              <CardDescription>Criptografia de ponta a ponta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handlePayment} className="space-y-4">
                <div className="space-y-2">
                  <Label>Nome no Cartão</Label>
                  <Input required placeholder="Ex: PRISCILA M" />
                </div>
                <div className="space-y-2">
                  <Label>Número do Cartão</Label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input required className="pl-9" placeholder="0000 0000 0000 0000" maxLength={19} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Validade</Label>
                    <Input required placeholder="MM/AA" maxLength={5} />
                  </div>
                  <div className="space-y-2">
                    <Label>CVC</Label>
                    <Input required placeholder="123" maxLength={4} type="password" />
                  </div>
                </div>

                <Button className="w-full mt-6 h-12 text-base font-bold shadow-md hover:shadow-lg transition-all" disabled={isProcessing}>
                  {isProcessing ? "Processando..." : "Confirmar Pagamento Seguro"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="justify-center pt-2 pb-6">
              <span className="text-xs text-muted-foreground text-center">
                Pagamento processado via ambiente seguro (Stripe/Mercado Pago)
              </span>
            </CardFooter>
          </Card>
        </motion.div>

      </div>
    </div>
  );
}
