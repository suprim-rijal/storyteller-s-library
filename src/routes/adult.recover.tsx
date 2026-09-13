import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Mail } from "lucide-react";
import { Button, Card } from "@/design-system/nepali-kids";
import { supabase } from "@/integrations/supabase/client";
import { setParentPin } from "@/lib/family.functions";
import { unlockParentMode } from "@/lib/preferences";

export const Route = createFileRoute("/adult/recover")({
  head: () => ({ meta: [{ title: "Recover parent access | RootBridge" }, { name: "description", content: "Send a secure parent access recovery email." }, { property: "og:title", content: "Recover parent access | RootBridge" }, { property: "og:description", content: "Securely reset a RootBridge parent PIN." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: RecoverParentAccess,
});

function RecoverParentAccess() {
  const navigate = useNavigate(); const savePin = useServerFn(setParentPin);
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false); const [error, setError] = useState(""); const [pin, setPin] = useState(""); const [confirmPin, setConfirmPin] = useState("");
  const recover = async () => {
    setError("");
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/adult/recover` });
    if (authError) setError("We could not send the email. Check the address and try again."); else setSent(true);
  };
  const resetPin = async () => { if (!/^\d{4}$/.test(pin)) return setError("Enter a 4-digit PIN."); if (pin !== confirmPin) return setError("The PINs do not match."); try { await savePin({ data: { pin } }); unlockParentMode(); navigate({ to: "/adult/dashboard" }); } catch { setError("Open the recovery link from your email before choosing a new PIN."); } };
  return <main className="grid min-h-screen place-items-center px-4"><Card className="w-full max-w-md p-6"><span className="grid h-12 w-12 place-items-center rounded-full bg-dream-soft text-dream"><Mail /></span><h1 className="mt-4 text-2xl font-extrabold">Recover parent access</h1><p className="mt-2 text-sm text-ink-soft">Request a private recovery link, then return here to choose a new PIN.</p>{sent ? <p className="mt-5 rounded-2xl bg-grow-soft p-4 text-sm font-bold text-grow">Check your email, open the recovery link, then set your new PIN below.</p> : <><label className="mt-5 block text-sm font-bold">Parent email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 w-full rounded-xl border-2 border-line px-4 outline-none focus:border-language" /></label><Button fullWidth className="mt-4" onClick={recover} disabled={!email}>Send recovery email</Button></>}<label className="mt-5 block text-sm font-bold">New 4-digit PIN<input inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} className="mt-2 h-12 w-full rounded-xl border-2 border-line px-4 text-center text-xl outline-none focus:border-language" /></label><label className="mt-3 block text-sm font-bold">Confirm new PIN<input inputMode="numeric" maxLength={4} value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ""))} className="mt-2 h-12 w-full rounded-xl border-2 border-line px-4 text-center text-xl outline-none focus:border-language" /></label>{error ? <p className="mt-3 text-sm font-bold text-culture">{error}</p> : null}<Button fullWidth className="mt-4" onClick={resetPin}>Save new PIN</Button><Link to="/kid/home" className="mt-4 block text-center text-sm font-bold text-language">Back to child mode</Link></Card></main>;
}