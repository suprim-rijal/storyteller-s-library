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
async function pinDigest(pin: string) {
  const bytes = new TextEncoder().encode(`rootbridge-parent:${pin}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join("");
}
export async function saveParentPin(pin: string) { localStorage.setItem(PIN_KEY, await pinDigest(pin)); }
export async function verifyParentPin(pin: string) { return localStorage.getItem(PIN_KEY) === await pinDigest(pin); }
export function unlockParentMode() { sessionStorage.setItem("rootbridge-parent-unlocked", "yes"); }
export function isParentModeUnlocked() { return typeof window !== "undefined" && sessionStorage.getItem("rootbridge-parent-unlocked") === "yes"; }