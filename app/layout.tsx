import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import SiteChrome from "@/components/SiteChrome";

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const APP_NAME = "MISKA Hair & Skin Science";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "Clinical-grade rosemary hair oil and treatment shampoo. Clinic formulated in Bangalore.",
  openGraph: {
    siteName: APP_NAME,
    type: "website",
    locale: "en_IN",
    url: "https://www.miskahealth.in",
  },
  metadataBase: new URL("https://www.miskahealth.in"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${playfair.variable} antialiased`}>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '361663834336541');
fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=361663834336541&ev=PageView&noscript=1"
          />
        </noscript>
        <AuthProvider>
          <CartProvider>
            <Suspense fallback={null}>
              <SiteChrome>{children}</SiteChrome>
            </Suspense>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
