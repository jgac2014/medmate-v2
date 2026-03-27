"use client";

import Link from "next/link";

export default function SucessoPage() {
  const visible = true;

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0,208,132,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative bg-bg-1 border border-border-subtle rounded-xl px-10 py-12 max-w-[420px] w-full text-center transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
        }}
      >
        {/* Animated check icon */}
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div
            className="absolute inset-0 rounded-full transition-transform duration-500 ease-out"
            style={{
              background: "rgba(0,208,132,0.08)",
              transform: visible ? "scale(1)" : "scale(0)",
              transitionDelay: "200ms",
            }}
          />
          <svg
            className="relative w-16 h-16"
            viewBox="0 0 64 64"
            fill="none"
          >
            <circle
              cx="32" cy="32" r="30"
              stroke="var(--status-ok)"
              strokeWidth="1.5"
              strokeDasharray="188.5"
              strokeDashoffset={visible ? 0 : 188.5}
              style={{ transition: "stroke-dashoffset 0.8s ease-out 0.3s" }}
            />
            <path
              d="M22 33l6 6 14-14"
              stroke="var(--status-ok)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="40"
              strokeDashoffset={visible ? 0 : 40}
              style={{ transition: "stroke-dashoffset 0.5s ease-out 0.9s" }}
            />
          </svg>
        </div>

        <h1
          className="text-[22px] font-semibold text-text-primary tracking-[-0.02em] mb-2 transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: "500ms",
          }}
        >
          Assinatura ativada
        </h1>

        <p
          className="text-text-secondary text-[13px] leading-relaxed mb-8 max-w-[300px] mx-auto transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: "650ms",
          }}
        >
          Seu plano Pro está ativo. Todas as funcionalidades do MedMate estão liberadas.
        </p>

        <Link
          href="/consulta"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-hover text-bg-0 font-semibold rounded-lg transition-all duration-200 text-[13px] hover:shadow-[0_0_20px_rgba(0,208,132,0.2)]"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: "800ms",
          }}
        >
          Ir para o consultório
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
