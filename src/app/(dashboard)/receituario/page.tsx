import { PrescricaoShell } from "@/components/receituario/prescricao-shell";
import { BRAND } from "@/lib/branding";

export const metadata = {
  title: `Receituário — ${BRAND.name}`,
};

export default function ReceituarioPage() {
  return <PrescricaoShell />;
}
