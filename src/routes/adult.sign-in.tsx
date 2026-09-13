import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button, Card } from "@/design-system/nepali-kids";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/adult/sign-in")({ head: () => ({ meta: [{ title: "Parent sign in | RootBridge" }, { name: "description", content: "Sign in to securely sync family learning progress." }] }), component: ParentSignIn });

function ParentSignIn() {
  const navigate = useNavigate(); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [mode, setMode] = useState<"in" | "up">("in"); const [message, setMessage] = useState("");
  const emailAuth = async () => {
    setMessage("");
    const result = mode === "in" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/adult/dashboard` } });
    if (result.error) return setMessage(result.error.message);
    if (!result.data.session) return setMessage("Check your email to confirm your account.");
    navigate({ to: "/adult/dashboard" });
  };
  const google = async () => { const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin }); if (result.error) setMessage("Google sign-in could not start."); else if (!result.redirected) navigate({ to: "/adult/dashboard" }); };
  return <main className="grid min-h-screen place-items-center px-4"><Card className="w-full max-w-md p-6"><p className="text-xs font-extrabold uppercase tracking-wider text-language">RootBridge families</p><h1 className="mt-2 text-3xl font-extrabold">{mode === "in" ? "Parent sign in" : "Create parent account"}</h1><p className="mt-2 text-sm text-ink-soft">Sync progress safely across your family's devices.</p><Button variant="outline" fullWidth className="mt-6" onClick={google}>Continue with Google</Button><div className="my-5 flex items-center gap-3 text-xs text-ink-soft"><span className="h-px flex-1 bg-line" />or use email<span className="h-px flex-1 bg-line" /></div><label className="block text-sm font-bold">Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 h-11 w-full rounded-xl border-2 border-line px-3 outline-none focus:border-language" /></label><label className="mt-3 block text-sm font-bold">Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 h-11 w-full rounded-xl border-2 border-line px-3 outline-none focus:border-language" /></label>{message ? <p className="mt-3 text-sm text-ink-soft">{message}</p> : null}<Button fullWidth className="mt-5" onClick={emailAuth}>{mode === "in" ? "Sign in" : "Create account"}</Button><button type="button" className="mt-4 w-full text-sm font-bold text-language" onClick={() => setMode(mode === "in" ? "up" : "in")}>{mode === "in" ? "New here? Create an account" : "Already have an account? Sign in"}</button></Card></main>;
}