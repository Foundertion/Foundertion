"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const getSupabase = async () => {
    const { createClient } = await import("@/lib/supabase");
    return createClient();
  };

  const handleGitHub = async () => {
    setGithubLoading(true);
    setError("");
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: { redirectTo: "https://foundertion.vercel.app/auth/callback" }
      });
      if (error) throw error;
    } catch (e: any) {
      setError(e.message || "GitHub sign in failed");
      setGithubLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    setError("");
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: "https://foundertion.vercel.app/auth/callback" }
      });
      if (error) throw error;
    } catch (e: any) {
      setError(e.message || "Google sign in failed");
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!email.includes("@")) return setError("Enter valid email");
    if (password.length < 6) return setError("Password min 6 characters");
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const supabase = await getSupabase();
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: "https://foundertion.vercel.app/auth/callback" }
        });
        if (error) throw error;
        setSuccess("Check your email for confirmation link!");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          setSuccess("Signed in! Redirecting...");
          setTimeout(() => router.push("/"), 1000);
        }
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email.includes("@")) return setError("Enter valid email");
    setLoading(true);
    setError(""); setSuccess("");
    try {
      const supabase = await getSupabase();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: "https://foundertion.vercel.app/auth/callback" }
      });
      if (error) throw error;
      setSuccess("Magic link sent! Check your email.");
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div className="text-center mb-6">
          <img src="/android-chrome-192.png" alt="Foundertion" className="h-12 w-12 rounded-xl mx-auto mb-3" />
          <h1 className="font-bold text-xl text-primary">Foundertion</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === "login" ? "Welcome back 👋" : "Join solo founders worldwide 🌍"}
          </p>
        </div>

        <div className="space-y-3">
          {/* Google OAuth */}
          <button onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-accent text-sm font-medium disabled:opacity-50 transition-all">
            {googleLoading ? "Redirecting..." : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* GitHub OAuth */}
          <button onClick={handleGitHub} disabled={githubLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-lg border border-border bg-card hover:bg-accent text-sm font-medium disabled:opacity-50 transition-all">
            {githubLoading ? "Redirecting..." : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                Continue with GitHub
              </>
            )}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"/></div>
            <div className="relative flex justify-center"><span className="bg-card px-2 text-xs text-muted-foreground">or email</span></div>
          </div>

          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Password (min 6 characters)"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary" />

          {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30"><p className="text-red-400 text-xs">❌ {error}</p></div>}
          {success && <div className="p-3 rounded-lg bg-primary/10 border border-primary/30"><p className="text-primary text-xs">✅ {success}</p></div>}

          <button onClick={handleSubmit} disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50">
            {loading ? "Loading..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <button onClick={handleMagicLink} disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent disabled:opacity-50">
            Send Magic Link ✨
          </button>

          <p className="text-center text-xs text-muted-foreground pt-1">
            {mode === "login" ? "No account?" : "Have an account?"}{" "}
            <button onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
              className="text-primary hover:underline font-medium">
              {mode === "login" ? "Sign up free" : "Sign in"}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          <a href="/" className="hover:text-primary">← Back to Foundertion</a>
        </p>
      </div>
    </div>
  );
}
