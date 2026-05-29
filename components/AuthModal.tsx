"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [magicSent, setMagicSent] = useState(false);

  const supabase = createClient();

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMagicSent(true);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        onSuccess();
        onClose();
      }
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
    setLoading(false);
  };

  const handleMagicLink = async () => {
    if (!email.includes("@")) return setError("Enter a valid email");
    setLoading(true);
    setError("");
    try {
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      setMagicSent(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-primary/30 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-lg text-primary">
              {mode === "login" ? "Welcome back" : "Create account"}
            </h2>
            <p className="text-xs text-muted-foreground">Save your projects across devices</p>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-2xl leading-none">×</button>
        </div>

        {magicSent ? (
          <div className="text-center py-4">
            <div className="text-3xl mb-3">📧</div>
            <p className="font-bold text-primary mb-2">Check your email!</p>
            <p className="text-sm text-muted-foreground">We sent a confirmation link to <strong>{email}</strong></p>
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
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"/></div>
              <div className="relative flex justify-center"><span className="bg-card px-2 text-xs text-muted-foreground">or</span></div>
            </div>

            <button
              onClick={handleMagicLink}
              disabled={loading}
              className="w-full px-4 py-2 rounded-lg border border-border text-sm hover:bg-accent disabled:opacity-50"
            >
              Send Magic Link
            </button>

            <p className="text-center text-xs text-muted-foreground">
              {mode === "login" ? "No account?" : "Have an account?"}{" "}
              <button onClick={() => setMode(mode === "login" ? "register" : "login")} className="text-primary hover:underline">
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
