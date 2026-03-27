"use client";

import Link from "next/link";

export default function CanceladoPage() {
  const visible = true;

  return (
    <div className="min-h-screen bg-bg-0 flex items-center justify-center relative overflow-hidden">
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,166,35,0.04) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative bg-bg-1 border border-border-subtle rounded-xl px-10 py-12 max-w-[420px] w-full text-center transition-all duration-700 ease-out"
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(12px)",
        }}
      >
        <div className="relative mx-auto mb-6 w-16 h-16">
          <div
            className="absolute inset-0 rounded-full transition-transform duration-500 ease-out"
            style={{
              background: "rgba(245,166,35,0.08)",
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
              stroke="var(--status-warn)"
              strokeWidth="1.5"
              strokeDasharray="188.5"
              strokeDashoffset={visible ? 0 : 188.5}
              style={{ transition: "stroke-dashoffset 0.8s ease-out 0.3s" }}
            />
            <path
              d="M24 24l16 16M40 24l-16 16"
              stroke="var(--status-warn)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="22.6"
              strokeDashoffset={visible ? 0 : 22.6}
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
          Pagamento cancelado
        </h1>

        <p
          className="text-text-secondary text-[13px] leading-relaxed mb-8 max-w-[300px] mx-auto transition-all duration-500"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: "650ms",
          }}
        >
          Nenhuma cobrança foi realizada. Você pode assinar quando quiser.
        </p>

        <Link
          href="/consulta"
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-bg-2 hover:bg-bg-3 text-text-primary border border-border-subtle font-medium rounded-lg transition-all duration-200 text-[13px]"
          style={{
            opacity: visible ? 1 : 0,
            transitionDelay: "800ms",
          }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          Voltar ao consultório
        </Link>
      </div>
    </div>
  );
}
