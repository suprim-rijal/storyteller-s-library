import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Button, Card } from "@/design-system/nepali-kids";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/adult/recover")({
  head: () => ({ meta: [{ title: "Recover parent access | RootBridge" }, { name: "description", content: "Send a secure parent access recovery email." }] }),
  component: RecoverParentAccess,
});

function RecoverParentAccess() {
  const [email, setEmail] = useState(""); const [sent, setSent] = useState(false); const [error, setError] = useState("");
  const recover = async () => {
    setError("");
    const { error: authError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/adult/dashboard` });
    if (authError) setError("We could not send the email. Check the address and try again."); else setSent(true);
  };
  return <main className="grid min-h-screen place-items-center px-4"><Card className="w-full max-w-md p-6"><span className="grid h-12 w-12 place-items-center rounded-full bg-dream-soft text-dream"><Mail /></span><h1 className="mt-4 text-2xl font-extrabold">Recover parent access</h1><p className="mt-2 text-sm text-ink-soft">Enter the parent email. We will send a secure recovery link if an account exists.</p>{sent ? <p className="mt-5 rounded-2xl bg-grow-soft p-4 text-sm font-bold text-grow">Check your email for the recovery link.</p> : <><label className="mt-5 block text-sm font-bold">Parent email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-12 w-full rounded-xl border-2 border-line px-4 outline-none focus:border-language" /></label>{error ? <p className="mt-3 text-sm font-bold text-culture">{error}</p> : null}<Button fullWidth className="mt-4" onClick={recover} disabled={!email}>Send recovery email</Button></>}<Link to="/kid/home" className="mt-4 block text-center text-sm font-bold text-language">Back to child mode</Link></Card></main>;
}