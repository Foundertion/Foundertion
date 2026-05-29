"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const supabase = createClient();
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/");
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email.includes("@")) return setError("Enter valid email");
    setLoading(true);
    setError("");
    const supabase = createClient();
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <div className="text-center mb-6">
          <img src="/android-chrome-192.png" alt="Foundertion" className="h-12 w-12 rounded-xl mx-auto mb-3" />
          <h1 className="font-bold text-xl text-primary">Foundertion</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="text-4xl mb-3">📧</div>
            <p className="font-bold text-primary mb-2">Check your email!</p>
            <p className="text-sm text-muted-foreground">Confirmation link sent to <strong>{email}</strong></p>
          </div>
        ) : (
          <div className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />

            {error && <p className="text-red-400 text-xs">{error}</p>}

            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? "Loading..." : mode === "login" ? "Sign In" : "Create Account"}
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
              className="w-full px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent disabled:opacity-50"
            >
              Send Magic Link ✨
            </button>

            <p className="text-center text-xs text-muted-foreground pt-2">
              {mode === "login" ? "No account?" : "Have an account?"}{" "}
              <button
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-primary hover:underline"
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          <a href="/" className="hover:text-primary">← Back to Foundertion</a>
        </p>
      </div>
    </div>
  );
}
