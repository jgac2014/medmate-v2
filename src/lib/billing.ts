import { showToast } from "@/components/ui/toast";

// Keeps the loading spinner alive through browser navigation.
// Not exported — a Promise that never settles would hang any test that awaits it.
const awaitNavigation = (): Promise<never> => new Promise(() => {});

export async function redirectToCheckout(): Promise<void> {
  try {
    const res = await fetch("/api/create-checkout-session", { method: "POST" });
    if (!res.ok) {
      showToast(`Erro ao iniciar checkout (HTTP ${res.status})`, "error");
      return;
    }
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      await awaitNavigation();
    } else {
      showToast(data.error || "Erro ao iniciar checkout", "error");
    }
  } catch {
    showToast("Erro de conexão", "error");
  }
}

export async function redirectToPortal(): Promise<void> {
  try {
    const res = await fetch("/api/create-portal-session", { method: "POST" });
    if (!res.ok) {
      showToast(`Erro ao abrir portal (HTTP ${res.status})`, "error");
      return;
    }
    const data = await res.json();
    if (data.url) {
      window.location.href = data.url;
      await awaitNavigation();
    } else {
      showToast(data.error || "Erro ao abrir portal", "error");
    }
  } catch {
    showToast("Erro de conexão", "error");
  }
}
