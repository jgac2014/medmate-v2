type SectionColor = "blue" | "red" | "amber" | "green" | "cyan" | "purple";

const colorMap: Record<SectionColor, string> = {
  blue:   "bg-status-info",
  red:    "bg-status-crit",
  amber:  "bg-status-warn",
  green:  "bg-status-ok",
  cyan:   "bg-status-calc",
  purple: "bg-status-misc",
};

interface SectionHeaderProps {
  label: string;
  color: SectionColor;
}

export function SectionHeader({ label, color }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 text-[10.5px] font-semibold tracking-[0.08em] uppercase text-on-surface-variant mb-3">
      <span
        className={`w-[3px] h-[14px] rounded-sm shrink-0 ${colorMap[color]}`}
      />
      {label}
    </div>
  );
}
