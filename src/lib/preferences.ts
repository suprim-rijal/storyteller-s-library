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

const PIN_KEY = "rootbridge-parent-pin";
export function hasParentPin() { return typeof window !== "undefined" && Boolean(localStorage.getItem(PIN_KEY)); }
export function saveParentPin(pin: string) { localStorage.setItem(PIN_KEY, pin); }
export function verifyParentPin(pin: string) { return localStorage.getItem(PIN_KEY) === pin; }