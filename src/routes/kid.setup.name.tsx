import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { ageBands } from "@/data/curriculum";
import { useProgress } from "@/lib/progress";

export const Route = createFileRoute("/kid/setup/name")({
  head: () => ({
    meta: [
      { title: "Your name and age band — Nepali Kids" },
      {
        name: "description",
        content:
          "Choose a display name and an age band that sets session length, reading load and tap-target size.",
      },
      { property: "og:title", content: "Your name and age band — Nepali Kids" },
      { property: "og:description", content: "Child profile setup step two." },
    ],
  }),
  component: NameSetup,
});

function NameSetup() {
  const { state, update } = useProgress();
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Badge tone="language">Step 2 of 2</Badge>
      <h1 className="mt-3 font-display text-3xl font-extrabold">What shall we call you?</h1>
      <p className="mt-2 text-ink-soft">
        Use a first name or a nickname. Nothing here is ever shown to other children.
      </p>

      <Card className="mt-6 p-5">
        <label htmlFor="name" className="text-sm font-bold">
          Display name
        </label>
        <input
          id="name"
          value={state.name}
          onChange={(e) => update({ name: e.target.value })}
          className="mt-2 h-12 w-full rounded-full border-2 border-line px-5 text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language"
          maxLength={24}
        />
      </Card>

      <h2 className="mt-8 font-display text-xl font-extrabold">How old are you?</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {ageBands.map((b) => (
          <button
            key={b.id}
            type="button"
            onClick={() => update({ ageBand: b.id })}
            aria-pressed={state.ageBand === b.id}
            className={
              "rounded-card border-2 bg-surface p-5 text-left transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language " +
              (state.ageBand === b.id ? "border-grow bg-grow-soft" : "border-line")
            }
          >
            <span className="block font-display text-lg font-extrabold">{b.name}</span>
            <span className="block text-sm font-bold text-ink-soft">Ages {b.ages}</span>
            <span className="mt-2 block text-xs text-ink-soft">{b.session}</span>
            <span className="mt-1 block text-xs text-ink-soft">{b.reading}</span>
          </button>
        ))}
      </div>

      <Card className="mt-6 flex flex-wrap items-center gap-4 p-5">
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={state.romanization}
            onChange={(e) => update({ romanization: e.target.checked })}
            className="h-5 w-5"
          />
          Show romanization under Nepali words
        </label>
        <label className="flex items-center gap-2 text-sm font-bold">
          <input
            type="checkbox"
            checked={state.reducedMotion}
            onChange={(e) => update({ reducedMotion: e.target.checked })}
            className="h-5 w-5"
          />
          Calm mode: less motion and sound
        </label>
        <Button
          variant="grow"
          className="ml-auto"
          onClick={() => navigate({ to: "/adult/consent" })}
        >
          Next: grown-up check →
        </Button>
      </Card>
    </main>
  );
}
