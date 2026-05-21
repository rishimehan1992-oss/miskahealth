"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  onContinue?: () => void;
  defaultEmail?: string;
};

type Mode = "signin" | "signup";

export default function AccountSignInPanel({ onContinue, defaultEmail = "" }: Props) {
  const { user, loading, authEnabled, signInWithEmail, signUpWithEmail, signOut } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setBusy(true);

    if (mode === "signin") {
      const { error: err } = await signInWithEmail(email.trim(), password);
      if (err) setError(err);
      else setMessage("Signed in successfully.");
    } else {
      if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        setBusy(false);
        return;
      }
      const { error: err } = await signUpWithEmail(email.trim(), password, fullName.trim());
      if (err) {
        setError(err);
      } else {
        setMessage(
          "Account created. If email confirmation is enabled in Supabase, check your inbox — then sign in. Otherwise continue below."
        );
        setMode("signin");
      }
    }
    setBusy(false);
  };

  if (loading) {
    return <p className="text-[14px] text-[#999] font-light py-8">Loading…</p>;
  }

  if (!authEnabled) {
    return (
      <p className="text-[14px] text-[#999] font-light max-w-md">
        Add Supabase keys to <code className="text-[11px]">.env.local</code> to enable sign-in.
      </p>
    );
  }

  if (user) {
    return (
      <div className="shop-divider pt-10 max-w-md">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-4">Signed in</p>
        <p className="text-[15px] text-[#666] font-light leading-[1.9] mb-6">
          Signed in as <strong className="text-[#0A0A0A]">{user.email}</strong>
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          {onContinue && (
            <button
              type="button"
              onClick={onContinue}
              className="flex-1 bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
            >
              Continue to payment
            </button>
          )}
          <button
            type="button"
            onClick={() => signOut()}
            className="flex-1 py-4 border border-[#CCC9C2] text-[11px] tracking-[0.15em] uppercase text-[#666] font-medium hover:border-[#0A0A0A]"
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-divider pt-10 max-w-md">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-4">Account</p>
      <h2 className="font-serif text-[26px] sm:text-[30px] font-light text-[#0A0A0A] mb-4">
        {mode === "signin" ? "Sign in" : "Create account"}
      </h2>
      <p className="text-[15px] text-[#666] font-light leading-[1.9] mb-8">
        Save your orders and track deliveries. Or continue as a guest below.
      </p>

      <div className="flex gap-6 mb-8 text-[11px] tracking-[0.12em] uppercase font-semibold">
        <button
          type="button"
          onClick={() => {
            setMode("signin");
            setError(null);
            setMessage(null);
          }}
          className={mode === "signin" ? "text-[#1C3A2A]" : "text-[#AAA] hover:text-[#666]"}
        >
          Sign in
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("signup");
            setError(null);
            setMessage(null);
          }}
          className={mode === "signup" ? "text-[#1C3A2A]" : "text-[#AAA] hover:text-[#666]"}
        >
          Create account
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {mode === "signup" && (
          <div>
            <label htmlFor="auth-name" className="block text-[10px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-2">
              Full name
            </label>
            <input
              id="auth-name"
              type="text"
              className="shop-input"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              required
            />
          </div>
        )}
        <div>
          <label htmlFor="auth-email" className="block text-[10px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-2">
            Email
          </label>
          <input
            id="auth-email"
            type="email"
            className="shop-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
        </div>
        <div>
          <label htmlFor="auth-password" className="block text-[10px] tracking-[0.14em] uppercase text-[#888] font-semibold mb-2">
            Password
          </label>
          <input
            id="auth-password"
            type="password"
            className="shop-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            required
            minLength={6}
          />
        </div>

        {error && <p className="text-[12px] text-[#B42318] font-light">{error}</p>}
        {message && <p className="text-[12px] text-[#1C3A2A] font-light">{message}</p>}

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-[#1C3A2A] text-white py-4 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20] disabled:opacity-50"
        >
          {busy ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
        </button>
      </form>

      {onContinue && (
        <button
          type="button"
          onClick={onContinue}
          className="mt-8 text-[10px] tracking-[0.14em] uppercase text-[#1C3A2A] font-semibold hover:underline"
        >
          Continue to payment without sign-in
        </button>
      )}
    </div>
  );
}
