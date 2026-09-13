import { useEffect, useState } from "react";
import { AudioLines, Keyboard, Lightbulb, Pause, Play, RotateCcw, Volume2 } from "lucide-react";
import { Badge, Button, Card, cn } from "@/design-system/nepali-kids";
import { PushToTalk } from "@/components/PushToTalk";
import { speakWord, stopSpeaking } from "@/lib/speech";
import type { Exercise } from "@/lib/exercises";

type Scores = { accuracy: number; independence: number; matraPlacement: number; strokeOrder: number; retries: number };
interface Props { exercises: Exercise[]; accent: "language" | "culture"; romanization?: boolean; quiet?: boolean; reducedMotion?: boolean; onFinish: (summary: { flowers: number; hintsUsed: number; scores: Scores }) => void; }

export function LessonEngine({ exercises, accent, romanization = true, quiet, reducedMotion, onFinish }: Props) {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [typed, setTyped] = useState("");
  const [echoDone, setEchoDone] = useState(false);
  const [echoTries, setEchoTries] = useState(0);
  const [hint, setHint] = useState(0);
  const [flowers, setFlowers] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [scores, setScores] = useState<Scores>({ accuracy: 0, independence: 0, matraPlacement: 0, strokeOrder: 0, retries: 0 });
  const [solved, setSolved] = useState<boolean[]>(() => exercises.map(() => false));
  const ex = exercises[step];

  const [audioNote, setAudioNote] = useState("");
  useEffect(() => () => stopSpeaking(), []);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!ex || ex.kind === "typing" || ex.kind === "echo") return;
      const index = Number(event.key) - 1;
      if (index >= 0 && index < ex.options.length) pick(index);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });
  if (!ex) return null;

  const chosen = selected === null ? null : ex.options[selected];
  const correct = ex.kind === "typing" ? typed.trim() === ex.target.np : ex.kind === "echo" ? echoDone : chosen?.np === ex.target.np;
  const last = step === exercises.length - 1;
  const listening = ex.kind === "hear-find" || ex.kind === "typing";
  const speak = (text = ex.target.np, lang = "ne-NP") => {
    setAudioNote("");
    void speakWord(text, {
      lang,
      slow: reducedMotion || hint > 0,
      englishFallback: lang === "ne-NP" ? `${ex.target.rom}. It means ${ex.target.en}.` : text,
      rate: reducedMotion ? 0.75 : Math.max(0.65, 0.9 - hint * 0.06),
      onStart: () => { setPlaying(true); setAudioNote(""); },
      onEnd: () => setPlaying(false),
      onUnavailable: () => { setPlaying(false); setAudioNote("This device cannot play sound right now. Read the word and its spelling instead."); },
    });
  };
  const stop = () => { stopSpeaking(); setPlaying(false); };
  const markSolved = () => {
    if (!solved[step]) {
      setFlowers((f) => f + 1); setSolved((s) => s.map((v, idx) => idx === step ? true : v));
      setScores((s) => ({ ...s, accuracy: s.accuracy + 1, independence: s.independence + (hint === 0 ? 1 : 0), matraPlacement: s.matraPlacement + (ex.dimensions.includes("matraPlacement") ? 1 : 0), strokeOrder: s.strokeOrder + (ex.dimensions.includes("strokeOrder") ? 1 : 0) }));
    }
  };
  const pick = (i: number) => { setSelected(i); setAttempts((n) => n + 1); if (ex.options[i]?.np === ex.target.np) markSolved(); else setScores((s) => ({ ...s, retries: s.retries + 1 })); };
  const submitTyped = () => { setAttempts((n) => n + 1); if (typed.trim() === ex.target.np) markSolved(); else setScores((s) => ({ ...s, retries: s.retries + 1 })); };
  const next = () => { if (last) return onFinish({ flowers, hintsUsed, scores }); setStep((n) => n + 1); setSelected(null); setTyped(""); setEchoDone(false); setEchoTries(0); setHint(0); setAttempts(0); stop(); };
  const onSpoken = (matched: boolean) => { setEchoTries((n) => n + 1); setAttempts((n) => n + 1); if (matched) { setEchoDone(true); markSolved(); } else setScores((s) => ({ ...s, retries: s.retries + 1 })); };
  const hintText = ["Replay the model and listen for the first sound.", `Look closely at: ${ex.options.slice(0, 2).map((o) => o.np).join(" / ")}`, `The word sounds like “${ex.target.rom}”.`, `Model answer: ${ex.target.np}, ${ex.target.rom}, ${ex.target.en}.`];

  return <div className="mx-auto max-w-3xl">
    <div className="flex flex-wrap items-center gap-3"><span className="flex gap-1.5" aria-label={`Step ${step + 1} of ${exercises.length}`}>{exercises.map((_, i) => <span key={i} className={cn("h-2.5 w-2.5 rounded-full", i < step ? "bg-grow" : i === step ? accent === "language" ? "bg-language" : "bg-culture" : "bg-line")} />)}</span><Badge tone="sun">{flowers} ✿ flowers</Badge><Badge>{ex.mechanic}</Badge></div>

    <div className="mt-6">
      <Badge tone={accent}>{ex.mechanic.toUpperCase()}</Badge>
      <p className="mt-3 flex items-start gap-2 rounded-2xl bg-canvas p-3 text-sm text-ink-soft"><Keyboard size={17} className="mt-0.5 shrink-0" />{ex.instructions_text}</p>
      <h2 className="mt-4 text-2xl font-extrabold sm:text-3xl">{ex.prompt}</h2>

      {!listening ? <Card accent={accent} bold className="mt-5 flex flex-col items-center p-5">
        <span lang="ne" className={cn("block text-center text-5xl font-extrabold sm:text-6xl", accent === "language" ? "text-language" : "text-culture")}>{ex.target.np}</span>
        {romanization ? <p className="mt-2 text-sm text-ink-soft">{ex.target.rom}</p> : null}
      </Card> : null}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <Button variant="grow" size="sm" onClick={() => speak()}><AudioLines size={17} />Replay word</Button>
        <Button variant="outline" size="sm" onClick={playing ? stop : () => speak(ex.instructions_audio, "en-US")}>{playing ? <Pause size={16} /> : <Play size={16} />}{playing ? "Pause" : "Instructions"}</Button>
        <span aria-live="polite" className="text-xs text-ink-soft">{playing ? "Audio is playing" : "Audio is paused"}</span>
      </div>
      {audioNote ? <p className="mt-2 rounded-2xl bg-canvas p-3 text-xs text-ink-soft">{audioNote}{listening ? ` The word is ${ex.target.np} (${ex.target.rom}).` : ""}</p> : null}

      {ex.kind === "typing" ? <div className="mt-5 flex gap-3"><input lang="ne" value={typed} onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => e.key === "Enter" && submitTyped()} className="h-14 min-w-0 flex-1 rounded-2xl border-2 border-line px-4 text-xl outline-none focus:border-language" aria-label="Type your answer" /><Button onClick={submitTyped}>Check</Button></div>
        : ex.kind === "echo" ? <div className="mt-5"><PushToTalk target={ex.target} onResult={onSpoken} label={`Hold to say ${ex.target.rom}`} />{!echoDone && echoTries >= 3 ? <div className="mt-3 flex flex-wrap items-center gap-3"><Button variant="outline" size="sm" onClick={next}>Move on for now</Button><span className="text-xs text-ink-soft">You can come back to this word later.</span></div> : null}</div>
        : <div className="mt-5 grid gap-3 sm:grid-cols-2">{ex.options.map((o, i) => { const isSel = selected === i; const right = o.np === ex.target.np; return <div key={o.np + i} className={cn("flex items-center gap-2 rounded-card border-2 bg-surface p-3", isSel && !quiet && right && "border-grow bg-grow-soft", isSel && !quiet && !right && "border-culture bg-culture-soft", isSel && quiet && "border-language bg-language-soft", !isSel && "border-line")}>
            <button type="button" onClick={() => pick(i)} className="min-h-11 min-w-0 flex-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language">
              <span className="mr-2 text-xs text-ink-soft">{i + 1}</span>
              <span lang={ex.show === "np" ? "ne" : undefined} className="text-xl font-extrabold">{ex.show === "np" ? o.np : o.en}</span>
              {romanization && ex.show === "np" ? <span className="mt-0.5 block text-xs text-ink-soft">{o.rom}</span> : null}
            </button>
            <button type="button" aria-label={`Hear option ${i + 1}`} onClick={() => speak(o.np)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-line text-ink-soft hover:bg-canvas focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language"><Volume2 size={17} /></button>
          </div>; })}</div>}

      <div className="mt-4 flex flex-wrap items-center gap-3"><Button variant="outline" size="sm" onClick={() => { setHint((h) => Math.min(h + 1, 4)); setHintsUsed((h) => h + 1); }}><Lightbulb size={16} />Hint {Math.min(hint + 1, 4)}</Button><Button variant="outline" size="sm" onClick={() => { setSelected(null); setTyped(""); setEchoDone(false); }}><RotateCcw size={16} />Try again</Button><span className="text-xs text-ink-soft">Unlimited tries. Hints never cost anything.</span></div>
      {hint > 0 ? <Card className="mt-4 bg-canvas p-4 text-sm"><p className="font-bold">Hint {hint}</p><p className="mt-1 text-ink-soft">{hintText[hint - 1]}</p></Card> : null}
    </div>

    <div className="mt-8 min-h-20" aria-live="polite">{correct ? <Card accent="grow" bold className="flex flex-wrap items-center gap-4 bg-grow-soft p-5"><p className="font-extrabold text-grow">{quiet ? "Answer saved." : `Shabash! ${ex.target.np} means ${ex.target.en}.`}</p><Button variant="grow" size="sm" className="ml-auto" onClick={next}>{last ? "Finish" : "Next step"}</Button></Card> : attempts > 0 ? <Card accent="culture" bold className="bg-culture-soft p-5"><p className="font-extrabold text-culture">Not yet. Replay the model or open a hint, then try again.</p></Card> : null}</div>
  </div>;
}
