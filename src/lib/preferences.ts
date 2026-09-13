import { useEffect, useState } from "react";

export type UiLanguage = "en" | "ne" | "hi";
const KEY = "rootbridge-language";

export const languageNames: Record<UiLanguage, string> = {
  en: "English",
  ne: "नेपाली",
  hi: "हिन्दी",
};

export function useUiLanguage() {
  const [language, setLanguageState] = useState<UiLanguage>("en");
  useEffect(() => {
    const saved = window.localStorage.getItem(KEY) as UiLanguage | null;
    if (saved && saved in languageNames) setLanguageState(saved);
  }, []);
  const setLanguage = (next: UiLanguage) => {
    window.localStorage.setItem(KEY, next);
    document.documentElement.lang = next;
    setLanguageState(next);
  };
  return { language, setLanguage };
}

export function unlockParentMode() { sessionStorage.setItem("rootbridge-parent-unlocked", "yes"); }
export function isParentModeUnlocked() { return typeof window !== "undefined" && sessionStorage.getItem("rootbridge-parent-unlocked") === "yes"; }