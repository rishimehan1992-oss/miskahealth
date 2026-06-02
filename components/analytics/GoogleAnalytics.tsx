import Script from "next/script";
import { GA_MEASUREMENT_ID } from "@/lib/google/analytics";
import GaDebugActivator from "./GaDebugActivator";

/**
 * GA4 in root layout (server). DebugView via GaDebugActivator + ?debug_ga=1
 */
export default function GoogleAnalytics() {
  return (
    <>
      <Script id="google-analytics-init" strategy="beforeInteractive">
        {`
window.dataLayer = window.dataLayer || [];
window.gtag = function(){window.dataLayer.push(arguments);};
window.gtag('js', new Date());
window.gtag('config', '${GA_MEASUREMENT_ID}');
        `}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <GaDebugActivator />
    </>
  );
}
