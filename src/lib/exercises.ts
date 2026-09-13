import type { Module, VocabItem } from "@/data/curriculum";

export type ExerciseKind = "hear-find" | "meaning" | "typing" | "echo" | "matra" | "match";
export interface Exercise {
  id: string;
  kind: ExerciseKind;
  mechanic: string;
  instructions_text: string;
  instructions_audio: string;
  prompt: string;
  target: VocabItem;
  options: VocabItem[];
  show: "np" | "en";
  dimensions: Array<"accuracy" | "strokeOrder" | "matraPlacement" | "independence">;
}

function order<T>(list: T[], seed: number): T[] {
  return [...list].sort((a, b) => {
    const ha = (JSON.stringify(a).length * 31 + seed) % 17;
    const hb = (JSON.stringify(b).length * 31 + seed) % 17;
    return ha - hb || JSON.stringify(a).localeCompare(JSON.stringify(b));
  });
}

const formats: Array<Pick<Exercise, "kind" | "mechanic" | "instructions_text" | "dimensions">> = [
  { kind: "hear-find", mechanic: "Hear It, Find It", instructions_text: "Listen, then choose the matching word. Use number keys 1 to 4 or tap a card.", dimensions: ["accuracy", "independence"] },
  { kind: "typing", mechanic: "Dictation Garden", instructions_text: "Listen and type the Nepali word. You can copy the model after using a hint.", dimensions: ["accuracy", "matraPlacement", "independence"] },
  { kind: "echo", mechanic: "Echo Studio", instructions_text: "Listen, then say the word aloud or use the no-microphone check.", dimensions: ["accuracy", "independence"] },
  { kind: "matra", mechanic: "Missing Matra", instructions_text: "Choose the complete word. Look closely at where the vowel mark sits.", dimensions: ["accuracy", "matraPlacement", "independence"] },
  { kind: "match", mechanic: "Word Match", instructions_text: "Match the Nepali word to its meaning. Use number keys or tap a card.", dimensions: ["accuracy", "independence"] },
  { kind: "meaning", mechanic: "Read and Choose", instructions_text: "Read the word, then choose its meaning. Use number keys or tap a card.", dimensions: ["accuracy", "independence"] },
];

function build(mod: Module, targets: VocabItem[], seed: number, prefix: string): Exercise[] {
  return targets.map((target, i) => {
    const format = formats[(i + seed) % formats.length]!;
    const pool = mod.items.filter((x) => x.np !== target.np);
    const options = order([target, ...order(pool, i + seed).slice(0, 3)], i * 3 + seed);
    const show = format.kind === "meaning" || format.kind === "match" ? "en" : "np";
    return {
      ...format,
      id: `${mod.id}-${prefix}-${i}`,
      instructions_audio: format.instructions_text,
      prompt: format.kind === "typing" ? `Type the word for “${target.en}”.` : format.kind === "echo" ? `Say “${target.np}” after the model.` : format.kind === "matra" ? `Which spelling says “${target.en}”?` : show === "np" ? `Choose the Nepali for “${target.en}”.` : `What does ${target.np} mean?`,
      target,
      options,
      show,
    };
  });
}

export function buildLesson(mod: Module, lessonIndex: number): Exercise[] {
  if (!mod.items.length) return [];
  const rotated = [...mod.items.slice(lessonIndex % mod.items.length), ...mod.items.slice(0, lessonIndex % mod.items.length)];
  return build(mod, rotated.slice(0, Math.min(4, rotated.length)), lessonIndex, String(lessonIndex));
}

export function buildTest(mod: Module): Exercise[] {
  return build(mod, mod.items.slice(0, Math.min(mod.items.length, 6)), 2, "test");
}