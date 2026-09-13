import { useEffect, useRef, useState } from "react";
import { Loader2, Mic, MicOff, Square } from "lucide-react";
import { Button, cn } from "@/design-system/nepali-kids";

interface Props {
  /** The word the child should say. */
  target: { np: string; rom: string };
  /** Called after every try with whether the spoken word matched the target. */
  onResult: (matched: boolean) => void;
  label?: string;
}

const BARS = 12;

const stripDeva = (value: string) => value.replace(/[^\u0900-\u097F]/g, "");
const stripLatin = (value: string) => value.toLowerCase().replace(/[^a-z]/g, "");

function distance(a: string, b: string) {
  const rows = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array<number>(b.length).fill(0)]);
  for (let j = 0; j <= b.length; j += 1) rows[0]![j] = j;
  for (let i = 1; i <= a.length; i += 1) {
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      rows[i]![j] = Math.min(rows[i - 1]![j]! + 1, rows[i]![j - 1]! + 1, rows[i - 1]![j - 1]! + cost);
    }
  }
  return rows[a.length]![b.length]!;
}

/** A near match counts, so a small accent difference never blocks a correct answer. */
function isMatch(said: string, target: { np: string; rom: string }) {
  const deva = stripDeva(said);
  const wantDeva = stripDeva(target.np);
  if (deva && wantDeva) {
    if (deva.includes(wantDeva)) return true;
    if (distance(deva, wantDeva) <= 1) return true;
  }
  const latin = stripLatin(said);
  const wantLatin = stripLatin(target.rom);
  if (latin && wantLatin) {
    if (latin.includes(wantLatin)) return true;
    if (distance(latin, wantLatin) <= Math.max(1, Math.floor(wantLatin.length / 4))) return true;
  }
  return false;
}

/**
 * Push-to-talk practice mic. It shows a live level meter while the child speaks,
 * then checks the recording against the target word and says whether it matched.
 */
export function PushToTalk({ target, onResult, label = "Hold to speak" }: Props) {
  const [recording, setRecording] = useState(false);
  const [checking, setChecking] = useState(false);
  const [level, setLevel] = useState(0);
  const [note, setNote] = useState("");
  const [heard, setHeard] = useState("");
  const [status, setStatus] = useState<"idle" | "match" | "miss">("idle");
  const stream = useRef<MediaStream | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const raf = useRef<number | null>(null);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const cleanup = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    void ctx.current?.close();
    ctx.current = null;
    setLevel(0);
  };
  useEffect(() => cleanup, []);

  const check = async (blob: Blob) => {
    setChecking(true);
    try {
      const buffer = new Uint8Array(await blob.arrayBuffer());
      let binary = "";
      for (const byte of buffer) binary += String.fromCharCode(byte);
      const { transcribeSpeech } = await import("@/lib/transcribe.functions");
      const result = await transcribeSpeech({
        data: { audio: btoa(binary), mimeType: blob.type || "audio/webm" },
      });
      const said = result.text;
      setHeard(said);
      const matched = isMatch(said, target);
      setStatus(matched ? "match" : "miss");
      onResult(matched);
    } catch {
      setNote("We could not check the sound this time. Try once more, or use the no microphone button.");
      setStatus("idle");
    } finally {
      setChecking(false);
    }
  };

  const start = async () => {
    if (recording || checking) return;
    setNote("");
    setHeard("");
    setStatus("idle");
    if (!navigator.mediaDevices?.getUserMedia) {
      setNote("This device has no microphone we can use. Say the word out loud, then tap “I said it”.");
      return;
    }
    try {
      const media = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.current = media;
      const audioCtx = new AudioContext();
      ctx.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      audioCtx.createMediaStreamSource(media).connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        let peak = 0;
        for (const v of data) peak = Math.max(peak, Math.abs(v - 128) / 128);
        setLevel(peak);
        raf.current = requestAnimationFrame(tick);
      };
      tick();

      chunks.current = [];
      const rec = new MediaRecorder(media);
      recorder.current = rec;
      rec.ondataavailable = (event) => {
        if (event.data.size) chunks.current.push(event.data);
      };
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: rec.mimeType || "audio/webm" });
        if (blob.size > 800) void check(blob);
        else setNote("That was very short. Hold the button while you say the whole word.");
      };
      rec.start();
      setRecording(true);
    } catch {
      setNote("Microphone access is off. That is fine. Say the word out loud, then tap “I said it”.");
    }
  };

  const stop = () => {
    if (recorder.current && recorder.current.state !== "inactive") recorder.current.stop();
    recorder.current = null;
    cleanup();
    if (recording) setRecording(false);
  };

  return (
    <div className="rounded-card border-2 border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={recording ? "culture" : "grow"}
          disabled={checking}
          onMouseDown={() => void start()}
          onMouseUp={stop}
          onMouseLeave={() => recording && stop()}
          onTouchStart={(e) => {
            e.preventDefault();
            void start();
          }}
          onTouchEnd={stop}
          onKeyDown={(e) => {
            if (e.key === " " || e.key === "Enter") {
              e.preventDefault();
              void start();
            }
          }}
          onKeyUp={(e) => {
            if (e.key === " " || e.key === "Enter") stop();
          }}
          aria-pressed={recording}
        >
          {checking ? <Loader2 size={18} className="animate-spin" /> : recording ? <Square size={18} /> : <Mic size={18} />}
          {checking ? "Checking your word" : recording ? "Listening. Release to finish" : label}
        </Button>
        <Button variant="outline" size="sm" disabled={checking} onClick={() => { setStatus("idle"); setHeard(""); onResult(false); }}>
          <MicOff size={16} />
          I have no microphone
        </Button>
      </div>

      <div className="mt-4 flex h-10 items-end gap-1" aria-hidden="true">
        {Array.from({ length: BARS }).map((_, i) => {
          const active = recording && level * BARS > i;
          return (
            <span
              key={i}
              className={cn("w-full rounded-full transition-[height] duration-75", active ? "bg-grow" : "bg-line")}
              style={{ height: active ? `${18 + Math.min(level, 1) * 22}px` : "6px" }}
            />
          );
        })}
      </div>

      <p aria-live="polite" className="mt-2 text-xs text-ink-soft">
        {checking
          ? "Listening to your recording."
          : recording
            ? "We can hear you. Speak clearly and release when you are done."
            : status === "match"
              ? `That matched ${target.np}. Well said.`
              : status === "miss"
                ? `Not quite yet. We heard “${heard || "nothing clear"}”. Replay the model and try again.`
                : `Hold the button and say ${target.np} (${target.rom}).`}
      </p>
      {note ? <p className="mt-2 rounded-2xl bg-canvas p-3 text-xs text-ink-soft">{note}</p> : null}
    </div>
  );
}
