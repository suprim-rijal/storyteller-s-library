import { useEffect, useRef, useState } from "react";
import { Mic, MicOff, Square } from "lucide-react";
import { Button, cn } from "@/design-system/nepali-kids";

interface Props {
  /** Called when the child finishes a try. Speaking is never scored or blocked. */
  onSpoke: () => void;
  label?: string;
}

const BARS = 12;

/**
 * Push-to-talk practice mic. It shows a live level meter while the child speaks
 * and always lets them continue, with or without a working microphone.
 */
export function PushToTalk({ onSpoke, label = "Hold to speak" }: Props) {
  const [recording, setRecording] = useState(false);
  const [level, setLevel] = useState(0);
  const [note, setNote] = useState("");
  const [tried, setTried] = useState(false);
  const stream = useRef<MediaStream | null>(null);
  const ctx = useRef<AudioContext | null>(null);
  const raf = useRef<number | null>(null);

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

  const start = async () => {
    if (recording) return;
    setNote("");
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
      setRecording(true);
    } catch {
      setNote("Microphone access is off. That is fine. Say the word out loud, then tap “I said it”.");
    }
  };

  const stop = () => {
    cleanup();
    if (recording) {
      setRecording(false);
      setTried(true);
      onSpoke();
    }
  };

  return (
    <div className="rounded-card border-2 border-line bg-surface p-5">
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant={recording ? "culture" : "grow"}
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
          {recording ? <Square size={18} /> : <Mic size={18} />}
          {recording ? "Listening. Release to finish" : label}
        </Button>
        <Button variant="outline" size="sm" onClick={() => { setTried(true); onSpoke(); }}>
          <MicOff size={16} />
          I said it without the mic
        </Button>
      </div>

      <div className="mt-4 flex h-10 items-end gap-1" aria-hidden="true">
        {Array.from({ length: BARS }).map((_, i) => {
          const active = recording && level * BARS > i;
          return (
            <span
              key={i}
              className={cn(
                "w-full rounded-full transition-[height] duration-75",
                active ? "bg-grow" : "bg-line",
              )}
              style={{ height: active ? `${18 + Math.min(level, 1) * 22}px` : "6px" }}
            />
          );
        })}
      </div>

      <p aria-live="polite" className="mt-2 text-xs text-ink-soft">
        {recording
          ? "We can hear you. Speak clearly and release when you are done."
          : tried
            ? "Nice try. Speaking is never scored, so you can keep going."
            : "Hold the button and say the word. Nothing is recorded or graded."}
      </p>
      {note ? <p className="mt-2 rounded-2xl bg-canvas p-3 text-xs text-ink-soft">{note}</p> : null}
    </div>
  );
}
