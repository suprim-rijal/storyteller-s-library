import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "./utils";

export type CardAccent =
  | "none"
  | "language"
  | "culture"
  | "grow"
  | "sun"
  | "dream";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: CardAccent;
  /** Thick 2px+ colored border, used for the playful kid surfaces. */
  bold?: boolean;
  translucent?: boolean;
}

const accents: Record<CardAccent, string> = {
  none: "border-line",
  language: "border-language",
  culture: "border-culture",
  grow: "border-grow",
  sun: "border-sun",
  dream: "border-dream",
};

/** Rounded surface used for every panel in the product. */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, accent = "none", bold, translucent, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-card shadow-[var(--shadow-soft)]",
        bold ? "border-2" : "border",
        accents[accent],
        translucent ? "bg-surface/85 backdrop-blur-sm" : "bg-surface",
        className,
      )}
      {...props}
    />
  ),
);
Card.displayName = "Card";
