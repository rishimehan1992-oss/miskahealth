"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import GoogleSignInButton from "@/components/auth/GoogleSignInButton";

type Props = {
  defaultEmail?: string;
  onSignedIn?: () => void;
};

type Mode = "signin" | "signup";

export default function CompactAuth({ defaultEmail = "", onSignedIn }: Props) {
  const { user, loading, authEnabled, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const [emailOpen, setEmailOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (loading || !authEnabled) return null;

  if (user) {
    return (
      <div className="mb-6 flex items-center justify-between gap-3 py-3 px-3 bg-[#1C3A2A]/5 border border-[#1C3A2A]/15 text-[13px]">
        <span className="text-[#666] truncate">
          Signed in as <strong className="text-[#0A0A0A]">{user.email}</strong>
        </span>
        <button
          type="button"
          onClick={() => signOut()}
          className="shrink-0 text-[10px] tracking-[0.12em] uppercase font-semibold text-[#1C3A2A] hover:underline"
        >
          Sign out
        </button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    if (mode === "signin") {
      const { error: err } = await signInWithEmail(email.trim(), password);
      if (err) setError(err);
      else onSignedIn?.();
    } else {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setBusy(false);
        return;
      }
      const { error: err } = await signUpWithEmail(email.trim(), password, fullName.trim());
      if (err) setError(err);
      else {
        setMode("signin");
        setError(null);
      }
    }
    setBusy(false);
  };

  return (
    <div className="mb-6 space-y-3">
      <p className="text-[10px] tracking-[0.14em] uppercase text-[#888] font-semibold">Account (optional)</p>

      <GoogleSignInButton redirectPath="/checkout?step=pay" />

      <button
        type="button"
        onClick={() => setEmailOpen((v) => !v)}
        className="w-full text-left py-2.5 px-3 border border-[#E5E2DB] text-[12px] text-[#888] hover:border-[#999]"
      >
        Sign in with email instead
        <span className="float-right text-[#AAA]">{emailOpen ? "−" : "+"}</span>
      </button>

      {emailOpen && (
        <form onSubmit={handleSubmit} className="p-3 border border-[#E5E2DB] space-y-4">
          <div className="flex gap-4 text-[10px] tracking-[0.12em] uppercase font-semibold">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={mode === "signin" ? "text-[#1C3A2A]" : "text-[#AAA]"}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={mode === "signup" ? "text-[#1C3A2A]" : "text-[#AAA]"}
            >
              Create account
            </button>
          </div>
          {mode === "signup" && (
            <input
              type="text"
              className="shop-input"
              placeholder="Full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            className="shop-input"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="shop-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />
          {error && <p className="text-[11px] text-[#B42318]">{error}</p>}
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-[#1C3A2A] text-white py-3 text-[10px] tracking-[0.15em] uppercase font-semibold disabled:opacity-50"
          >
            {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>
      )}
    </div>
  );
}
