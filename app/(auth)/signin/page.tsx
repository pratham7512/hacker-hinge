"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { TextShimmer } from "@/components/motion-primitives/text-shimmer";

export default function SignInPage() {
  const [mode, setMode] = useState<"signin" | "signup" | "verify">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
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
      // Send OTP and move to verify step
      await fetch("/api/auth/request-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setMode("verify");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const r = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, code, password }),
      });
      if (!r.ok) {
        const data = await r.json().catch(() => ({}));
        throw new Error(data.error || "Verification failed");
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
            className="rounded-md px-4 py-2 border w-full bg-white text-black hover:opacity-90"
          >
            Continue with Google
          </button>
          <div className="flex items-center gap-2 text-xs" style={{ color: "var(--text-subtle)" }}>
            <div className="h-px flex-1" style={{ background: "var(--card-border)" }} />
            <span>or</span>
            <div className="h-px flex-1" style={{ background: "var(--card-border)" }} />
          </div>
          {mode === "verify" ? (
            <form onSubmit={handleVerify} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                required
                placeholder="6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full rounded-md bg-transparent border p-2 outline-none"
                style={{ borderColor: "var(--card-border)" }}
              />
              {error ? <div className="text-xs" style={{ color: "#d33" }}>{error}</div> : null}
              <button
                type="submit"
                disabled={loading}
                className="rounded-md px-4 py-2 w-full disabled:opacity-60 bg-white text-black"
              >
                {loading ? (<TextShimmer className="inline">verifying</TextShimmer>) : "verify"}
              </button>
              <button
                type="button"
                onClick={async () => {
                  setLoading(true);
                  setError(null);
                  try {
                    await fetch("/api/auth/request-otp", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
                  } catch {}
                  setLoading(false);
                }}
                className="w-full text-xs underline hover:opacity-100"
                style={{ opacity: 0.7 }}
              >
                resend code
              </button>
            </form>
          ) : (
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
              className="rounded-md px-4 py-2 w-full disabled:opacity-60 bg-white text-black"
            >
              {loading ? (<TextShimmer className="inline">please wait</TextShimmer>) : mode === "signin" ? "sign in" : "sign up"}
            </button>
            </form>
          )}
          <button
            onClick={() => setMode((m) => (m === "signin" ? "signup" : m === "signup" ? "signin" : "signin"))}
            className="w-full text-xs underline hover:opacity-100"
            style={{ opacity: 0.7 }}
          >
            {mode === "signin" ? "Don't have an account? Sign up" : mode === "signup" ? "Already have an account? Sign in" : "Back to sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}


