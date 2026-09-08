import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "./utils";

export type ButtonVariant =
  | "language"
  | "culture"
  | "grow"
  | "sun"
  | "quiet"
  | "outline";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  language: "bg-language text-white hover:bg-language/90",
  culture: "bg-culture text-white hover:bg-culture/90",
  grow: "bg-grow text-white hover:bg-grow/90",
  sun: "bg-sun text-white hover:bg-sun/90",
  quiet: "bg-language-soft text-language hover:bg-language-soft/70",
  outline: "border-2 border-line bg-surface text-ink hover:bg-canvas",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-5 text-base",
  lg: "h-14 px-7 text-lg",
};

/** Primary action control. Variants map to the two learning tracks plus supporting roles. */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "language", size = "md", fullWidth, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-display font-bold transition",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language",
        "disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className,
      )}
      {...props}
    />
  ),
);
Button.displayName = "Button";
