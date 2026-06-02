"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/google/analytics";

/**
 * Loads GA4 early; enables DebugView when URL contains ?debug_ga=1
 */
export default function GoogleAnalytics() {
  return (
    <>
      <Script id="google-analytics-init" strategy="beforeInteractive">
        {`
window.dataLayer = window.dataLayer || [];
window.gtag = function(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
var miskaGaDebug = typeof location !== 'undefined' && location.search.indexOf('debug_ga=1') !== -1;
window.gtag('config', '${GA_MEASUREMENT_ID}', miskaGaDebug ? { debug_mode: true } : {});
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
