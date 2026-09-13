import * as ProgressPrimitive from "@radix-ui/react-progress";
import { cn } from "./utils";

export function Progress({ value = 0, className, label }: { value?: number; className?: string; label?: string }) {
  const safe = Math.max(0, Math.min(100, value));
  return <ProgressPrimitive.Root value={safe} aria-label={label} className={cn("h-2.5 overflow-hidden rounded-full bg-line", className)}><ProgressPrimitive.Indicator className="h-full rounded-full bg-language" style={{ transform: `translateX(-${100 - safe}%)` }} /></ProgressPrimitive.Root>;
}