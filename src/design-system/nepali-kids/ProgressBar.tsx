import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  tone?: "language" | "culture" | "grow" | "sun";
  label?: string;
}

const tones = {
  language: "bg-language",
  culture: "bg-culture",
  grow: "bg-grow",
  sun: "bg-sun",
};

/** Horizontal progress indicator. Never framed as a deadline or score. */
export function ProgressBar({
  value,
  max = 100,
  tone = "language",
  label,
  className,
  ...props
}: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={label}
      className={cn("h-2.5 w-full overflow-hidden rounded-full bg-line", className)}
      {...props}
    >
      <div
        className={cn("h-full rounded-full transition-all", tones[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
