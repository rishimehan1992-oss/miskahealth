import Script from "next/script";
import { GA_MEASUREMENT_ID, GOOGLE_ADS_ID } from "@/lib/google/analytics";
import GaDebugActivator from "./GaDebugActivator";

/**
 * GA4 + Google Ads (gtag.js) — single dataLayer, both IDs configured.
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
window.gtag('config', '${GOOGLE_ADS_ID}');
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
