"use client";

interface CheckboxItemProps {
  /** Label curta exibida na UI */
  label: string;
  /** Texto opcionalShown on hover — contexto clínico/normativo. Null = sem tooltip. */
  tooltip?: string | null;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxItem({ label, tooltip, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="group flex items-center gap-1.5 text-xs cursor-pointer text-on-surface-variant px-1 py-[3px] rounded hover:bg-surface-container hover:text-on-surface transition-all duration-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3 h-3 accent-primary shrink-0"
      />
      <span className="leading-snug">{label}</span>
      {tooltip && (
        <span className="w-3 h-3 text-[9px] text-on-surface-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0" title={tooltip}>
          ⓘ
        </span>
      )}
    </label>
  );
}