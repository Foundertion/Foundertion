"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WaitlistSection from "@/components/WaitlistSection";

"use client";

import { useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe, Copy, Download, Check, Flame } from "lucide-react";

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

const TABS = [
  { id: "validation", label: "⚡ Idea Validator" },
  { id: "plan",       label: "🗺️ Business Plan" },
  { id: "pitch",      label: "🎯 Pitch Script" },
  { id: "landing",    label: "🚀 Landing Copy" },
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

  // Load memory on mount
  useEffect(() => {
    const saved = localStorage.getItem("foundertion_memory");
    if (saved) {
      const m: ProjectMemory = JSON.parse(saved);
      setMemory(m);
      const newStreak = updateStreak(m);
      setStreak(newStreak);

      // Check 70-85% rescue
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
      idea,
      results,
      savedAt: new Date().toISOString(),
      streak: newStreak,
      lastVisit: new Date().toISOString(),
    };
    localStorage.setItem("foundertion_memory", JSON.stringify(m));
    setMemory(m);
    setStreak(newStreak);
    setShowRescue(false);
  };

  const handleGenerate = async () => {
    if (!idea.trim() || idea.trim().length < 10) return alert("Min 10 characters / Min 10 karakter");
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
    } catch {
      alert("Failed to generate. Try again. / Gagal generate. Coba lagi.");
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
    const doc = new jsPDF();
    const content = `FOUNDERTION - Startup Kit\n\nIdea: ${idea}\n\n=== IDEA VALIDATOR ===\n${results.validation}\n\n=== BUSINESS PLAN ===\n${results.plan}\n\n=== PITCH SCRIPT ===\n${results.pitch}\n\n=== LANDING PAGE COPY ===\n${results.landing}`;
    const lines = doc.splitTextToSize(content, 180);
    let y = 10;
    for (const line of lines) {
      if (y > 280) { doc.addPage(); y = 10; }
      doc.setFontSize(10);
      doc.text(line, 15, y);
      y += 6;
    }
    doc.save(`foundertion-${idea.slice(0, 20).replace(/\s+/g, "-")}.pdf`);
    setExported(true);
    setTimeout(() => setExported(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/android-chrome-192.png" alt="Foundertion" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-xl">Foundertion</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">YOUR AI CO-FOUNDER</span>
          </div>
          <div className="flex items-center gap-3">
            {streak > 1 && (
              <div className="flex items-center gap-1 text-sm font-bold text-orange-400">
                <Flame className="h-4 w-4" />
                {streak} day streak
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">

        {/* 70-85% Rescue Banner */}
        {showRescue && memory && (
          <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <p className="font-bold text-amber-500 mb-1">🚨 Don&apos;t quit at 70-85%!</p>
            <p className="text-sm text-muted-foreground mb-3">
              You were working on: <strong className="text-foreground">&quot;{memory.idea.slice(0, 60)}...&quot;</strong>
              <br />Last session: {new Date(memory.savedAt).toLocaleDateString()}. Let&apos;s keep shipping!
            </p>
            <div className="flex gap-2">
              <button onClick={loadMemory} className="px-4 py-2 rounded-lg bg-amber-500 text-black text-sm font-bold hover:bg-amber-400">
                Resume Project →
              </button>
              <button onClick={() => setShowRescue(false)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">
                Start New
              </button>
            </div>
          </div>
        )}

        {/* Previous project hint */}
        {memory && !showRescue && !results && (
          <div className="mb-4 p-3 rounded-lg bg-primary/5 border border-primary/20 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              🧠 Last project: <strong className="text-foreground">&quot;{memory.idea.slice(0, 50)}&quot;</strong>
            </p>
            <button onClick={loadMemory} className="text-xs text-primary hover:underline">Resume →</button>
          </div>
        )}

        {!results && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6 border border-primary/20">
              <Globe className="h-4 w-4" />
              <span>Auto-detects 20+ languages · Generate → Execute → Ship</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Foundertion</h1>
            <p className="text-xl text-muted-foreground mb-2">AI Co-Founder that remembers. And pushes you to ship.</p>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm">Write your idea in any language. Get validation, 90-day plan, pitch script & landing copy. Then we make sure you ship it.</p>
          </div>
        )}

        <div className="max-w-2xl mx-auto mb-8">
          <div className="rounded-xl border-2 border-primary/20 bg-card p-6 shadow-xl">
            <textarea
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder="Describe your startup idea in any language..."
              className="w-full min-h-[120px] p-4 rounded-lg border border-input bg-background/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base"
              disabled={loading}
            />
            <div className="mt-4 flex gap-3 justify-end flex-wrap">
              {results && (
                <button onClick={() => { setResults(null); setIdea(""); }} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent">
                  New Idea
                </button>
              )}
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50"
              >
                {loading ? "Generating..." : "⚡ Generate All 4 Tools"}
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

            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex justify-end mb-3">
                <CopyButton text={getTabContent(results, activeTab)} />
              </div>
              {activeTab === "validation" && <MD text={results.validation} />}
              {activeTab === "plan" && <MD text={results.plan} />}
              {activeTab === "pitch" && <MD text={results.pitch} />}
              {activeTab === "landing" && <MD text={results.landing} />}
            </div>

            {/* Ship reminder */}
            <div className="mt-6 p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
              <p className="font-bold text-primary mb-1">🚢 Now ship it. Don&apos;t wait for perfect.</p>
              <p className="text-sm text-muted-foreground">Done is better than perfect. The 70-85% zone is where projects die. Push through.</p>
            </div>
          </div>
        )}
      </main>

      <WaitlistSection />
      <WaitlistSection />
      <footer className="border-t border-border/30 mt-12 py-6 text-center text-sm text-muted-foreground">
        Foundertion — AI Co-Founder for Solo Founders Worldwide
      </footer>
    </div>
  );
}
