import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function Ring({
  value,
  target,
  size = 168,
  thickness = 14,
  label,
  sublabel,
  tone = "primary",
  children,
}: {
  value: number;
  target: number;
  size?: number;
  thickness?: number;
  label?: string;
  sublabel?: string;
  tone?: "primary" | "protein" | "carbs" | "fat" | "water" | "flame";
  children?: ReactNode;
}) {
  const pct = target > 0 ? Math.min(1, value / target) : 0;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          className="stroke-muted"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - pct)}
          className={cn(
            "transition-[stroke-dashoffset] duration-700 ease-out",
            tone === "primary" && "stroke-primary",
            tone === "protein" && "stroke-protein",
            tone === "carbs" && "stroke-carbs",
            tone === "fat" && "stroke-fat",
            tone === "water" && "stroke-water",
            tone === "flame" && "stroke-flame",
          )}
        />
      </svg>
      <div className="absolute inset-0 grid place-content-center text-center">
        {children ?? (
          <>
            <div className="font-display text-3xl leading-none font-bold tabular-nums">
              {Math.round(value)}
            </div>
            {label ? (
              <div className="mt-1 text-xs font-medium text-muted-foreground">{label}</div>
            ) : null}
            {sublabel ? <div className="text-[11px] text-muted-foreground">{sublabel}</div> : null}
          </>
        )}
      </div>
    </div>
  );
}

export function MacroBar({
  label,
  value,
  target,
  unit = "g",
  tone,
}: {
  label: string;
  value: number;
  target: number;
  unit?: string;
  tone: "protein" | "carbs" | "fat" | "primary" | "water";
}) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate text-xs font-semibold tracking-wide uppercase text-muted-foreground">
          {label}
        </span>
        <span className="shrink-0 text-xs font-semibold tabular-nums">
          {Math.round(value)}
          <span className="text-muted-foreground">
            /{Math.round(target)}
            {unit}
          </span>
        </span>
      </div>
      <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "h-full rounded-full transition-[width] duration-700 ease-out",
            tone === "protein" && "bg-protein",
            tone === "carbs" && "bg-carbs",
            tone === "fat" && "bg-fat",
            tone === "primary" && "bg-primary",
            tone === "water" && "bg-water",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-xl font-bold sm:text-2xl">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-muted-foreground line-clamp-2">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  icon,
  label,
  value,
  hint,
  tone = "primary",
}: {
  icon: ReactNode;
  label: string;
  value: string;
  hint?: string;
  tone?: "primary" | "accent" | "flame" | "water";
}) {
  return (
    <div className="surface-card hover-lift p-4">
      <div
        className={cn(
          "grid h-9 w-9 place-items-center rounded-xl",
          tone === "primary" && "bg-primary/12 text-primary",
          tone === "accent" && "bg-accent/25 text-accent-foreground",
          tone === "flame" && "bg-flame/15 text-flame",
          tone === "water" && "bg-water/15 text-water",
        )}
      >
        {icon}
      </div>
      <div className="mt-3 font-display text-2xl font-bold tabular-nums">{value}</div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      {hint ? <div className="mt-1 text-[11px] text-muted-foreground/80">{hint}</div> : null}
    </div>
  );
}

export function Chip({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "press shrink-0 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-glow"
          : "border-border bg-card text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function EmptyState({
  emoji,
  title,
  body,
  action,
}: {
  emoji: string;
  title: string;
  body: string;
  action?: ReactNode;
}) {
  return (
    <div className="surface-card grid place-items-center px-6 py-12 text-center">
      <div className="text-4xl">{emoji}</div>
      <h3 className="mt-3 text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}