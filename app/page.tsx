"use client";

import { useState, useRef } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Globe, Ship } from "lucide-react";

interface Results {
  detectedLang: string;
  validation: string;
  plan: string;
  pitch: string;
  landing: string;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-md hover:bg-primary/10 transition-colors text-primary">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
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

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [activeTab, setActiveTab] = useState("validation");

  const handleGenerate = async () => {
    if (!idea.trim() || idea.trim().length < 10) return alert("Idea too short (min 10 chars)");
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
    } catch {
      alert("Failed to generate. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Ship className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold text-xl">Foundertion</span>
            <span className="hidden sm:inline text-xs text-muted-foreground">YOUR AI CO-FOUNDER</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {!results && (
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6 border border-primary/20">
              <Globe className="h-4 w-4" />
              <span>Auto-detects 20+ languages</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">Foundertion</h1>
            <p className="text-xl text-muted-foreground mb-2">AI Co-Founder for Solo Founders</p>
            <p className="text-muted-foreground max-w-xl mx-auto">Write your idea in any language. AI validates, plans, pitches, and writes your landing page copy.</p>
          </div>
        )}

        <div className="max-w-2xl mx-auto mb-8">
          <div className="rounded-xl border-2 border-primary/20 bg-card p-6 shadow-xl">
            <textarea
              value={idea}
              onChange={e => setIdea(e.target.value)}
              placeholder="E.g., A SaaS app that helps SMBs manage inventory with AI..."
              className="w-full min-h-[120px] p-4 rounded-lg border border-input bg-background/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-base"
              disabled={loading}
            />
            <div className="mt-4 flex gap-3 justify-end">
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
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-full bg-primary/10 text-primary text-sm w-fit border border-primary/20">
              <Globe className="h-4 w-4" />
              <span>Language: {results.detectedLang}</span>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">
              {TABS.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${activeTab === tab.id ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-accent"}`}>
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-card p-6">
              {activeTab === "validation" && <MD text={results.validation} />}
              {activeTab === "plan" && <MD text={results.plan} />}
              {activeTab === "pitch" && <MD text={results.pitch} />}
              {activeTab === "landing" && <MD text={results.landing} />}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border/30 mt-12 py-6 text-center text-sm text-muted-foreground">
        Foundertion — Built for Solo Founders Worldwide
      </footer>
    </div>
  );
}
