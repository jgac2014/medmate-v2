"use client";

import { useConsultationStore } from "@/stores/consultation-store";
import { SectionHeader } from "@/components/ui/section-header";
import { CheckboxItem } from "@/components/ui/checkbox-item";
import { Input } from "@/components/ui/input";
import { PROBLEMS } from "@/lib/constants";

export function ProblemList() {
  const { problems, problemsOther, toggleProblem, setProblemsOther } = useConsultationStore();

  return (
    <div className="mb-3.5 scroll-mt-12">
      <SectionHeader label="Lista de Problemas" color="red" />
      <div className="flex flex-col gap-0.5">
        {PROBLEMS.map((p) => (
          <CheckboxItem
            key={p}
            label={p}
            checked={problems.includes(p)}
            onChange={() => toggleProblem(p)}
          />
        ))}
      </div>
      <div className="mt-[7px]">
        <Input
          label="Outros"
          id="problems-other"
          placeholder="Ex: ICC (G5A2), Gota..."
          value={problemsOther}
          onChange={(e) => setProblemsOther(e.target.value)}
        />
      </div>
    </div>
  );
}
