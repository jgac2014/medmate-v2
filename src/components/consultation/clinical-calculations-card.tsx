"use client";

import { useShallow } from "zustand/react/shallow";
import { useConsultationStore } from "@/stores/consultation-store";
import { AutoResult } from "@/components/ui/auto-result";

/**
 * Card de Cálculos Clínicos — exibe TFG, FIB-4 e RCV com faixas visuais.
 * Apenas resultados automáticos: nenhum campo editável aqui.
 */

// ── Helpers de mensagem de dados ausentes ────────────────────────────────────

function joinParts(parts: string[]): string {
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} ou ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")} ou ${parts[parts.length - 1]}`;
}

function missingMsg(parts: string[]): string {
  if (parts.length === 0) return "Dados insuficientes";
  const verb = parts.length === 1 ? "Falta" : "Faltam";
  return `${verb} ${joinParts(parts)}`;
}

function tfgMissing(cr: string, age: string, gender: string): string {
  const parts: string[] = [];
  if (!cr.trim() || isNaN(parseFloat(cr))) parts.push("creatinina");
  if (!age.trim() || isNaN(parseInt(age))) parts.push("idade");
  if (gender !== "Masculino" && gender !== "Feminino") parts.push("sexo");
  return missingMsg(parts);
}

function fib4Missing(age: string, ast: string, alt: string, plaq: string): string {
  const parts: string[] = [];
  if (!ast.trim() || isNaN(parseFloat(ast))) parts.push("AST");
  if (!alt.trim() || isNaN(parseFloat(alt))) parts.push("ALT");
  if (!plaq.trim() || isNaN(parseFloat(plaq))) parts.push("plaquetas");
  if (!age.trim() || isNaN(parseInt(age))) parts.push("idade");
  return missingMsg(parts);
}

function rcvMissing(age: string, gender: string, pas: string, ct: string, hdl: string): string {
  const parts: string[] = [];
  if (!pas.trim() || isNaN(parseFloat(pas))) parts.push("PAS");
  if (!ct.trim() || isNaN(parseFloat(ct))) parts.push("colesterol total");
  if (!hdl.trim() || isNaN(parseFloat(hdl))) parts.push("HDL");
  if (!age.trim() || isNaN(parseInt(age))) parts.push("idade");
  if (gender !== "Masculino" && gender !== "Feminino") parts.push("sexo");
  return missingMsg(parts);
}

// ── Componente ───────────────────────────────────────────────────────────────

export function ClinicalCalculationsCard() {
  const calculations = useConsultationStore((s) => s.calculations);
  const { tfg, fib4, rcv } = calculations;

  const { cr, ast, alt, plaq, ct, hdl } = useConsultationStore(
    useShallow((s) => ({
      cr:   s.labs.cr   ?? "",
      ast:  s.labs.ast  ?? "",
      alt:  s.labs.alt  ?? "",
      plaq: s.labs.plaq ?? "",
      ct:   s.labs.ct   ?? "",
      hdl:  s.labs.hdl  ?? "",
    }))
  );

  const { age, gender } = useConsultationStore(
    useShallow((s) => ({ age: s.patient.age, gender: s.patient.gender }))
  );

  const pas = useConsultationStore((s) => s.vitals.pas);

  return (
    <div className="rounded-xl p-3 bg-[var(--surface-lowest)] border border-[var(--status-calc)]/20 shadow-[0_1px_3px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.07)] transition-shadow duration-150">

      {/* Header */}
      <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[var(--outline-variant)]/30">
        <span className="text-[9.5px] font-bold tracking-[0.10em] uppercase text-[var(--status-calc)]">
          Cálculos Clínicos
        </span>
        <span className="text-[9px] text-[var(--status-calc)] opacity-60">auto</span>
      </div>

      {/* TFG */}
      <AutoResult
        label="TFG CKD-EPI"
        value={tfg ? `${tfg.value} mL/min/1,73m²` : null}
        badge={tfg?.stage ?? null}
        missingMsg={!tfg ? tfgMissing(cr, age, gender) : undefined}
      />

      {/* TFG UACR se houver */}
      {tfg?.uacrCategory && (
        <div className="pl-2 -mt-0.5 mb-0.5">
          <AutoResult
            label="Albuminúria"
            value={null}
            badge={tfg.uacrCategory}
          />
        </div>
      )}

      {/* Separador */}
      <div className="h-px bg-[var(--outline-variant)]/20 my-1" />

      {/* FIB-4 */}
      <div className="relative">
        <AutoResult
          label="FIB-4"
          value={fib4 ? String(fib4.value) : null}
          badge={fib4?.risk ?? null}
          missingMsg={!fib4 ? fib4Missing(age, ast, alt, plaq) : undefined}
        />
        {fib4 && !fib4.lowValidity && (
          <span
            className="absolute right-0 top-0 text-[8px] text-[var(--on-surface-muted)] cursor-help"
            title="Interpretar com cautela em doença hepática aguda"
          >
            ⓘ
          </span>
        )}
      </div>

      {/* Separador */}
      <div className="h-px bg-[var(--outline-variant)]/20 my-1" />

      {/* RCV */}
      <AutoResult
        label="Risco cardiovascular 10a"
        value={rcv && !rcv.outOfRange ? `${rcv.value}%` : null}
        badge={rcv?.risk ?? null}
        missingMsg={!rcv ? rcvMissing(age, gender, pas, ct, hdl) : undefined}
        badgeVariant={
          rcv?.outOfRange
            ? "muted"
            : rcv?.risk === "Alto risco"
            ? "crit"
            : rcv?.risk === "Risco intermediário"
            ? "warn"
            : rcv?.risk === "Baixo risco"
            ? "ok"
            : undefined
        }
      />
      {rcv?.outOfRange && (
        <p className="text-[9px] text-[var(--on-surface-muted)] mt-0.5 pl-0.5 italic">
          {rcv.risk}
        </p>
      )}
    </div>
  );
}
