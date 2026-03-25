"use client";

interface CheckboxItemProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function CheckboxItem({ label, checked, onChange }: CheckboxItemProps) {
  return (
    <label className="flex items-center gap-1.5 text-xs cursor-pointer text-text-secondary px-1 py-[3px] rounded hover:bg-bg-3 hover:text-text-primary transition-all duration-100">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-3 h-3 accent-accent"
      />
      {label}
    </label>
  );
}
