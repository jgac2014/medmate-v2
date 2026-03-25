type TagVariant = "ok" | "warn" | "crit" | "info" | "calc" | "misc" | "empty";

const variantStyles: Record<TagVariant, string> = {
  ok: "bg-[rgba(0,208,132,0.06)] text-status-ok border border-[rgba(0,208,132,0.2)]",
  warn: "bg-[rgba(245,166,35,0.06)] text-status-warn border border-[rgba(245,166,35,0.2)]",
  crit: "bg-[rgba(255,82,82,0.06)] text-status-crit border border-[rgba(255,82,82,0.2)]",
  info: "bg-[rgba(75,158,255,0.06)] text-status-info border border-[rgba(75,158,255,0.2)]",
  calc: "bg-[rgba(34,211,238,0.06)] text-status-calc border border-[rgba(34,211,238,0.2)]",
  misc: "bg-[rgba(155,138,248,0.06)] text-status-misc border border-[rgba(155,138,248,0.2)]",
  empty: "bg-bg-3 text-text-tertiary border border-dashed border-border-default",
};

interface TagProps {
  variant?: TagVariant;
  children: React.ReactNode;
}

export function Tag({ variant = "empty", children }: TagProps) {
  return (
    <span
      className={`inline-flex items-center px-2 py-[2px] rounded-[20px] text-[10.5px] font-medium tracking-[0.01em] ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
