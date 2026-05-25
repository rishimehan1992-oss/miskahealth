import type { Metadata } from "next";
import { Suspense } from "react";
import { Geist } from "next/font/google";
import { Playfair_Display } from "next/font/google";
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
