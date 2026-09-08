import { Card } from "./Card";

export interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
}

/** Calm metric tile for the adult portal. No comparison, no ranking. */
export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <Card className="p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className="mt-2 font-display text-3xl font-extrabold text-ink">{value}</p>
      {hint ? <p className="mt-1 text-xs text-ink-soft">{hint}</p> : null}
    </Card>
  );
}
