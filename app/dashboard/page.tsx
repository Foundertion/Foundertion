"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [username, setUsername] = useState("");
  const [currentProject, setCurrentProject] = useState("");
  const [projectUrl, setProjectUrl] = useState("");
  const [twitter, setTwitter] = useState("");
  const [progress, setProgress] = useState(0);
  const [toast, setToast] = useState("");
  const [activeProject, setActiveProject] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import("@/lib/supabase");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();
      const p = profileData || { email: user.email, id: user.id };
      setProfile(p);
      setDisplayName(p.full_name || "");
      setBio(p.bio || "");
      setUsername(p.username || "");
      setCurrentProject(p.current_project || "");
      setProjectUrl(p.project_url || "");
      setTwitter(p.twitter || "");
      setProgress(p.progress || 0);
      setBio(p.bio || "");

      const { data: projectsData } = await supabase
        .from("projects").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setProjects(projectsData || []);
      if (projectsData && projectsData.length > 0) setActiveProject(projectsData[0]);
      setLoading(false);
    };
    load();
  }, [router]);

  const saveProfile = async () => {
    setSaving(true);
    const { createClient } = await import("@/lib/supabase");
    const supabase = createClient();
    const { error } = await supabase.from("profiles").upsert({
      id: profile.id,
      email: profile.email,
      full_name: displayName,
      bio,
      updated_at: new Date().toISOString(),
    });
    if (!error) {
      setProfile({ ...profile, full_name: displayName, bio });
      setEditing(false);
      showToast("Profile saved! ✅");
    }
    setSaving(false);
  };

  const signOut = async () => {
    const { createClient } = await import("@/lib/supabase");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const exportPDF = async (project: any) => {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const green = [63, 207, 142] as [number, number, number];
    const dark = [11, 26, 18] as [number, number, number];

    // Header
    doc.setFillColor(...dark);
    doc.rect(0, 0, 210, 30, "F");
    doc.setTextColor(...green);
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("FOUNDERTION", 15, 18);
    doc.setFontSize(9);
    doc.setTextColor(200, 220, 210);
    doc.text("YOUR AI CO-FOUNDER · foundertion.vercel.app", 15, 25);

    // Title
    doc.setTextColor(...dark);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Startup Kit", 15, 42);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 100, 90);
    doc.text(`Idea: ${project.idea?.slice(0, 80) || ""}`, 15, 50);
    doc.text(`Generated: ${new Date(project.created_at).toLocaleDateString()}`, 15, 57);

    // Divider
    doc.setDrawColor(...green);
    doc.setLineWidth(0.5);
    doc.line(15, 62, 195, 62);

    let y = 72;
    const sections = [
      { title: "IDEA VALIDATOR", content: project.validation },
      { title: "BUSINESS PLAN (90 DAYS)", content: project.plan },
      { title: "PITCH SCRIPT", content: project.pitch },
      { title: "LANDING PAGE COPY", content: project.landing },
    ];

    for (const section of sections) {
      if (!section.content) continue;
      if (y > 250) { doc.addPage(); y = 20; }

      // Section header
      doc.setFillColor(...green);
      doc.rect(15, y - 5, 180, 10, "F");
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text(section.title, 18, y + 1);
      y += 12;

      // Content
      doc.setTextColor(40, 60, 50);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      const clean = section.content.replace(/\*\*/g, "").replace(/## /g, "").replace(/### /g, "");
      const lines = doc.splitTextToSize(clean, 175);
      for (const line of lines) {
        if (y > 275) { doc.addPage(); y = 20; }
        doc.text(line, 15, y);
        y += 5;
      }
      y += 8;
    }

    // Footer on last page
    doc.setFillColor(...dark);
    doc.rect(0, 285, 210, 15, "F");
    doc.setTextColor(...green);
    doc.setFontSize(8);
    doc.text("Foundertion · AI Co-Founder for Solo Founders · foundertion.vercel.app", 15, 293);

    doc.save(`foundertion-${project.name?.slice(0, 20) || "startup"}.pdf`);
    showToast("PDF exported! 📄");
  };

  const getProgress = (project: any) => {
    const v = project.validation ? 33 : 0;
    const p = project.plan ? 33 : 0;
    const pi = project.pitch ? 17 : 0;
    const l = project.landing ? 17 : 0;
    return v + p + pi + l;
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm animate-pulse">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-primary text-primary-foreground px-4 py-3 rounded-xl shadow-lg text-sm font-bold">
          {toast}
        </div>
      )}

      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/android-chrome-192.png" alt="Foundertion" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-xl text-primary">Dashboard</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="/" className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent">← App</a>
            <button onClick={signOut} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-bold hover:bg-primary/20">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">

        {/* Profile Card */}
        <div className="bg-card border border-primary/20 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary flex-shrink-0">
              {(profile?.full_name || profile?.email)?.[0]?.toUpperCase() || "F"}
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-3">
                  <input value={displayName} onChange={e => setDisplayName(e.target.value)}
                    placeholder="Display name" className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <textarea value={bio} onChange={e => setBio(e.target.value)}
                    placeholder="Short bio — what are you building?" rows={2}
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-none" />
                  <input value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="username (letters, numbers, underscore)"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input value={currentProject} onChange={e => setCurrentProject(e.target.value)}
                    placeholder="What are you currently building?"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input value={projectUrl} onChange={e => setProjectUrl(e.target.value)}
                    placeholder="Project URL (https://...)"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <input value={twitter} onChange={e => setTwitter(e.target.value)}
                    placeholder="Twitter/X username (without @)"
                    className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Progress: {progress}%</label>
                    <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(Number(e.target.value))}
                      className="w-full accent-primary" />
                  </div>
                  <div className="flex gap-2">
                    <button onClick={saveProfile} disabled={saving}
                      className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 disabled:opacity-50">
                      {saving ? "Saving..." : "Save Profile"}
                    </button>
                    <button onClick={() => setEditing(false)} className="px-4 py-2 rounded-lg border border-border text-xs hover:bg-accent">Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-lg">{profile?.full_name || profile?.email?.split("@")[0]}</h2>
                    <button onClick={() => setEditing(true)} className="text-xs text-muted-foreground hover:text-primary">✏️ Edit</button>
                  </div>
                  <p className="text-sm text-muted-foreground">{profile?.email}</p>
                  {profile?.bio && <p className="text-sm text-muted-foreground mt-1 italic">{profile.bio}</p>}
                  {profile?.username && (
                    <a href={"/profile/" + profile.username} target="_blank"
                      className="text-xs text-primary hover:underline mt-1 block">
                      🔗 foundertion.vercel.app/profile/{profile.username}
                    </a>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-orange-400 font-bold">🔥 {profile?.streak || 1} day streak</span>
                    <span className="text-xs text-muted-foreground">· {projects.length} projects</span>
                    <span className="text-xs text-muted-foreground">· Member since {new Date(profile?.created_at || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Active Project Dashboard */}
        {activeProject && (
          <div className="bg-card border border-primary/20 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary">Active Project</h3>
              <span className="text-xs text-muted-foreground">{new Date(activeProject.created_at).toLocaleDateString()}</span>
            </div>

            <p className="text-sm font-medium mb-4 line-clamp-2">{activeProject.idea}</p>

            {/* Progress bars */}
            <div className="space-y-3 mb-4">
              {[
                { label: "Idea Validation", done: !!activeProject.validation, pct: activeProject.validation ? 100 : 0 },
                { label: "Business Plan", done: !!activeProject.plan, pct: activeProject.plan ? 100 : 0 },
                { label: "Pitch Script", done: !!activeProject.pitch, pct: activeProject.pitch ? 100 : 0 },
                { label: "Landing Page", done: !!activeProject.landing, pct: activeProject.landing ? 100 : 0 },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className={item.done ? "text-primary font-bold" : "text-muted-foreground"}>{item.done ? "✓ Done" : "Pending"}</span>
                  </div>
                  <div className="h-2 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Overall progress */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
              <div className="flex justify-between text-xs mb-1">
                <span className="font-bold text-primary">Overall Progress</span>
                <span className="font-bold text-primary">{getProgress(activeProject)}%</span>
              </div>
              <div className="h-3 bg-border rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${getProgress(activeProject)}%` }} />
              </div>
              {getProgress(activeProject) >= 70 && getProgress(activeProject) < 100 && (
                <p className="text-xs text-amber-500 font-bold mt-2">🚨 You are in the 70-85% zone — don&apos;t quit now! Ship it.</p>
              )}
            </div>

            {/* Next Action */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mb-4">
              <p className="text-xs font-bold text-primary mb-1">🎯 Next Action</p>
              <p className="text-xs text-muted-foreground">
                {!activeProject.validation ? "Generate your Idea Validator first →" :
                 !activeProject.plan ? "Create your 90-day Business Plan →" :
                 !activeProject.pitch ? "Write your Pitch Script →" :
                 !activeProject.landing ? "Write Landing Page Copy →" :
                 "All done! Share your landing page with 10 potential users today."}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-2 flex-wrap">
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90">
                Continue Building →
              </a>
              <button onClick={() => exportPDF(activeProject)}
                className="px-4 py-2 rounded-lg border border-border text-xs hover:bg-accent">
                📄 Export PDF
              </button>
              <a href="/" className="px-4 py-2 rounded-lg border border-primary/30 text-primary text-xs hover:bg-primary/10">
                ✅ Daily Check-in
              </a>
            </div>
          </div>
        )}

        {/* All Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">All Projects ({projects.length})</h3>
            <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90">+ New</a>
          </div>

          {projects.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-3xl mb-3">🚀</p>
              <p className="font-bold mb-2">No projects yet</p>
              <p className="text-sm text-muted-foreground mb-4">Generate your first startup kit!</p>
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90">Start Building →</a>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(p => (
                <div key={p.id}
                  onClick={() => setActiveProject(p)}
                  className={`bg-card border rounded-xl p-4 cursor-pointer transition-all hover:border-primary/40 ${activeProject?.id === p.id ? "border-primary/50 bg-primary/5" : "border-border"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{p.idea?.slice(0, 60)}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs font-bold text-primary">{getProgress(p)}%</span>
                      <button onClick={e => { e.stopPropagation(); exportPDF(p); }}
                        className="text-xs px-2 py-1 rounded border border-border hover:bg-accent">PDF</button>
                    </div>
                  </div>
                  <div className="mt-2 h-1.5 bg-border rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${getProgress(p)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
