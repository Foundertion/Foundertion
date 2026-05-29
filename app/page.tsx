"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe, Copy, Download, Check, Flame, LogIn, LogOut, User } from "lucide-react";
import { createClient } from "@/lib/supabase";
import AuthModal from "@/components/AuthModal";

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
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-md hover:bg-primary/10 transition-colors text-primary">
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


function DailyCheckin({ memory, onClose }: { memory: any, onClose: () => void }) {
  const [step, setStep] = useState(0);
  const [shipped, setShipped] = useState("");
  const [blocker, setBlocker] = useState("");
  const [nextStep, setNextStep] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const questions = [
    { label: "What did you ship yesterday?", placeholder: "Finished landing page / Fixed a bug / Nothing, got stuck...", value: shipped, setValue: setShipped },
    { label: "What is your blocker today?", placeholder: "Don t know how to do X / Feeling overwhelmed / No blocker!", value: blocker, setValue: setBlocker },
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
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">x</button>
        </div>

        {step < 3 ? (
          <div>
            <div className="flex gap-1 mb-6">
              {[0,1,2].map(i => (
                <div key={i} className={"h-1 flex-1 rounded-full transition-all " + (i <= step ? "bg-primary" : "bg-border")} />
              ))}
            </div>
            <p className="font-medium text-sm mb-3">{questions[step].label}</p>
            <textarea
              value={questions[step].value}
              onChange={e => questions[step].setValue(e.target.value)}
              placeholder={questions[step].placeholder}
              rows={3}
              className="w-full p-3 rounded-lg border border-input bg-background/50 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <div className="flex gap-2 mt-4">
              {step > 0 && (
                <button onClick={() => setStep(step - 1)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">
                  Back
                </button>
              )}
              <button
                onClick={() => step < 2 ? setStep(step + 1) : submit()}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Thinking..." : step < 2 ? "Next" : "Get AI Nudge"}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-3xl mb-3 text-center">🚀</div>
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {response}
            </div>
            <button onClick={onClose} className="w-full mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90">
              Ship It! 🚢
            </button>
          </div>
        )}
      </div>
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
      <h2 className="text-2xl font-bold mb-2">Join 100+ Solo Founders 🚀</h2>
      <p className="text-muted-foreground mb-6 text-sm">Get notified when new features drop. No spam, ever.</p>
      {status === "success" ? (
        <div className="text-primary font-bold text-lg">You are on the list! Check your email. 🎉</div>
      ) : (
        <div className="flex gap-2 max-w-md mx-auto flex-wrap">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="flex-1 min-w-[200px] px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary text-sm" />
          <button onClick={join} disabled={status === "loading"} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50">
            {status === "loading" ? "..." : "Join Waitlist"}
          </button>
        </div>
      )}
      {status === "error" && <p className="text-red-400 text-sm mt-2">Failed. Try again.</p>}
    </div>
  );
}

const TABS = [
  { id: "validation", label: "⚡ Idea Validator" },
  { id: "plan", label: "🗺️ Business Plan" },
  { id: "pitch", label: "🎯 Pitch Script" },
  { id: "landing", label: "🚀 Landing Copy" },
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
  const [user, setUser] = useState<any>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showCheckin, setShowCheckin] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
    });
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    const saved = localStorage.getItem("foundertion_memory");
    if (saved) {
      const m: ProjectMemory = JSON.parse(saved);
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

  const saveToCloud = async (idea: string, results: Results) => {
    if (!user) return;
    setSaving(true);
    try {
      const supabase = createClient();
      await supabase.from("projects").insert({
        id: crypto.randomUUID(),
        user_id: user.id,
        name: idea.slice(0, 50),
        idea,
        language: results.detectedLang,
        validation: results.validation,
        plan: results.plan,
        pitch: results.pitch,
        landing: results.landing,
      });
    } catch (e) {
      console.error("Save error:", e);
    }
    setSaving(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  };

