import type { Module, VocabItem } from "@/data/curriculum";

export type ExerciseKind = "hear-find" | "picture-word" | "meaning" | "reflect";

export interface Exercise {
  id: string;
  kind: ExerciseKind;
  mechanic: string;
  prompt: string;
  target: VocabItem;
  options: VocabItem[];
  /** Which field of the option is displayed on the answer card. */
  show: "np" | "en";
}

/** Deterministic shuffle so server and client render the same order. */
function order<T>(list: T[], seed: number): T[] {
  return [...list].sort((a, b) => {
    const ha = (JSON.stringify(a).length * 31 + seed) % 17;
    const hb = (JSON.stringify(b).length * 31 + seed) % 17;
    return ha - hb || JSON.stringify(a).localeCompare(JSON.stringify(b));
  });
}

/**
 * Builds one lesson's exercise sequence from the module's target items.
 * Every item is encountered before it is retrieved, and distractors always
 * come from the same module so a wrong tap is a teachable contrast.
 */
export function buildLesson(mod: Module, lessonIndex: number): Exercise[] {
  const items = mod.items;
  if (items.length === 0) return [];
  const rotated = [...items.slice(lessonIndex % items.length), ...items.slice(0, lessonIndex % items.length)];
  const targets = rotated.slice(0, Math.min(4, rotated.length));

  return targets.map((target, i) => {
    const pool = items.filter((x) => x.np !== target.np);
    const distractors = order(pool, i + lessonIndex).slice(0, 3);
    const options = order([target, ...distractors], i * 3 + 1);
    const kind: ExerciseKind = i % 2 === 0 ? "hear-find" : "meaning";
    return {
      id: `${mod.id}-${lessonIndex}-${i}`,
      kind,
      mechanic: kind === "hear-find" ? "Hear It, Find It" : "Picture to Word",
      prompt:
        kind === "hear-find"
          ? `Which one means “${target.en}”?`
          : `What does ${target.np} mean?`,
      target,
      options,
      show: kind === "hear-find" ? "np" : "en",
    };
  });
}

export function buildTest(mod: Module): Exercise[] {
  return mod.items.slice(0, Math.min(mod.items.length, 6)).map((target, i) => {
    const pool = mod.items.filter((x) => x.np !== target.np);
    const options = order([target, ...order(pool, i).slice(0, 3)], i + 7);
    const show: "np" | "en" = i % 2 === 0 ? "np" : "en";
    return {
      id: `${mod.id}-test-${i}`,
      kind: show === "np" ? "hear-find" : "meaning",
      mechanic: show === "np" ? "Hear It, Find It" : "Picture to Word",
      prompt:
        show === "np" ? `Choose the Nepali for “${target.en}”.` : `What does ${target.np} mean?`,
      target,
      options,
      show,
    };
  });
}
