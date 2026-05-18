import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ConsentBanner } from "@/components/consent-banner";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TDAH Constante | Constância possível, sem rigidez",
  description:
    "Sistema de apoio à constância feito por uma neurocientista com TDAH para mulheres que querem organizar a rotina sem se cobrar perfeição.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${outfit.variable} h-full antialiased bg-background text-foreground`}
    >
      <body className="min-h-full flex flex-col font-sans">
        {children}
        <ConsentBanner />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
