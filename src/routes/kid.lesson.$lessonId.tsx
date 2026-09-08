import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { X, AudioLines } from "lucide-react";
import { Badge, Button, Card, cn } from "@/design-system/nepali-kids";
import mango from "@/assets/illustrations/mango.png";

export const Route = createFileRoute("/kid/lesson/$lessonId")({
  head: () => ({
    meta: [
      { title: "Lesson: Vowels — Nepali Kids" },
      {
        name: "description",
        content:
          "Listen to the Devanagari vowel and tap the matching word. Infinite retries, no lives.",
      },
      { property: "og:title", content: "Lesson: Vowels — Nepali Kids" },
      {
        property: "og:description",
        content: "The core Nepali Kids lesson player: hear it, find it.",
      },
    ],
  }),
  component: LessonPlayer,
});

const options = [
  { np: "आम", en: "Aap (Mango)", correct: true },
  { np: "कुकुर", en: "Kukur (Dog)", correct: false },
  { np: "स्याउ", en: "Syaau (Apple)", correct: false },
  { np: "घर", en: "Ghar (House)", correct: false },
];

const steps = [true, true, true, false, false, false, false];

function LessonPlayer() {
  const [selected, setSelected] = useState<number | null>(null);
  const chosen = selected === null ? null : options[selected];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 grid grid-cols-[auto_1fr_auto] items-center gap-4 border-b border-line bg-surface px-4 py-3">
        <Link
          to="/kid/home"
          aria-label="Close lesson"
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-line text-ink-soft hover:bg-canvas"
        >
          <X size={17} />
        </Link>
        <div className="flex min-w-0 items-center gap-3">
          <span className="truncate font-display text-sm font-extrabold sm:text-base">
            Chapter 2: Lesson 1 Vowels
          </span>
          <span className="ml-auto flex gap-1.5" aria-label="Lesson progress">
            {steps.map((done, i) => (
              <span
                key={i}
                className={cn(
                  "h-2.5 w-2.5 rounded-full",
                  done ? "bg-grow" : "bg-line",
                )}
              />
            ))}
          </span>
        </div>
        <Badge tone="sun">3 / 7 Flowers</Badge>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <Card accent="language" bold className="flex flex-col items-center p-6">
            <div className="grid aspect-square w-full max-w-[220px] place-items-center rounded-2xl bg-language-soft font-display text-8xl font-extrabold text-language">
              अ
            </div>
            <Button variant="grow" className="mt-5">
              <AudioLines size={18} /> Listen to sound
            </Button>
          </Card>

          <div>
            <Badge tone="grow">WHAT SOUND IS THIS?</Badge>
            <h1 className="mt-3 font-display text-3xl font-extrabold">
              Tap the correct word for 'अ'
            </h1>
            <Card className="mt-5 flex items-center gap-4 bg-canvas p-4">
              <img
                src={mango}
                alt="A ripe mango"
                loading="lazy"
                width={512}
                height={512}
                className="h-14 w-14 shrink-0 object-contain"
              />
              <div className="min-w-0">
                <p className="font-bold">आम (Mango)</p>
                <p className="text-sm text-ink-soft">
                  Starts with 'अ' sound. Can you find it below?
                </p>
              </div>
            </Card>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {options.map((o, i) => {
            const isSelected = selected === i;
            return (
              <button
                key={o.np}
                type="button"
                onClick={() => setSelected(i)}
                aria-pressed={isSelected}
                className={cn(
                  "rounded-card border-2 bg-surface p-6 text-center transition",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language",
                  "hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]",
                  isSelected && o.correct && "border-grow bg-grow-soft",
                  isSelected && !o.correct && "border-culture bg-culture-soft",
                  !isSelected && "border-line",
                )}
              >
                <span
                  className={cn(
                    "block font-display text-3xl font-extrabold",
                    isSelected && o.correct ? "text-grow" : "text-ink",
                  )}
                >
                  {o.np}
                </span>
                <span className="mt-1 block text-xs font-bold text-ink-soft">{o.en}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-8 min-h-16" aria-live="polite">
          {chosen?.correct ? (
            <Card accent="grow" bold className="flex flex-wrap items-center gap-4 bg-grow-soft p-5">
              <p className="font-display font-extrabold text-grow">
                Shabash! 'आम' begins with अ. ✿ +1 flower
              </p>
              <Button variant="grow" size="sm" className="ml-auto">
                Next step →
              </Button>
            </Card>
          ) : chosen ? (
            <Card accent="culture" bold className="bg-culture-soft p-5">
              <p className="font-display font-extrabold text-culture">
                Close! '{chosen.np}' starts with a different sound. Listen again and
                try as many times as you like.
              </p>
            </Card>
          ) : null}
        </div>
      </main>
    </div>
  );
}
