export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F5F5F0] flex items-center justify-center p-6 selection:bg-[#84A59D]/30">
      {children}
    </div>
  );
}
