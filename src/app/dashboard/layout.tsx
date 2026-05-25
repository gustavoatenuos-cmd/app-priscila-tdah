import { Sidebar } from "@/components/sidebar";
import { MobileNav } from "@/components/mobile-nav";
import { MobileHeader } from "@/components/mobile-header";
import { TraveiButton } from "@/components/travei-button";
import { FrasesFlutuantes } from "@/components/frases-flutuantes";
import { OnboardingGuard } from "@/components/onboarding-guard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <OnboardingGuard>
      <div className="flex bg-[#F5F5F0] min-h-screen text-[#333333] font-sans overflow-hidden">
        <Sidebar />

        <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden">
          <MobileHeader />

          <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
            {children}
          </main>

          <MobileNav />
        </div>

        {/* Globais — disponíveis em qualquer página do dashboard */}
        <TraveiButton />
        <FrasesFlutuantes />
      </div>
    </OnboardingGuard>
  );
}
