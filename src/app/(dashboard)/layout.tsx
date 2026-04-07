import { Topbar } from "@/components/layout/topbar";
import { ToastProvider } from "@/components/ui/toast";
import { OnboardingChecklist } from "@/components/onboarding/onboarding-checklist";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-surface-low">
      <Topbar />
      <OnboardingChecklist />
      {children}
      <ToastProvider />
    </div>
  );
}
