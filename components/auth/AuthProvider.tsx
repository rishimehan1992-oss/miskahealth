"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isGoogleAuthEnabled, isSupabaseConfigured } from "@/lib/supabase/config";

type AuthResult = { error: string | null };

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  authEnabled: boolean;
  googleEnabled: boolean;
  signInWithEmail: (email: string, password: string) => Promise<AuthResult>;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<AuthResult>;
  signInWithGoogle: (redirectPath?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Prefer NEXT_PUBLIC_SITE_URL on Vercel so confirmation emails use production, not localhost. */
function getSiteOrigin() {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;
  if (typeof window !== "undefined") return window.location.origin;
  return "";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const authEnabled = isSupabaseConfigured();
  const googleEnabled = isGoogleAuthEnabled();

  const supabase = useMemo(() => {
    if (!authEnabled) return null;
    return createClient();
  }, [authEnabled]);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const signInWithEmail = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) return { error: "Sign-in is not configured." };
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      return { error: error?.message ?? null };
    },
    [supabase]
  );

  const signUpWithEmail = useCallback(
    async (email: string, password: string, fullName?: string): Promise<AuthResult> => {
      if (!supabase) return { error: "Sign-up is not configured." };
      const origin = getSiteOrigin();
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName ?? "" },
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent("/checkout?step=pay")}`,
        },
      });
      if (error) return { error: error.message };
      if (data.user && !data.session) {
        return {
          error: null,
          /* caller shows confirm-email message via needsConfirmation flag - pass as special message */
        };
      }
      return { error: null };
    },
    [supabase]
  );

  const signInWithGoogle = useCallback(
    async (redirectPath = "/checkout?step=pay") => {
      if (!supabase || !googleEnabled) return;
      const redirectTo = `${getSiteOrigin()}/auth/callback?next=${encodeURIComponent(redirectPath)}`;
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
    },
    [supabase, googleEnabled]
  );

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
  }, [supabase]);

  const value = useMemo(
    () => ({
      user,
      loading,
      authEnabled,
      googleEnabled,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    }),
    [
      user,
      loading,
      authEnabled,
      googleEnabled,
      signInWithEmail,
      signUpWithEmail,
      signInWithGoogle,
      signOut,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
