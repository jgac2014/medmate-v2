"use client";

import { useState } from "react";

export function LandingCheckoutButton() {
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/create-checkout-session", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      // Silently fail — user can retry
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full px-5 py-2.5 bg-accent hover:bg-accent-hover text-black font-bold rounded-lg text-[13px] transition-all hover:shadow-[0_0_12px_rgba(0,208,132,0.25)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {loading ? "Redirecionando..." : "Assinar Pro"}
    </button>
  );
}
