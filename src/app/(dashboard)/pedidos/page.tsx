import { PedidosShell } from "@/components/pedidos/pedidos-shell";
import { BRAND } from "@/lib/branding";

export const metadata = {
  title: `Pedidos de Exames — ${BRAND.name}`,
};

export default function PedidosPage() {
  return <PedidosShell />;
}
