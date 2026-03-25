"use client";

import { BRAND } from "@/lib/branding";
import { Button } from "@/components/ui/button";
import { useConsultationStore } from "@/stores/consultation-store";
import { showToast } from "@/components/ui/toast";

const NAV_ITEMS = ["Consulta", "Prescrição", "Exames", "Atestados", "Laudos", "Orientações"];

export function Topbar() {
  const reset = useConsultationStore((s) => s.reset);

  return (
    <div className="bg-bg-1 border-b border-border-subtle flex items-center justify-between px-5 h-12 sticky top-0 z-50">
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-[9px] font-bold text-[14px] tracking-[-0.02em] text-text-primary">
          <div className="w-7 h-7 rounded-[7px] bg-accent flex items-center justify-center text-black text-[12px] font-extrabold font-mono tracking-[-0.04em] shrink-0">
            {BRAND.shortName}
          </div>
          {BRAND.name}
        </div>

        <div className="flex h-12 items-end">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item}
              className={`px-3 h-[44px] border-b-2 bg-transparent text-[12px] cursor-pointer font-sans transition-[color,border-color] duration-150 whitespace-nowrap ${
                i === 0
                  ? "text-text-primary font-medium border-b-accent"
                  : "text-text-secondary border-b-transparent hover:text-text-primary"
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-1.5">
        <Button variant="secondary" onClick={() => { reset(); showToast("Nova consulta", "info"); }}>
          Nova consulta
        </Button>
        <Button variant="primary" onClick={() => showToast("Salvo!", "success")}>
          Salvar
        </Button>
      </div>
    </div>
  );
}
