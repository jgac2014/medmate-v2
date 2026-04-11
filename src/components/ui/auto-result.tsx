"use client";

/**
 * Exibe um resultado automático (calculado) — não é um input.
 * Mostra o valor em mono + um badge de faixa/risco opcional.
 * Quando não há dado suficiente, mostra "Dados insuficientes" em muted.
 */

type BadgeVariant = "calc" | "ok" | "warn" | "crit" | "muted";

const badgeColors: Record<BadgeVariant, string> = {
  calc:  "bg-[var(--status-calc)]/10 text-[var(--status-calc)]  border-[var(--status-calc)]/20",
  ok:    "bg-[var(--status-ok)]/10   text-[var(--status-ok)]    border-[var(--status-ok)]/20",
  warn:  "bg-[var(--status-warn)]/10 text-[var(--status-warn)]  border-[var(--status-warn)]/20",
  crit:  "bg-[var(--status-crit)]/10 text-[var(--status-crit)]  border-[var(--status-crit)]/20",
  muted: "bg-[var(--surface-high)]   text-[var(--on-surface-muted)] border-[var(--outline-variant)]/30",
};

interface AutoResultProps {
  label: string;
  value?: string | null;           // valor formatado (ex: "58.3 mL/min/1,73m²")
  badge?: string | null;           // faixa/risco (ex: "Faixa G3a", "Baixo risco")
  badgeVariant?: BadgeVariant;
  missingMsg?: string;             // mensagem específica quando dados insuficientes
  tooltip?: string;
  className?: string;
}

function badgeVariantFromText(text: string): BadgeVariant {
  const t = text.toLowerCase();
  if (t.includes("alto") || t.includes("g4") || t.includes("g5") || t.includes("a3")) return "crit";
  if (t.includes("indeterminado") || t.includes("g3") || t.includes("a2") || t.includes("intermediário")) return "warn";
  if (t.includes("baixo") || t.includes("g1") || t.includes("g2") || t.includes("a1") || t.includes("normal")) return "ok";
  if (t.includes("validade") || t.includes("faixa etária") || t.includes("insuficiente")) return "muted";
  return "calc";
}

export function AutoResult({
  label,
  value,
  badge,
  badgeVariant,
  missingMsg,
  tooltip,
  className = "",
}: AutoResultProps) {
  const variant = badgeVariant ?? (badge ? badgeVariantFromText(badge) : "muted");
  const hasData = value !== undefined && value !== null && value !== "";

  return (
    <div className={`flex items-center gap-1.5 py-[3px] ${className}`}>
      <span className="text-[10.5px] text-[var(--on-surface-variant)] flex-1 leading-tight">
        {label}
      </span>
      <div className="flex items-center gap-1 shrink-0">
        {hasData ? (
          <>
            <span className="font-mono text-[10.5px] text-[var(--status-calc)] tabular-nums font-semibold">
              {value}
            </span>
            {badge && (
              <span
                title={tooltip}
                className={`text-[9px] font-medium px-1.5 py-[2px] rounded-full border ${badgeColors[variant]} leading-none`}
              >
                {badge}
              </span>
            )}
          </>
        ) : (
          <span className="text-[9.5px] text-[var(--on-surface-muted)] italic">
            {missingMsg ?? "Dados insuficientes"}
          </span>
        )}
      </div>
    </div>
  );
}
