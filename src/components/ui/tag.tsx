type TagVariant = "ok" | "warn" | "crit" | "info" | "calc" | "misc" | "empty" | "medication";

const variantStyles: Record<TagVariant, string> = {
  ok:         "bg-status-ok-bg text-status-ok border border-status-ok/20",
  warn:       "bg-status-warn-bg text-status-warn border border-status-warn/20",
  crit:       "bg-status-crit-bg text-status-crit border border-status-crit/20",
  info:       "bg-status-info-bg text-status-info border border-status-info/20",
  calc:       "bg-status-calc-bg text-status-calc border border-status-calc/20",
  misc:       "bg-status-misc-bg text-status-misc border border-status-misc/20",
  empty:      "bg-surface-high text-on-surface-muted border border-dashed border-outline-variant",
  medication: "bg-secondary-container text-on-secondary-container",
};

interface TagProps {
  variant?: TagVariant;
  children: React.ReactNode;
}

export function Tag({ variant = "empty", children }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-[2px] rounded-full text-[10.5px] font-medium tracking-[0.01em] ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
