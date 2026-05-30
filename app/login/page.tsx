"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  const getSupabase = async () => {
    const { createClient } = await import("@/lib/supabase");
    return createClient();
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
          email,
          password,
          options: { emailRedirectTo: "https://foundertion.vercel.app/auth/callback" }
        });
        if (error) throw error;
        setSuccess("Check your email for confirmation link!");
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) {
          setSuccess("Signed in! Redirecting...");
          setTimeout(() => router.push("/"), 1500);
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
    setError("");
    setSuccess("");
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
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
            placeholder="Password (min 6 characters)"
            className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
              <p className="text-red-400 text-xs">❌ {error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/30">
              <p className="text-primary text-xs">✅ {success}</p>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50 transition-all"
          >
            {loading ? "⏳ Loading..." : mode === "login" ? "Sign In →" : "Create Account →"}
          </button>

          <div className="relative my-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"/>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-card px-2 text-xs text-muted-foreground">or</span>
            </div>
          </div>

          <button
            onClick={handleMagicLink}
            disabled={loading}
            className="w-full px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent disabled:opacity-50 transition-all"
          >
            Send Magic Link ✨
          </button>

          <p className="text-center text-xs text-muted-foreground pt-2">
            {mode === "login" ? "No account?" : "Have an account?"}{" "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); setSuccess(""); }}
              className="text-primary hover:underline font-medium"
            >
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
