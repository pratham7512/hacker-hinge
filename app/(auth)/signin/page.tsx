"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function SignInPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCredentialsSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      redirect: true,
      callbackUrl: "/",
      email,
      password,
    });
    if (res?.error) setError(res.error);
    setLoading(false);
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || "Failed to sign up");
      }
      await signIn("credentials", { redirect: true, callbackUrl: "/", email, password });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-dvh flex items-center justify-center p-6">
      <div className="bg-[var(--card-bg)] border rounded-xl p-6 w-full max-w-sm" style={{ borderColor: "var(--card-border)" }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <img src="/logo-h.svg" alt="H" className="w-7 h-7" />
          <div className="text-base lowercase" style={{ opacity: 0.8 }}>hackerhinge</div>
        </div>
        <h1 className="text-lg mb-4 text-center">{mode === "signin" ? "sign in" : "create account"}</h1>
        <div className="space-y-3">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="rounded-md px-4 py-2 border w-full bg-transparent hover:opacity-80"
            style={{ borderColor: "var(--card-border)" }}
          >
            Continue with Google
          </button>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-subtle)" }}>
            <div className="h-px flex-1" style={{ background: "var(--card-border)" }} />
            <span>or</span>
            <div className="h-px flex-1" style={{ background: "var(--card-border)" }} />
          </div>
          <form onSubmit={mode === "signin" ? handleCredentialsSignIn : handleSignUp} className="space-y-3">
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-transparent border p-2 outline-none"
              style={{ borderColor: "var(--card-border)" }}
            />
            <input
              type="password"
              required
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-transparent border p-2 outline-none"
              style={{ borderColor: "var(--card-border)" }}
            />
            {error ? <div className="text-xs" style={{ color: "#d33" }}>{error}</div> : null}
            <button
              type="submit"
              disabled={loading}
              className="rounded-md px-4 py-2 w-full disabled:opacity-60 bg-[var(--accent)] text-black"
            >
              {loading ? "please wait" : mode === "signin" ? "sign in" : "sign up"}
            </button>
          </form>
          <button
            onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
            className="w-full text-xs underline hover:opacity-100"
            style={{ opacity: 0.7 }}
          >
            {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}


