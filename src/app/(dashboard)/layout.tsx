"use client";

import { usePathname } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { ToastProvider } from "@/components/ui/toast";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isConsulta = pathname === "/consulta";

  return (
    <div className="min-h-screen bg-surface-low">
      {!isConsulta && <Topbar />}
      {!isConsulta && <OnboardingChecklist />}
      {children}
      <ToastProvider />
    </div>
  );
}
