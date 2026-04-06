"use client";

import { useState } from "react";
import { showToast } from "@/components/ui/toast";

export function LandingCheckoutButton({ className = "" }: { className?: string }) {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showToast(data.error || "Erro ao iniciar checkout", "error");
      }
    } catch {
      showToast("Erro de conexão ao tentar assinar", "error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className={`px-5 py-3 bg-primary hover:bg-primary-container text-on-primary font-semibold rounded-lg text-[14px] transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-95 ${className}`}
    >
      {loading ? "Redirecionando..." : "Assinar agora"}
    </button>
  );
}
