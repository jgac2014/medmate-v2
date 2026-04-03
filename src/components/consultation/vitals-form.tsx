"use client";

import { useEffect } from "react";
import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { Input } from "@/components/ui/input";
import { calculateIMC } from "@/lib/calculations";

export function VitalsForm() {
  const { vitals, setVitals, setCalculations } = useConsultationStore();

  useEffect(() => {
    const peso = parseFloat(vitals.peso);
    const altura = parseFloat(vitals.altura);
    const result = calculateIMC(peso, altura);
    setVitals({ imc: result ? `${result.value} — ${result.classification}` : "" });
    setCalculations({ imc: result });
  }, [vitals.peso, vitals.altura, setVitals, setCalculations]);

  return (
    <div className="mb-3.5">
      <SectionHeader label="Exame Físico" color="amber" />
      <div className="grid grid-cols-2 gap-[5px]">
        <Input label="PAS (mmHg)" id="vital-pas" type="number" placeholder="120"
          value={vitals.pas} onChange={(e) => setVitals({ pas: e.target.value })} />
        <Input label="PAD (mmHg)" id="vital-pad" type="number" placeholder="80"
          value={vitals.pad} onChange={(e) => setVitals({ pad: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-[5px]">
        <Input label="Peso (kg)" id="vital-peso" type="number" placeholder="70"
          value={vitals.peso} onChange={(e) => setVitals({ peso: e.target.value })} />
        <Input label="Altura (cm)" id="vital-altura" type="number" placeholder="170"
          value={vitals.altura} onChange={(e) => setVitals({ altura: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-[5px]">
        <div className="mb-2">
          <label className="block text-[10.5px] text-[var(--on-surface-muted)] mb-0.5 font-medium">
            IMC <span className="text-[8px] bg-status-calc-bg text-status-calc px-[5px] py-[1px] rounded-[3px] font-bold ml-1 border border-[rgba(34,211,238,0.2)] tracking-[0.05em]">AUTO</span>
          </label>
          <input
            readOnly
            value={vitals.imc}
            className="w-full h-[29px] px-2 border border-[rgba(34,211,238,0.2)] rounded-[5px] bg-status-calc-bg text-status-calc font-mono text-xs cursor-default focus:outline-none"
          />
        </div>
        <Input label="C. Abd. (cm)" id="vital-ca" type="number" placeholder="—"
          value={vitals.ca_abd} onChange={(e) => setVitals({ ca_abd: e.target.value })} />
      </div>
      <div className="grid grid-cols-2 gap-[5px]">
        <Input label="FC (bpm)" id="vital-fc" type="number" placeholder="70"
          value={vitals.fc} onChange={(e) => setVitals({ fc: e.target.value })} />
        <Input label="SpO₂ (%)" id="vital-spo2" type="number" placeholder="98"
          value={vitals.spo2} onChange={(e) => setVitals({ spo2: e.target.value })} />
      </div>
      <Input label="Temperatura (°C)" id="vital-temp" type="number" placeholder="36.5" step="0.1"
        value={vitals.temp} onChange={(e) => setVitals({ temp: e.target.value })} />
    </div>
  );
}
