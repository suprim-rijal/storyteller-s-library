import type { HTMLAttributes } from "react";
import { cn } from "./utils";

export type BadgeTone =
  | "language"
  | "culture"
  | "grow"
  | "sun"
  | "dream"
  | "neutral";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const tones: Record<BadgeTone, string> = {
  language: "bg-language-soft text-language",
  culture: "bg-culture-soft text-culture",
  grow: "bg-grow-soft text-grow",
  sun: "bg-sun-soft text-sun",
  dream: "bg-dream-soft text-dream",
  neutral: "bg-canvas text-ink-soft",
};

/** Small status pill: counts, mastery states, chapter status. */
export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
