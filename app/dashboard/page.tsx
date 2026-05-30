"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      const { createClient } = await import("@/lib/supabase");
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data: profileData } = await supabase
        .from("profiles").select("*").eq("id", user.id).single();
      setProfile(profileData || { email: user.email });

      const { data: projectsData } = await supabase
        .from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      setProjects(projectsData || []);
      setLoading(false);
    };
    load();
  }, [router]);

  const signOut = async () => {
    const { createClient } = await import("@/lib/supabase");
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/android-chrome-192.png" alt="Foundertion" className="h-8 w-8 rounded-lg" />
            <span className="font-bold text-xl text-primary">Dashboard</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:inline">{profile?.email}</span>
            <a href="/" className="px-3 py-1.5 rounded-lg border border-border text-xs hover:bg-accent">← App</a>
            <button onClick={signOut} className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs hover:bg-primary/20">Sign Out</button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Profile Card */}
        <div className="bg-card border border-primary/20 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-bold text-primary">
              {profile?.email?.[0]?.toUpperCase() || "F"}
            </div>
            <div>
              <h2 className="font-bold text-lg">{profile?.full_name || profile?.email?.split("@")[0]}</h2>
              <p className="text-sm text-muted-foreground">{profile?.email}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs text-orange-400 font-bold">🔥 {profile?.streak || 1} day streak</span>
                <span className="text-xs text-muted-foreground">· {projects.length} projects</span>
              </div>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Your Projects</h3>
            <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90">
              + New Project
            </a>
          </div>

          {projects.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-2xl mb-3">🚀</p>
              <p className="font-bold mb-2">No projects yet</p>
              <p className="text-sm text-muted-foreground mb-4">Generate your first startup kit to get started.</p>
              <a href="/" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90">
                Start Building →
              </a>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map(p => (
                <div key={p.id} className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1">{p.name || p.idea?.slice(0, 50)}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2">{p.idea}</p>
                      <p className="text-xs text-muted-foreground mt-2">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full ml-3">{p.language || "en"}</span>
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
