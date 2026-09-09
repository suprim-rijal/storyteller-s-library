import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { themes } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/setup/theme")({
  head: () => ({
    meta: [
      { title: "Choose your theme — Nepali Kids" },
      {
        name: "description",
        content:
          "Pick a visual theme, including a low-stimulation Calm Paper option that is always available.",
      },
      { property: "og:title", content: "Choose your theme — Nepali Kids" },
      { property: "og:description", content: "Child profile setup step three." },
    ],
  }),
  component: ThemeSetup,
});

function ThemeSetup() {
  const { state, update } = useProgress();
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Badge tone="language">Step 3 of 3</Badge>
      <h1 className="mt-3 font-display text-3xl font-extrabold">Choose your world</h1>
      <p className="mt-2 text-ink-soft">
        Themes only change colours and decorations — never how much you can learn.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {themes.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => update({ theme: t.id })}
            aria-pressed={state.theme === t.id}
            className={
              "rounded-card border-2 bg-surface p-5 text-left transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language " +
              (state.theme === t.id ? "border-culture bg-culture-soft" : "border-line")
            }
          >
            <span className="block font-display text-lg font-extrabold">{t.name}</span>
            <span className="block text-sm text-ink-soft">{t.desc}</span>
          </button>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <Button variant="grow" onClick={() => navigate({ to: "/adult/consent" })}>
          Next: grown-up check →
        </Button>
      </Card>
    </main>
  );
}
