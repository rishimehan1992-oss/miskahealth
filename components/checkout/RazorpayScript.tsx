"use client";

import Script from "next/script";
import { createContext, useContext, useState, type ReactNode } from "react";

const RazorpayReadyContext = createContext(false);

export function RazorpayScriptProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const scriptReady =
    ready || (typeof window !== "undefined" && typeof window.Razorpay !== "undefined");

  return (
    <RazorpayReadyContext.Provider value={scriptReady}>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
        onReady={() => setReady(true)}
      />
      {children}
    </RazorpayReadyContext.Provider>
  );
}

export function useRazorpayReady() {
  return useContext(RazorpayReadyContext);
}
