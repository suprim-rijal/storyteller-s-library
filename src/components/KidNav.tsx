import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Award, BookOpen, ChevronDown, GraduationCap, Languages, Lock, Smile, Sprout } from "lucide-react";
import {
  Button, Dialog, DialogContent, DialogDescription, DialogTitle,
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, cn,
} from "@/design-system/nepali-kids";
import { languageNames, unlockParentMode, useUiLanguage } from "@/lib/preferences";
import { getParentControlStatus, setParentPin, verifyParentPinCloud } from "@/lib/family.functions";
import { supabase } from "@/integrations/supabase/client";

const tabs = [
  { to: "/kid/home", label: "Course", icon: BookOpen },
  { to: "/kid/practice", label: "Practice Garden", icon: Sprout },
  { to: "/kid/class", label: "Class", icon: GraduationCap },
  { to: "/kid/treasures", label: "Achievements", icon: Award },
  { to: "/kid/me", label: "Me", icon: Smile },
] as const;

export function KidNav() {
  const navigate = useNavigate();
  const { language, setLanguage } = useUiLanguage();
  const [parentOpen, setParentOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [isSetup, setIsSetup] = useState(false);
  const getStatus = useServerFn(getParentControlStatus);
  const savePin = useServerFn(setParentPin);
  const checkPin = useServerFn(verifyParentPinCloud);

  const openParentGate = async () => {
    const { data } = await supabase.auth.getUser();
    if (!data.user) { navigate({ to: "/adult/sign-in" }); return; }
    try { const status = await getStatus(); setIsSetup(!status.configured); setParentOpen(true); }
    catch { navigate({ to: "/adult/sign-in" }); }
  };

  const continueToParent = async () => {
    if (!/^\d{4}$/.test(pin)) return setError("Enter a 4-digit PIN.");
    if (isSetup) {
      if (pin !== confirmPin) return setError("The PINs do not match.");
      try { await savePin({ data: { pin } }); } catch { return setError("We could not save that PIN. Please try again."); }
    } else {
      try { const result = await checkPin({ data: { pin } }); if (!result.valid) return setError("That PIN is not right. Try again or use recovery."); }
      catch { return setError("We could not check the PIN. Please sign in again."); }
    }
    unlockParentMode();
    setParentOpen(false);
    navigate({ to: "/adult/dashboard" });
  };

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 lg:px-8">
          <Link to="/kid/home" className="flex shrink-0 items-center gap-2" aria-label="RootBridge home">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-language text-lg font-extrabold text-white">ने</span>
            <span className="hidden sm:block"><span className="block font-display text-lg font-extrabold leading-tight text-language">RootBridge</span><span className="block text-[10px] text-ink-soft">नेपाली नानीहरू</span></span>
          </Link>

          <nav className="ml-2 hidden min-w-0 flex-1 items-center gap-1 lg:flex" aria-label="Child navigation">
            {tabs.map(({ to, label, icon: Icon }) => (
              <Link key={to} to={to} className="flex items-center gap-2 rounded-full border-2 border-transparent px-3 py-2 text-sm font-bold text-ink-soft hover:bg-canvas hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-language" activeProps={{ className: "border-language bg-language-soft !text-language" }}>
                <Icon size={16} />{label}
              </Link>
            ))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="outline" size="sm" aria-label="Choose language"><Languages size={16} /><span className="hidden sm:inline">{languageNames[language]}</span><ChevronDown size={14} /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(Object.keys(languageNames) as Array<keyof typeof languageNames>).map((code) => <DropdownMenuItem key={code} onSelect={() => setLanguage(code)}>{languageNames[code]}{language === code ? " ✓" : ""}</DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="border-dream text-dream" onClick={() => { setPin(""); setConfirmPin(""); setError(""); void openParentGate(); }}><Lock size={15} /><span className="hidden sm:inline">For Parents</span></Button>
        </div>
        <nav className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden" aria-label="Child navigation">
          {tabs.map(({ to, label, icon: Icon }) => <Link key={to} to={to} className="flex shrink-0 items-center gap-1.5 rounded-full border-2 border-transparent px-3 py-1.5 text-xs font-bold text-ink-soft" activeProps={{ className: "border-language bg-language-soft !text-language" }}><Icon size={14} />{label}</Link>)}
        </nav>
      </header>

      <Dialog open={parentOpen} onOpenChange={setParentOpen}>
        <DialogContent>
          <DialogTitle className="pr-10 font-display text-2xl font-extrabold">{isSetup ? "Create a parent PIN" : "Parent check"}</DialogTitle>
          <DialogDescription className="mt-2 text-sm text-ink-soft">{isSetup ? "Choose four digits that only a parent or caregiver knows." : "Enter your 4-digit PIN to open parent controls."}</DialogDescription>
          <label className="mt-5 block text-sm font-bold">4-digit PIN<input autoFocus inputMode="numeric" maxLength={4} value={pin} onChange={(e) => { setPin(e.target.value.replace(/\D/g, "")); setError(""); }} className="mt-2 h-12 w-full rounded-xl border-2 border-line px-4 text-center text-xl tracking-[0.5em] outline-none focus:border-language" /></label>
          {isSetup ? <label className="mt-3 block text-sm font-bold">Confirm PIN<input inputMode="numeric" maxLength={4} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))} className="mt-2 h-12 w-full rounded-xl border-2 border-line px-4 text-center text-xl tracking-[0.5em] outline-none focus:border-language" /></label> : null}
          {error ? <p role="alert" className="mt-3 text-sm font-bold text-culture">{error}</p> : null}
          <Button fullWidth className="mt-5" onClick={continueToParent}>{isSetup ? "Save PIN and continue" : "Open parent dashboard"}</Button>
          {!isSetup ? <button type="button" onClick={() => { setParentOpen(false); navigate({ to: "/adult/recover" }); }} className="mt-3 w-full text-sm font-bold text-language hover:underline">Forgot PIN?</button> : null}
        </DialogContent>
      </Dialog>
    </>
  );
}