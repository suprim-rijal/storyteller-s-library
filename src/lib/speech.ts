let cached: SpeechSynthesisVoice[] = [];

export function speechSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  if (!speechSupported()) return Promise.resolve([]);
  const now = window.speechSynthesis.getVoices();
  if (now.length) {
    cached = now;
    return Promise.resolve(now);
  }
  return new Promise((resolve) => {
    const done = () => {
      cached = window.speechSynthesis.getVoices();
      resolve(cached);
    };
    window.speechSynthesis.addEventListener("voiceschanged", done, { once: true });
    window.setTimeout(done, 1200);
  });
}

// Nepali voices are rare. Hindi shares the Devanagari script and reads the words
// closely enough to be a useful model, so it is the first fallback.
function pickVoice(lang: string, voices: SpeechSynthesisVoice[]) {
  const wanted = lang.toLowerCase();
  const order = wanted.startsWith("ne") ? ["ne", "hi", "mr", "bn", "en"] : [wanted.slice(0, 2), "en"];
  for (const prefix of order) {
    const match = voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(prefix));
    if (match) return match;
  }
  return voices[0] ?? null;
}

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onUnavailable?: () => void;
}

export async function speak(text: string, options: SpeakOptions = {}) {
  const { lang = "ne-NP", rate = 0.9, onStart, onEnd, onUnavailable } = options;
  if (!speechSupported() || !text.trim()) {
    onUnavailable?.();
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = await loadVoices();
  const voice = pickVoice(lang, voices);
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = voice?.lang ?? lang;
  if (voice) utterance.voice = voice;
  utterance.rate = rate;
  let started = false;
  utterance.onstart = () => {
    started = true;
    onStart?.();
  };
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => {
    onEnd?.();
    if (!started) onUnavailable?.();
  };
  // Chrome keeps the queue paused after some navigations.
  if (synth.paused) synth.resume();
  synth.speak(utterance);
  window.setTimeout(() => {
    if (!started && !synth.speaking) onUnavailable?.();
  }, 1500);
}

export function stopSpeaking() {
  if (speechSupported()) window.speechSynthesis.cancel();
  if (current) {
    current.pause();
    current = null;
  }
}

let current: HTMLAudioElement | null = null;
const clipCache = new Map<string, string>();

async function hasDevanagariVoice() {
  const voices = await loadVoices();
  return voices.some((v) => /^(ne|hi|mr|bn)/i.test(v.lang.replace("_", "-")));
}

export interface SpeakWordOptions extends SpeakOptions {
  slow?: boolean;
  /** Read aloud in English when no Nepali voice can be produced. */
  englishFallback?: string;
}

/**
 * Plays the real Nepali word using Lovable AI. If that is unavailable, it uses a
 * Devanagari device voice, and finally reads the English meaning aloud.
 */
export async function speakWord(text: string, options: SpeakWordOptions = {}) {
  const { slow, englishFallback, onStart, onEnd, onUnavailable, ...rest } = options;
  if (!text.trim()) {
    onUnavailable?.();
    return;
  }
  stopSpeaking();

  const key = `${text}|${slow ? "slow" : "normal"}`;
  try {
    let src = clipCache.get(key);
    if (!src) {
      const { speakWithAi } = await import("./tts.functions");
      const result = await speakWithAi({ data: { text, slow } });
      src = `data:${result.mimeType};base64,${result.audio}`;
      clipCache.set(key, src);
    }
    const audio = new Audio(src);
    current = audio;
    audio.onended = () => {
      if (current === audio) current = null;
      onEnd?.();
    };
    onStart?.();
    await audio.play();
    return;
  } catch {
    // Fall through to the device voice below.
  }

  if (await hasDevanagariVoice()) {
    await speak(text, { ...rest, onStart, onEnd, onUnavailable });
    return;
  }
  if (englishFallback) {
    await speak(englishFallback, { ...rest, lang: "en-US", onStart, onEnd, onUnavailable });
    return;
  }
  onUnavailable?.();
}
