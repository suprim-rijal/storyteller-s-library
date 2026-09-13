import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Badge, Button, Card, cn } from "@/design-system/nepali-kids";
import { useProgress } from "@/lib/progress";
import yak from "@/assets/illustrations/yak-mascot.png";

export const Route = createFileRoute("/kid/setup/guide")({
  head: () => ({
    meta: [
      { title: "Choose your guide. Nepali Kids" },
      {
        name: "description",
        content: "Pick a friendly learning companion from a safe, pre-defined list of guides.",
      },
      { property: "og:title", content: "Choose your guide. Nepali Kids" },
      { property: "og:description", content: "Avatar and guide selection during child setup." },
    ],
  }),
  component: GuideSetup,
});

const guides = [
  { id: "yaju", name: "Yaju the Yak", desc: "Steady, patient, loves high trails." },
  { id: "gainthali", name: "Gainthali the Bird", desc: "Sings every new sound with you." },
  { id: "bhalu", name: "Bhalu the Red Panda", desc: "Curious about every festival." },
  { id: "hattisar", name: "Hatti the Elephant", desc: "Remembers every word you learn." },
];

function GuideSetup() {
  const { state, update } = useProgress();
  const navigate = useNavigate();

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <Badge tone="language">Step 1 of 2</Badge>
      <h1 className="mt-3 font-display text-3xl font-extrabold">Who will climb with you?</h1>
      <p className="mt-2 text-ink-soft">
        Your guide cheers you on. You can change them later in “Me”.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {guides.map((g) => (
          <button
            key={g.id}
            type="button"
            onClick={() => update({ guide: g.id })}
            aria-pressed={state.guide === g.id}
            className={cn(
              "rounded-card border-2 bg-surface p-5 text-left transition hover:-translate-y-0.5",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language",
              state.guide === g.id ? "border-language bg-language-soft" : "border-line",
            )}
          >
            <img
              src={yak}
              alt=""
              width={768}
              height={768}
              className="h-20 w-20 object-contain"
              loading="lazy"
            />
            <span className="mt-2 block font-display text-lg font-extrabold">{g.name}</span>
            <span className="block text-sm text-ink-soft">{g.desc}</span>
          </button>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <Button variant="grow" onClick={() => navigate({ to: "/kid/setup/name" })}>
          Next: my name →
        </Button>
      </Card>
    </main>
  );
}
