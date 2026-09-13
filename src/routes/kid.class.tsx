import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, GraduationCap, ShieldCheck } from "lucide-react";
import { Badge, Button, Card } from "@/design-system/nepali-kids";
import { KidNav } from "@/components/KidNav";

export const Route = createFileRoute("/kid/class")({
  head: () => ({ meta: [{ title: "My Classroom | RootBridge" }, { name: "description", content: "Join a teacher's moderated RootBridge classroom with a six-character code." }] }),
  component: KidClass,
});

function KidClass() {
  const [code, setCode] = useState("");
  const [linked, setLinked] = useState("");
  const [error, setError] = useState("");
  useEffect(() => setLinked(localStorage.getItem("rootbridge-classroom") ?? ""), []);
  const join = () => {
    const clean = code.trim().toUpperCase();
    if (!/^[A-Z0-9]{6}$/.test(clean)) return setError("Ask your teacher for a six-character code.");
    localStorage.setItem("rootbridge-classroom", clean); setLinked(clean); setError("");
  };
  return <div className="min-h-screen"><KidNav /><main className="mx-auto max-w-4xl px-4 py-10 lg:px-8">
    <Badge tone="language">CLASSROOM</Badge><h1 className="mt-2 text-3xl font-extrabold">Learn with your class</h1><p className="mt-2 text-ink-soft">Your teacher can share safe activities and celebrate class progress.</p>
    <Card accent={linked ? "grow" : "language"} bold className="mt-6 p-6">
      {linked ? <div className="flex flex-wrap items-center gap-4"><span className="grid h-12 w-12 place-items-center rounded-full bg-grow-soft text-grow"><CheckCircle2 /></span><div><h2 className="text-xl font-extrabold">Classroom linked</h2><p className="text-sm text-ink-soft">Code {linked}. Teacher activities will appear here.</p></div><Button variant="outline" size="sm" className="ml-auto" onClick={() => { localStorage.removeItem("rootbridge-classroom"); setLinked(""); }}>Leave classroom</Button></div> : <><h2 className="flex items-center gap-2 text-xl font-extrabold"><GraduationCap className="text-language" />Join Classroom by Code</h2><p className="mt-2 text-sm text-ink-soft">Enter the code your teacher gave you. It contains six letters or numbers.</p><div className="mt-5 flex flex-col gap-3 sm:flex-row"><input value={code} onChange={(e) => { setCode(e.target.value.replace(/[^a-z0-9]/gi, "").slice(0, 6).toUpperCase()); setError(""); }} aria-label="Classroom code" placeholder="ABC123" className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-line px-4 text-center text-xl font-extrabold uppercase tracking-[0.25em] outline-none focus:border-language" /><Button onClick={join}>Join classroom</Button></div>{error ? <p role="alert" className="mt-3 text-sm font-bold text-culture">{error}</p> : null}</>}
    </Card>
    <div className="mt-6 grid gap-4 sm:grid-cols-2"><Card className="p-5"><h2 className="text-lg font-extrabold">Class garden</h2><p className="mt-2 text-sm text-ink-soft">Everyone's effort helps the garden grow. Children are never ranked.</p></Card><Card className="p-5"><h2 className="flex items-center gap-2 text-lg font-extrabold"><ShieldCheck className="text-dream" size={19} />Safe by design</h2><p className="mt-2 text-sm text-ink-soft">Teachers review shared work. There is no open child-to-child messaging.</p></Card></div>
  </main></div>;
}