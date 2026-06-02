"use client";

import { useEffect } from "react";
import { GA_MEASUREMENT_ID } from "@/lib/google/analytics";

function shouldDebug(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.location.search.includes("debug_ga=1")) return true;
    return localStorage.getItem("miska-ga-debug") === "1";
  } catch {
    return false;
  }
}

function enableGaDebug(): boolean {
  if (typeof window.gtag !== "function") return false;
  window.gtag("config", GA_MEASUREMENT_ID, { debug_mode: true });
  window.gtag("event", "miska_debug_ping", {
    send_to: GA_MEASUREMENT_ID,
    debug_mode: true,
  });
  console.info(
    "[MISKA GA] Debug mode enabled — open GA4 → Admin → DebugView (same Google account as Analytics)"
  );
  return true;
}

/**
 * Turns on GA4 debug_mode for DebugView when ?debug_ga=1 or localStorage flag is set.
 */
export default function GaDebugActivator() {
  useEffect(() => {
    if (!shouldDebug()) return;

    try {
      localStorage.setItem("miska-ga-debug", "1");
    } catch {
      /* ignore */
    }

    if (enableGaDebug()) return;

    const interval = window.setInterval(() => {
      if (enableGaDebug()) window.clearInterval(interval);
    }, 300);

    return () => window.clearInterval(interval);
  }, []);

  return null;
}
