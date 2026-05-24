"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";

type Props = {
  onContinue?: () => void;
};

export default function GoogleSignInPanel({ onContinue }: Props) {
  const { user, loading, googleEnabled, signInWithGoogle } = useAuth();
  const [signingIn, setSigningIn] = useState(false);

  const handleSignIn = async () => {
    if (!googleEnabled) return;
    setSigningIn(true);
    try {
      await signInWithGoogle("/checkout?step=pay");
    } finally {
      setSigningIn(false);
    }
  };

  if (loading) {
    return <p className="text-[14px] text-[#999] font-light py-8">Checking sign-in…</p>;
  }

  if (user) {
    return (
      <div className="shop-divider pt-10">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-4">Signed in</p>
        <p className="text-[15px] text-[#666] font-light leading-[1.9] mb-6">
          Signed in as <strong className="text-[#0A0A0A]">{user.email}</strong>
        </p>
        {onContinue && (
          <button
            type="button"
            onClick={onContinue}
            className="bg-[#1C3A2A] text-white py-4 px-10 text-[11px] tracking-[0.18em] uppercase font-semibold hover:bg-[#152d20]"
          >
            Continue to payment
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="shop-divider pt-10">
      <p className="text-[10px] tracking-[0.2em] uppercase text-[#1C3A2A] font-semibold mb-4">Account</p>
      <h2 className="font-serif text-[26px] sm:text-[30px] font-light text-[#0A0A0A] mb-4">Sign in to continue</h2>
      <p className="text-[15px] text-[#666] leading-[1.9] font-light max-w-lg mb-10">
        Sign in with Google to link your order to your account and receive tracking updates. You can also
        continue as a guest below.
      </p>

      <button
        type="button"
        onClick={handleSignIn}
        disabled={!googleEnabled || signingIn}
        className="w-full max-w-md flex items-center justify-center gap-3 border border-[#0A0A0A] py-4 px-6 text-[13px] font-medium text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-[#0A0A0A]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
        {signingIn ? "Redirecting…" : "Continue with Google"}
      </button>

      {!googleEnabled && (
        <p className="mt-6 text-[12px] text-[#999] leading-relaxed max-w-md font-light">
          Add Supabase keys to <code className="text-[11px]">.env.local</code> and set{" "}
          <code className="text-[11px]">NEXT_PUBLIC_GOOGLE_AUTH_ENABLED=true</code> after enabling Google in
          Supabase.
        </p>
      )}

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
