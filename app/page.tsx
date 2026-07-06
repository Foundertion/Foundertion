"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe, Copy, Download, Check, Flame, Menu, X } from "lucide-react";
import Link from "next/link";

interface Results {
  detectedLang: string;
  validation: string;
  plan: string;
  pitch: string;
  landing: string;
}

interface ProjectMemory {
  idea: string;
  results: Results;
  savedAt: string;
  streak: number;
  lastVisit: string;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"} className="p-2 rounded-md hover:bg-primary/10 transition-colors text-primary">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={copy} className="flex items-center gap-1 px-3 py-1 rounded-md text-xs border border-border hover:bg-accent transition-colors">
      {copied ? <Check className="h-3 w-3 text-primary" /> : <Copy className="h-3 w-3" />}
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}

function MD({ text }: { text: string }) {
  return (
    <div className="space-y-1">
      {text.split("\n").map((line, i) => {
        if (line.startsWith("## ")) return <h3 key={i} className="text-lg font-bold text-primary mt-4 mb-1 border-b border-border pb-1">{line.slice(3)}</h3>;
        if (line.startsWith("### ")) return <h4 key={i} className="text-sm font-bold text-primary/80 uppercase tracking-wider mt-3 mb-1">{line.slice(4)}</h4>;
        if (line.match(/^\*\*[^*]+\*\*$/)) return <p key={i} className="font-bold text-primary text-sm mt-2">{line.replace(/\*\*/g, "")}</p>;
        if (line.match(/\*\*[^*]+\*\*/)) return <p key={i} className="text-sm leading-relaxed">{line.split(/(\*\*[^*]+\*\*)/).map((p, j) => p.startsWith("**") ? <strong key={j} className="text-primary">{p.replace(/\*\*/g, "")}</strong> : p)}</p>;
        if (line.startsWith("- ") || line.startsWith("- [ ] ")) return <div key={i} className="flex gap-2 text-sm"><span className="text-primary mt-1">◆</span><span className="text-muted-foreground">{line.replace(/^- \[ \] /, "").replace(/^- /, "")}</span></div>;
        if (line.match(/^\d+\. /)) return <div key={i} className="flex gap-2 text-sm"><span className="text-primary font-bold">{line.match(/^(\d+)/)![1]}.</span><span className="text-muted-foreground">{line.replace(/^\d+\. /, "")}</span></div>;
        if (line.startsWith("Q: ")) return <p key={i} className="font-bold text-sm mt-3">{line}</p>;
        if (line.startsWith("A: ")) return <p key={i} className="text-sm text-muted-foreground mb-2">{line}</p>;
        if (line.startsWith("---")) return <hr key={i} className="border-border my-2" />;
        if (line.trim() === "") return <div key={i} className="h-1" />;
        return <p key={i} className="text-sm text-muted-foreground leading-relaxed">{line}</p>;
      })}
    </div>
  );
}

function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const join = async () => {
    if (!email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
    } catch { setStatus("error"); }
  };
  return (
    <div className="max-w-2xl mx-auto my-12 p-8 rounded-2xl bg-primary/5 border border-primary/20 text-center">
      <h2 className="text-2xl font-bold mb-2">Join 100+ Solo Founders</h2>
      <p className="text-muted-foreground mb-6 text-sm">Get notified when new features drop. No spam, ever.</p>
      {status === "success" ? (
        <div className="text-primary font-bold text-lg">You are on the list! Check your email.</div>
      ) : (
        <div className="flex gap-2 max-w-md mx-auto flex-wrap">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
          <button onClick={join} disabled={status === "loading"} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50">
            {status === "loading" ? "..." : "Join Waitlist"}
          </button>
        </div>
      )}
      {status === "error" && <p className="text-red-400 text-sm mt-2">Failed. Try again.</p>}
      <div className="mt-4 flex items-center justify-center gap-2">
        <span className="text-xs text-muted-foreground">or</span>
        <a href="https://discord.gg/fxUEHJgg8" target="_blank" rel="noopener noreferrer"
          className="text-xs font-bold text-primary hover:underline">
          Join Discord Community →
        </a>
      </div>
    </div>
  );
}

function DailyCheckin({ memory, onClose }: { memory: any, onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [shipped, setShipped] = useState("");
  const [blocker, setBlocker] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    { label: "What did you ship yesterday?", placeholder: "Finished landing page / Fixed a bug / Nothing, got stuck...", value: shipped, setValue: setShipped },
    { label: "What is your blocker today?", placeholder: "Don't know how to do X / Feeling overwhelmed / No blocker!", value: blocker, setValue: setBlocker },
    { label: "What can you ship in the next 2 hours?", placeholder: "Write copy / Fix that bug / Call one customer...", value: nextStep, setValue: setNextStep },
  ];

  const submit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shipped, blocker, nextStep, memory }),
      });
      const data = await res.json();
      setResponse(data.response || "Keep shipping!");
      setStep(3);
      const checkins = JSON.parse(localStorage.getItem("foundertion_checkins") || "[]");
      checkins.push({ shipped, blocker, nextStep, date: new Date().toISOString() });
      localStorage.setItem("foundertion_checkins", JSON.stringify(checkins.slice(-30)));
      localStorage.setItem("foundertion_last_checkin", new Date().toISOString());
    } catch {
      setResponse("Error. Keep shipping anyway!");
      setStep(3);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl p-6 max-w-md w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-lg text-primary">Daily Check-in</h2>
            <p className="text-xs text-muted-foreground">2 minutes. Stay on track.</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>
        {step < 3 ? (
          <div>
            <div className="flex gap-1 mb-6">
              {[0,1,2].map(i => (
                <div key={i} className={"h-1 flex-1 rounded-full transition-all " + (i <= step ? "bg-primary" : "bg-border")} />
              ))}
            </div>
            <p className="font-medium text-sm mb-3">{questions[step].label}</p>
            <textarea value={questions[step].value} onChange={e => questions[step].setValue(e.target.value)}
              placeholder={questions[step].placeholder} rows={3}
              className="w-full p-3 rounded-lg border border-input bg-background/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary" />
            <div className="flex gap-2 mt-4">
              {step > 0 && <button onClick={() => setStep(step - 1)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">Back</button>}
              <button onClick={() => step < 2 ? setStep(step + 1) : submit()} disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50">
                {loading ? "Thinking..." : step < 2 ? "Next" : "Get AI Nudge"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-3xl mb-3 text-center">🚀</div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">{response}</div>
            <button onClick={onClose} className="w-full mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90">Ship It!</button>
          </div>
        )}
      </div>
    </div>
  );
}

const TABS = [
  { id: "validation", label: "Idea Validator" },
  { id: "plan", label: "Business Plan" },
  { id: "pitch", label: "Pitch Script" },
  { id: "landing", label: "Landing Copy" },
];

function getTabContent(results: Results, tab: string): string {
  if (tab === "validation") return results.validation;
  if (tab === "plan") return results.plan;
  if (tab === "pitch") return results.pitch;
  if (tab === "landing") return results.landing;
  return "";
}

function updateStreak(memory: ProjectMemory | null): number {
  if (!memory) return 1;
  const last = new Date(memory.lastVisit);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return memory.streak;
  if (diffDays === 1) return memory.streak + 1;
  return 1;
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [activeTab, setActiveTab] = useState("validation");
  const [memory, setMemory] = useState<ProjectMemory | null>(null);
  const [streak, setStreak] = useState(1);
  const [showRescue, setShowRescue] = useState(false);
  const [exported, setExported] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);
  const [toast, setToast] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(""), 3000); };

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("login=success")) {
      showToast("Welcome to Foundertion! You are signed in.");
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const saved = localStorage.getItem("foundertion_memory");
    if (saved) {
      const m: ProjectMemory = JSON.parse(saved as string);
      setMemory(m);
      const newStreak = updateStreak(m);
      setStreak(newStreak);
      const savedAt = new Date(m.savedAt);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - savedAt.getTime()) / (1000 * 60 * 60 * 24));
      if (diffDays >= 3) setShowRescue(true);
    }
  }, []);

  const saveMemory = (idea: string, results: Results) => {
    const existing = localStorage.getItem("foundertion_memory");
    const prev: ProjectMemory | null = existing ? JSON.parse(existing) : null;
    const newStreak = updateStreak(prev);
    const m: ProjectMemory = {
      idea, results,
      savedAt: new Date().toISOString(),
      streak: newStreak,
      lastVisit: new Date().toISOString(),
    };
    localStorage.setItem("foundertion_memory", JSON.stringify(m));
    setMemory(m);
    setStreak(newStreak);
    setShowRescue(false);
  };

  const saveToCloud = async (ideaText: string, res: Results) => {
    try {
      const { createClient } = await import("@/lib/supabase");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      await supabase.from("projects").insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        name: ideaText.slice(0, 50),
        idea: ideaText,
        language: res.detectedLang,
        validation: res.validation,
        plan: res.plan,
        pitch: res.pitch,
        landing: res.landing,
      });
    } catch (e) { console.error("Save error:", e); }
  };

  const handleGenerate = async () => {
    if (!idea.trim() || idea.trim().length < 10) return alert("Min 10 characters");
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: idea }),
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setResults(data);
      setActiveTab("validation");
      saveMemory(idea, data);
      saveToCloud(idea, data);
    } catch {
      alert("Failed to generate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMemory = () => {
    if (memory) {
      setIdea(memory.idea);
      setResults(memory.results);
      setActiveTab("validation");
      setShowRescue(false);
    }
  };

  const exportPDF = async () => {
    if (!results) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const W = 210, M = 18;

    const addHeader = () => {
      doc.setFillColor(11, 26, 18);
      doc.rect(0, 0, W, 36, "F");
      doc.setFillColor(63, 207, 142);
      doc.rect(0, 34, W, 2, "F");
      doc.setTextColor(63, 207, 142);
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      doc.text("FOUNDERTION", M, 16);
      doc.setFontSize(8);
      doc.setTextColor(74, 112, 96);
      doc.setFont("helvetica", "normal");
      doc.text("YOUR AI CO-FOUNDER  *  foundertion.vercel.app", M, 24);
      doc.setTextColor(200, 220, 210);
      doc.text("Generated: " + new Date().toLocaleDateString("en-GB", {day:"numeric",month:"long",year:"numeric"}), M, 31);
    };

    const addFooter = (pageNum: number) => {
      doc.setFillColor(11, 26, 18);
      doc.rect(0, 287, W, 10, "F");
      doc.setTextColor(63, 207, 142);
      doc.setFontSize(7);
      doc.text("Foundertion  *  foundertion.vercel.app", M, 293);
      doc.setTextColor(74, 112, 96);
      doc.text("Page " + pageNum, W - M - 8, 293);
    };

    const addSection = (title: string, text: string, y: number, pageNum: number): [number, number] => {
      if (y > 250) { addFooter(pageNum); doc.addPage(); doc.setFillColor(248,250,249); doc.rect(0,0,W,297,"F"); pageNum++; y = 15; }
      doc.setFillColor(63, 207, 142);
      doc.roundedRect(M, y, W - M * 2, 9, 2, 2, "F");
      doc.setTextColor(11, 26, 18);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(title, M + 3, y + 6.5);
      y += 13;
      for (const line of text.split("\n")) {
        const t = line.trim();
        if (!t) { y += 2; continue; }
        if (y > 278) { addFooter(pageNum); doc.addPage(); doc.setFillColor(248,250,249); doc.rect(0,0,W,297,"F"); pageNum++; y = 15; }
        if (t.startsWith("## ")) {
          y += 3;
          doc.setTextColor(11,26,18); doc.setFontSize(10); doc.setFont("helvetica","bold");
          doc.text(t.replace("## ",""), M, y);
          doc.setDrawColor(63,207,142); doc.setLineWidth(0.3); doc.line(M, y+1.5, W-M, y+1.5);
          y += 7;
        } else if (t.startsWith("### ")) {
          doc.setTextColor(74,112,96); doc.setFontSize(8); doc.setFont("helvetica","bold");
          doc.text(t.replace("### ","").toUpperCase(), M, y); y += 5;
        } else if (t.startsWith("- ")) {
          const txt = t.replace("- [ ] ","").replace("- ","");
          doc.setFillColor(63,207,142); doc.circle(M+1.5, y-1, 0.8, "F");
          doc.setTextColor(40,60,50); doc.setFontSize(8.5); doc.setFont("helvetica","normal");
          const w = doc.splitTextToSize(txt, W-M*2-6); doc.text(w, M+5, y); y += w.length*4.5+1;
        } else if (t.startsWith("Q: ")) {
          y += 2; doc.setTextColor(11,26,18); doc.setFontSize(8.5); doc.setFont("helvetica","bold");
          doc.text(t, M, y); y += 5;
        } else if (t.startsWith("A: ")) {
          doc.setTextColor(74,112,96); doc.setFontSize(8.5); doc.setFont("helvetica","normal");
          const w = doc.splitTextToSize(t, W-M*2); doc.text(w, M, y); y += w.length*4.5+3;
        } else if (t.startsWith("---")) {
          doc.setDrawColor(200,220,210); doc.setLineWidth(0.2); doc.line(M,y,W-M,y); y += 4;
        } else {
          const clean = t.replace(/\*\*/g,"");
          doc.setTextColor(40,60,50); doc.setFontSize(8.5); doc.setFont("helvetica","normal");
          const w = doc.splitTextToSize(clean, W-M*2); doc.text(w, M, y); y += w.length*4.5+1;
        }
      }
      return [y + 8, pageNum];
    };

    doc.setFillColor(248,250,249); doc.rect(0,0,W,297,"F");
    addHeader();
    let y = 46;
    doc.setFillColor(232,237,233); doc.roundedRect(M,y,W-M*2,20,3,3,"F");
    doc.setTextColor(74,112,96); doc.setFontSize(7); doc.setFont("helvetica","bold");
    doc.text("STARTUP IDEA", M+4, y+6);
    doc.setTextColor(11,26,18); doc.setFontSize(9); doc.setFont("helvetica","normal");
    const ideaW = doc.splitTextToSize(idea, W-M*2-8); doc.text(ideaW.slice(0,2), M+4, y+13);
    y += 26;

    let pageNum = 1;
    const sections: [string, string][] = [
      ["IDEA VALIDATOR", results.validation || ""],
      ["BUSINESS PLAN - 90 DAYS", results.plan || ""],
      ["PITCH SCRIPT", results.pitch || ""],
      ["LANDING PAGE COPY", results.landing || ""],
    ];
    for (const [title, text] of sections) {
      if (!text) continue;
      [y, pageNum] = addSection(title, text, y, pageNum);
    }
    addFooter(pageNum);
    doc.save("foundertion-" + idea.slice(0,25).replace(/\s+/g,"-").toLowerCase() + ".pdf");
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {toast && <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-xl shadow-lg text-sm font-bold">{toast}</div>}
      {showCheckin && <DailyCheckin memory={memory} onClose={() => setShowCheckin(false)} />}

      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <img src="/android-chrome-192.png" alt="Foundertion" className="h-8 w-8 rounded-lg shrink-0" />
            <span className="font-bold text-xl truncate">Foundertion</span>
            <span className="hidden lg:inline text-xs text-muted-foreground shrink-0">YOUR AI CO-FOUNDER</span>
          </div>

          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            {streak > 1 && <div className="flex items-center gap-1 text-sm font-bold text-orange-400"><Flame className="h-4 w-4" />{streak}</div>}
            <button onClick={() => setShowCheckin(true)} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/20">Daily Check-in</button>
            <Link href="/login" className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/20">Sign In</Link>
            <Link href="/dashboard" className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent">Dashboard</Link>
            <ThemeToggle />
          </div>

          {/* Mobile controls: streak + theme toggle always visible, rest behind hamburger */}
          <div className="flex sm:hidden items-center gap-1 shrink-0">
            {streak > 1 && <div className="flex items-center gap-1 text-sm font-bold text-orange-400 mr-1"><Flame className="h-4 w-4" />{streak}</div>}
            <ThemeToggle />
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              className="p-2 rounded-md hover:bg-primary/10 transition-colors text-primary"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden border-t border-border/50 bg-background/95 backdrop-blur-md px-4 py-3 flex flex-col gap-2">
            <button
              onClick={() => { setShowCheckin(true); setMobileMenuOpen(false); }}
              className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-bold hover:bg-primary/20 text-left"
            >
              Daily Check-in
            </button>
            <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary text-sm font-bold hover:bg-primary/20">Sign In</Link>
            <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)} className="px-3 py-2 rounded-lg border border-border text-sm hover:bg-accent">Dashboard</Link>
          </div>
        )}
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {showRescue && memory && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="font-bold text-amber-500 mb-1">Do not quit at 70-85%!</p>
            <p className="text-sm text-muted-foreground mb-3">You were working on: <strong className="text-foreground">{memory.idea.slice(0,60)}</strong></p>
            <div className="flex gap-2">
              <button onClick={loadMemory} className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-bold">Resume →</button>
              <button onClick={() => setShowRescue(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">Start New</button>
            </div>
          </div>
        )}

        {memory && !showRescue && !results && (
          <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">Last project: <strong className="text-foreground">{memory.idea.slice(0,50)}</strong></p>
            <button onClick={loadMemory} className="text-xs text-primary hover:underline">Resume →</button>
          </div>
        )}

        {!results && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6 border border-primary/20">
              <Globe className="h-4 w-4" />
              <span>Auto-detects 20+ languages</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Foundertion</h1>
            <p className="text-xl text-muted-foreground mb-2">Stop guessing. Start shipping.</p>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Your AI co-founder for validating ideas, planning, and getting unstuck.</p>
          </div>
        )}

        <div className="max-w-2xl mx-auto mb-8">
          <div className="rounded-xl border-2 border-primary/20 bg-card p-6 shadow-xl">
            <textarea value={idea} onChange={e => setIdea(e.target.value)}
              placeholder="Describe your startup idea in any language..."
              className="w-full min-h-[120px] p-4 rounded-lg border border-input bg-background/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base"
              disabled={loading} />
            <div className="mt-4 flex gap-3 justify-end flex-wrap">
              {results && <button onClick={() => { setResults(null); setIdea(""); }} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">New Idea</button>}
              <button onClick={handleGenerate} disabled={loading} className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50">
                {loading ? "Generating..." : "Generate All 4 Tools"}
              </button>
            </div>
          </div>
        </div>

        {results && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                <Globe className="h-4 w-4" />
                <span>Language: {results.detectedLang}</span>
              </div>
              <button onClick={exportPDF} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">
                <Download className="h-4 w-4" />
                {exported ? "Downloaded!" : "Export PDF"}
              </button>
            </div>
            <div className="flex gap-2 mb-4 flex-wrap">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex gap-2">
              <span className="text-amber-500 flex-shrink-0">⚠️</span>
              <p className="text-xs text-amber-500/80">AI-Generated. Unvalidated. Test with real users within 48 hours. Foundertion is not responsible for business decisions based on this output.</p>
            </div>
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex justify-end mb-3">
                <CopyButton text={getTabContent(results, activeTab)} />
              </div>
              {activeTab === "validation" && <MD text={results.validation} />}
              {activeTab === "plan" && <MD text={results.plan} />}
              {activeTab === "pitch" && <MD text={results.pitch} />}
              {activeTab === "landing" && <MD text={results.landing} />}
            </div>
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <p className="font-bold text-primary mb-1">Now ship it. Do not wait for perfect.</p>
              <p className="text-sm text-muted-foreground">Done is better than perfect. Push through the 70-85% zone.</p>
            </div>
          </div>
        )}
        <WaitlistSection />
      </main>

      <div style={{display:"none"}}>Impact-Site-Verification: df327a34-0d4e-4136-a9f8-ad9c27782cc7</div>
      <footer className="border-t border-border/30 mt-12 py-6 text-center text-sm text-muted-foreground">
        Foundertion — AI Co-Founder for Solo Founders Worldwide
      </footer>
    </div>
  );
}
