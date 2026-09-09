import { useCallback, useEffect, useState } from "react";
import { allModules, getModule, trackModules, type TrackId } from "@/data/curriculum";

export interface ProgressState {
  name: string;
  ageBand: string;
  guide: string;
  theme: string;
  romanization: boolean;
  reducedMotion: boolean;
  onboarded: boolean;
  xp: number;
  completedLessons: string[];
  masteredModules: string[];
  badges: string[];
  rhythmDays: string[];
  reviewDue: string[];
}

const KEY = "nepali-kids-progress-v1";

export const defaultProgress: ProgressState = {
  name: "Aarav",
  ageBand: "explorers",
  guide: "yaju",
  theme: "mountain-sky",
  romanization: true,
  reducedMotion: false,
  onboarded: false,
  xp: 0,
  completedLessons: [],
  masteredModules: [],
  badges: [],
  rhythmDays: [],
  reviewDue: [],
};

function read(): ProgressState {
  if (typeof window === "undefined") return defaultProgress;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? { ...defaultProgress, ...(JSON.parse(raw) as ProgressState) } : defaultProgress;
  } catch {
    return defaultProgress;
  }
}

/**
 * Client-side learner progress. Completion is never treated as mastery:
 * mastery is only set by finishing a module quest.
 */
export function useProgress() {
  const [state, setState] = useState<ProgressState>(defaultProgress);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(read());
    setHydrated(true);
  }, []);

  const update = useCallback((patch: Partial<ProgressState>) => {
    setState((prev) => {
      const next = { ...prev, ...patch };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* storage unavailable — the session still works */
      }
      return next;
    });
  }, []);

  const today = new Date().toISOString().slice(0, 10);

  const completeLesson = useCallback(
    (lessonId: string, xp: number) => {
      setState((prev) => {
        const done = prev.completedLessons.includes(lessonId);
        const next: ProgressState = {
          ...prev,
          xp: prev.xp + (done ? Math.round(xp * 0.2) : xp),
          completedLessons: done ? prev.completedLessons : [...prev.completedLessons, lessonId],
          rhythmDays: prev.rhythmDays.includes(today)
            ? prev.rhythmDays
            : [...prev.rhythmDays, today],
          reviewDue: prev.reviewDue.includes(lessonId)
            ? prev.reviewDue
            : [...prev.reviewDue, lessonId],
        };
        try {
          window.localStorage.setItem(KEY, JSON.stringify(next));
        } catch {
          /* noop */
        }
        return next;
      });
    },
    [today],
  );

  const masterModule = useCallback((moduleId: string, xp: number) => {
    setState((prev) => {
      const next: ProgressState = {
        ...prev,
        xp: prev.xp + xp,
        masteredModules: prev.masteredModules.includes(moduleId)
          ? prev.masteredModules
          : [...prev.masteredModules, moduleId],
      };
      try {
        window.localStorage.setItem(KEY, JSON.stringify(next));
      } catch {
        /* noop */
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
    setState(defaultProgress);
  }, []);

  return { state, hydrated, update, completeLesson, masterModule, reset };
}

export type ModuleStatus = "locked" | "available" | "in-progress" | "mastered";

export function moduleStatus(state: ProgressState, moduleId: string): ModuleStatus {
  const mod = getModule(moduleId);
  if (!mod) return "locked";
  if (state.masteredModules.includes(moduleId)) return "mastered";
  const started = mod.lessons.some((l) => state.completedLessons.includes(l.id));
  if (started) return "in-progress";

  const track = allModules.indexOf(mod) >= 0 ? trackOf(moduleId) : undefined;
  if (!track) return "available";
  const ordered = trackModules(track);
  const index = ordered.findIndex((x) => x.id === moduleId);
  if (index <= 0) return "available";
  const prev = ordered[index - 1]!;
  const prevDone =
    state.masteredModules.includes(prev.id) ||
    prev.lessons.every((l) => state.completedLessons.includes(l.id));
  return prevDone ? "available" : "locked";
}

export function trackOf(moduleId: string): TrackId | undefined {
  if (moduleId.startsWith("l")) return "language";
  if (moduleId.startsWith("c")) return "culture";
  return undefined;
}

export function moduleProgress(state: ProgressState, moduleId: string) {
  const mod = getModule(moduleId);
  if (!mod) return { done: 0, total: 0, pct: 0 };
  const done = mod.lessons.filter((l) => state.completedLessons.includes(l.id)).length;
  return { done, total: mod.lessons.length, pct: (done / mod.lessons.length) * 100 };
}

export function trackProgress(state: ProgressState, trackId: TrackId) {
  const mods = trackModules(trackId);
  const mastered = mods.filter((mod) => state.masteredModules.includes(mod.id)).length;
  const lessons = mods.flatMap((mod) => mod.lessons);
  const doneLessons = lessons.filter((l) => state.completedLessons.includes(l.id)).length;
  return {
    modules: mods.length,
    mastered,
    lessons: lessons.length,
    doneLessons,
    pct: (doneLessons / lessons.length) * 100,
  };
}

export function levelFromXp(xp: number) {
  let level = 1;
  while (Math.round(100 * Math.pow(level + 1, 1.35)) <= xp) level += 1;
  return level;
}
