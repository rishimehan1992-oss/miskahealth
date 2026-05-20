"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";

type Config = {
  googleAuthEnabled: boolean;
  supabaseConfigured: boolean;
};

export default function GoogleSignInPanel({ onContinue }: { onContinue?: () => void }) {
  const [config, setConfig] = useState<Config | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/checkout/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig({ googleAuthEnabled: false, supabaseConfigured: false }));
  }, []);

  const enabled = config?.googleAuthEnabled;

  const handleSignIn = async () => {
    if (!enabled) return;
    setLoading(true);
    // Wired when Supabase Google OAuth is connected
    window.location.href = "/api/auth/google";
    setLoading(false);
  };

  return (
    <div className="bg-white border border-[#E5E2DB] p-8 sm:p-10">
      <div className="flex items-start gap-4 mb-8">
        <span className="w-10 h-10 flex items-center justify-center bg-[#F0EDE7] text-[#1C3A2A] shrink-0">
          <Shield size={18} />
        </span>
        <div>
          <h2 className="font-serif text-[22px] font-light text-[#0A0A0A] mb-2">Sign in to continue</h2>
          <p className="text-[14px] text-[#666] leading-[1.85] font-light max-w-md">
            Guest checkout saves your delivery details. Before payment, sign in with Google so we can confirm your
            order and send tracking updates.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleSignIn}
        disabled={!enabled || loading}
        className="w-full flex items-center justify-center gap-3 border border-[#E5E2DB] bg-white py-4 px-6 text-[13px] font-medium text-[#0A0A0A] hover:border-[#0A0A0A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-[#E5E2DB]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        {loading ? "Redirecting…" : "Continue with Google"}
      </button>

      {!enabled && (
        <p className="mt-5 text-[12px] text-[#999] leading-relaxed text-center">
          Google sign-in activates once Supabase is connected. Your shipping details are already saved for this
          session.
        </p>
      )}

      {process.env.NODE_ENV === "development" && onContinue && (
        <button
          type="button"
          onClick={onContinue}
          className="mt-4 w-full text-[10px] tracking-[0.12em] uppercase text-[#AAA] hover:text-[#666]"
        >
          Dev: skip to payment preview
        </button>
      )}
    </div>
  );
}
