"use client";

import { useEffect } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { DateInput } from "@/components/ui/date-input";
import { ExamCard } from "./exam-card";
import { EXAM_CARDS } from "@/lib/constants";
import { calculateTFG, calculateFIB4, calculateRCV } from "@/lib/calculations";
import type { ExamCardDef } from "@/types";

const CALC_CARD: ExamCardDef = {
  id: "calculos",
  title: "Cálculos Automáticos",
  fields: [
    { key: "fib4_auto", label: "FIB-4", unit: "", auto: true },
    { key: "tfg_auto", label: "TFG CKD-EPI", unit: "mL/min", auto: true },
    { key: "rcv_auto", label: "RCV Framingham", unit: "%", auto: true },
  ],
};

export function ExamGrid() {
  const store = useConsultationStore();
  const { labs, labsDate, setLabsDate, setLab, setCalculations, patient, vitals, problems } = store;

  // Auto-calculate TFG
  useEffect(() => {
    const cr = parseFloat(labs.cr ?? "");
    const idade = parseInt(patient.age);
    const sexo = patient.gender;
    if (!isNaN(cr) && cr > 0 && !isNaN(idade) && (sexo === "Masculino" || sexo === "Feminino")) {
      const result = calculateTFG(cr, idade, sexo);
      setLab("tfg", result ? result.value.toString() : "");
      setLab("tfg_auto", result ? `${result.value} — ${result.stage}` : "");
      setCalculations({ tfg: result });
    } else {
      setLab("tfg", "");
      setLab("tfg_auto", "");
      setCalculations({ tfg: null });
    }
  }, [labs.cr, patient.age, patient.gender, setLab, setCalculations]);

  // Auto-calculate FIB-4
  useEffect(() => {
    const idade = parseInt(patient.age);
    const ast = parseFloat(labs.ast ?? "");
    const alt = parseFloat(labs.alt ?? "");
    const plaq = parseFloat(labs.plaq ?? "");
    if (!isNaN(idade) && !isNaN(ast) && !isNaN(alt) && !isNaN(plaq) && plaq > 0) {
      const result = calculateFIB4(idade, ast, alt, plaq);
      setLab("fib4_auto", result ? `${result.value} — ${result.risk}` : "");
      setCalculations({ fib4: result });
    } else {
      setLab("fib4_auto", "");
      setCalculations({ fib4: null });
    }
  }, [patient.age, labs.ast, labs.alt, labs.plaq, setLab, setCalculations]);

  // Auto-calculate RCV
  useEffect(() => {
    const idade = parseInt(patient.age);
    const pas = parseFloat(vitals.pas);
    const ct = parseFloat(labs.ct ?? "");
    const hdl = parseFloat(labs.hdl ?? "");
    const sexo = patient.gender;
    const tabagismo = problems.includes("Tabagismo");
    const dm = problems.includes("DM2");
    const has = problems.includes("HAS");

    if (!isNaN(idade) && !isNaN(pas) && !isNaN(ct) && !isNaN(hdl) && (sexo === "Masculino" || sexo === "Feminino")) {
      const result = calculateRCV(idade, pas, ct, hdl, sexo, tabagismo, dm, has);
      setLab("rcv_auto", result ? `${result.value}% — ${result.risk}` : "");
      setCalculations({ rcv: result });
    } else {
      setLab("rcv_auto", "");
      setCalculations({ rcv: null });
    }
  }, [patient.age, vitals.pas, labs.ct, labs.hdl, patient.gender, problems, setLab, setCalculations]);

  return (
    <div>
      <SectionHeader label="Exames Complementares" color="cyan" />
      <DateInput label="Data dos exames" value={labsDate} onChange={setLabsDate} />
      <div className="grid grid-cols-3 gap-[7px] mb-2.5">
        {EXAM_CARDS.map((card) => (
          <ExamCard key={card.id} card={card as unknown as ExamCardDef} />
        ))}
        <ExamCard card={CALC_CARD} span2 />
      </div>
      {/* Outros / Imagens */}
      <div className="border border-[var(--outline-variant)] rounded-lg p-[10px] bg-[var(--surface-low)]">
        <div className="text-[9px] font-bold tracking-[0.09em] uppercase text-[var(--on-surface-variant)] mb-2 pb-1.5 border-b border-[var(--outline-variant)]">
          Outros / Imagens
        </div>
        <DateInput label="Data" value={store.imaging.date} onChange={(v) => store.setImaging({ date: v })} />
        <textarea
          placeholder={"ECG: ritmo sinusal\nUSG abd: esteatose hepática leve"}
          value={store.imaging.entries}
          onChange={(e) => store.setImaging({ entries: e.target.value })}
          className="w-full h-20 px-2 py-[7px] border border-[var(--outline-variant)] rounded-[5px] bg-[var(--surface-container)] text-[var(--on-surface)] font-sans text-xs resize-y leading-relaxed placeholder:text-[var(--on-surface-muted)] focus:outline-none focus:border-primary focus:shadow-[0_0_0_2px_rgba(1,45,29,0.1)]"
        />
      </div>
    </div>
  );
}
