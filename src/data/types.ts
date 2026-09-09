export type TrackId = "language" | "culture";

export interface VocabItem {
  /** Devanagari / Nepali form */
  np: string;
  /** IAST-light romanization */
  rom: string;
  /** English gloss */
  en: string;
}

export interface Lesson {
  id: string;
  title: string;
  /** Encounter → Notice → Imitate → Retrieve → Use → Reflect */
  phase: string;
  minutes: number;
}

export interface Module {
  id: string;
  code: string;
  title: string;
  goal: string;
  lessons: Lesson[];
  items: VocabItem[];
  skills: string[];
  mechanics: string[];
  xp: number;
  testTasks: number;
  /** Editorial guardrail shown to adults and content teams. */
  note?: string;
}

export interface Chapter {
  id: string;
  code: string;
  track: TrackId;
  title: string;
  nepaliTitle?: string;
  summary: string;
  modules: Module[];
}

export interface Track {
  id: TrackId;
  slug: string;
  title: string;
  nepaliTitle: string;
  tagline: string;
  motif: string;
  chapters: Chapter[];
}

export interface Bridge {
  id: string;
  languagePrereq: string;
  culturePrereq: string;
  experience: string;
  reward: string;
}

export interface BadgeDef {
  id: string;
  type: string;
  title: string;
  rule: string;
}

export interface Mechanic {
  n: number;
  name: string;
  io: string;
  skill: string;
  scoring: string;
}
