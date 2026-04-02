"use client";

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  label: string;
  unit: string;
}

export function Sparkline({ data, width = 120, height = 32, color = "var(--color-secondary)", label, unit }: SparklineProps) {
  if (data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;

  const pointsArr = data.map((v, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((v - min) / range) * (height - padding * 2);
    return { x, y };
  });

  const points = pointsArr.map((p) => `${p.x},${p.y}`).join(" ");
  const last = data[data.length - 1];
  const lastPoint = pointsArr[pointsArr.length - 1];

  return (
    <div className="flex items-center gap-2">
      <div className="min-w-0">
        <p className="text-[10px] text-on-surface-muted truncate">{label}</p>
        <p className="text-[13px] font-semibold text-on-surface tabular-nums">
          {last} <span className="text-[10px] font-normal text-on-surface-muted">{unit}</span>
        </p>
      </div>
      <svg width={width} height={height} className="shrink-0">
        <polyline
          points={points}
          fill="none"
          stroke={color}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.8"
        />
        <circle
          cx={lastPoint.x}
          cy={lastPoint.y}
          r="2.5"
          fill={color}
        />
      </svg>
    </div>
  );
}
