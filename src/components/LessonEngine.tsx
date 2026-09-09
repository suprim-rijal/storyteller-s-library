import { useState } from "react";
import { AudioLines, Lightbulb, RotateCcw } from "lucide-react";
import { Badge, Button, Card, cn } from "@/design-system/nepali-kids";
import type { Exercise } from "@/lib/exercises";

interface Props {
  exercises: Exercise[];
  accent: "language" | "culture";
  romanization?: boolean;
  /** Quest mode keeps feedback minimal until the end. */
  quiet?: boolean;
  onFinish: (summary: { flowers: number; hintsUsed: number }) => void;
}

/**
 * One task per screen, infinite retries, a four-step hint ladder and no
 * hearts, lives or timers anywhere.
 */
export function LessonEngine({ exercises, accent, romanization = true, quiet, onFinish }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [hint, setHint] = useState(0);
  const [flowers, setFlowers] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [solved, setSolved] = useState<boolean[]>(() => exercises.map(() => false));

  const ex = exercises[step];
  if (!ex) return null;

  const chosen = selected === null ? null : ex.options[selected];
  const correct = chosen?.np === ex.target.np;
  const last = step === exercises.length - 1;

  const hintText = [
    "Listen again — the audio plays a little slower each time.",
    `One of these is right, one is close: ${ex.options
      .slice(0, 2)
      .map((o) => o.np)
      .join(" / ")}`,
    `Contrast: ${ex.target.np} is said “${ex.target.rom}”.`,
    `Model answer: ${ex.target.np} — ${ex.target.rom} — ${ex.target.en}. A new item like this comes back later.`,
  ];

  const next = () => {
    if (last) {
      onFinish({ flowers: flowers + (correct ? 1 : 0), hintsUsed });
      return;
    }
    setStep(step + 1);
    setSelected(null);
    setHint(0);
  };

  const pick = (i: number) => {
    setSelected(i);
    if (exercises[step]!.options[i]!.np === ex.target.np && !solved[step]) {
      setFlowers((f) => f + 1);
      setSolved((s) => s.map((v, idx) => (idx === step ? true : v)));
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <span className="flex gap-1.5" aria-label={`Step ${step + 1} of ${exercises.length}`}>
          {exercises.map((_, i) => (
            <span
              key={i}
              className={cn(
                "h-2.5 w-2.5 rounded-full",
                i < step ? "bg-grow" : i === step ? `bg-${accent}` : "bg-line",
              )}
            />
          ))}
        </span>
        <Badge tone="sun">{flowers} ✿ flowers</Badge>
        <Badge tone="neutral">{ex.mechanic}</Badge>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card accent={accent} bold className="flex flex-col items-center p-6">
          <div
            lang="ne"
            className={cn(
              "grid w-full place-items-center rounded-2xl px-4 py-10 text-center font-display text-5xl font-extrabold sm:text-6xl",
              accent === "language"
                ? "bg-language-soft text-language"
                : "bg-culture-soft text-culture",
            )}
          >
            {ex.show === "np" ? "🔊" : ex.target.np}
          </div>
          {romanization ? (
            <p className="mt-3 text-sm text-ink-soft">
              {ex.show === "np" ? "Tap to hear the word again" : ex.target.rom}
            </p>
          ) : null}
          <Button variant="grow" className="mt-4">
            <AudioLines size={18} /> Listen
          </Button>
        </Card>

        <div>
          <Badge tone={accent === "language" ? "language" : "culture"}>
            {ex.kind === "hear-find" ? "HEAR IT, FIND IT" : "WHAT DOES IT MEAN?"}
          </Badge>
          <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{ex.prompt}</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {ex.options.map((o, i) => {
              const isSel = selected === i;
              const isRight = o.np === ex.target.np;
              return (
                <button
                  key={o.np + i}
                  type="button"
                  onClick={() => pick(i)}
                  aria-pressed={isSel}
                  className={cn(
                    "min-h-14 rounded-card border-2 bg-surface p-4 text-left transition",
                    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language",
                    "hover:-translate-y-0.5 hover:shadow-[var(--shadow-soft)]",
                    isSel && !quiet && isRight && "border-grow bg-grow-soft",
                    isSel && !quiet && !isRight && "border-culture bg-culture-soft",
                    isSel && quiet && "border-language bg-language-soft",
                    !isSel && "border-line",
                  )}
                >
                  <span lang={ex.show === "np" ? "ne" : undefined} className="block font-display text-xl font-extrabold">
                    {ex.show === "np" ? o.np : o.en}
                  </span>
                  {romanization && ex.show === "np" ? (
                    <span className="mt-0.5 block text-xs text-ink-soft">{o.rom}</span>
                  ) : null}
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setHint((h) => Math.min(h + 1, hintText.length));
                setHintsUsed((h) => h + 1);
              }}
            >
              <Lightbulb size={16} /> Need a hint
            </Button>
            <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
              <RotateCcw size={16} /> Try again
            </Button>
            <span className="text-xs text-ink-soft">
              Hints never cost anything. You can try as many times as you like.
            </span>
          </div>

          {hint > 0 ? (
            <Card className="mt-4 bg-canvas p-4 text-sm">
              <p className="font-bold">Hint {hint}</p>
              <p className="mt-1 text-ink-soft">{hintText[hint - 1]}</p>
            </Card>
          ) : null}
        </div>
      </div>

      <div className="mt-8 min-h-20" aria-live="polite">
        {quiet && chosen ? (
          <Card className="flex flex-wrap items-center gap-4 bg-canvas p-5">
            <p className="text-sm text-ink-soft">
              Answer saved. You will see your skill profile at the end of the quest.
            </p>
            <Button variant={accent} size="sm" className="ml-auto" onClick={next}>
              {last ? "Finish quest →" : "Next task →"}
            </Button>
          </Card>
        ) : chosen && correct ? (
          <Card accent="grow" bold className="flex flex-wrap items-center gap-4 bg-grow-soft p-5">
            <p className="font-display font-extrabold text-grow">
              Shabash! {ex.target.np} — {ex.target.rom} — {ex.target.en}. ✿ +1 flower
            </p>
            <Button variant="grow" size="sm" className="ml-auto" onClick={next}>
              {last ? "Finish →" : "Next step →"}
            </Button>
          </Card>
        ) : chosen ? (
          <Card accent="culture" bold className="bg-culture-soft p-5">
            <p className="font-display font-extrabold text-culture">
              Close — “{chosen.np}” means “{chosen.en}”. Listen once more and try again.
            </p>
            <p className="mt-1 text-sm text-ink-soft">
              Nothing is lost. Errors just tell us which sound to practise next.
            </p>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
