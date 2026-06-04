import Link from "next/link";
import Navbar from "@/components/Navbar";
import { labelCaps, pageShell } from "@/lib/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms for using the MISKA Hair & Skin Science website and purchasing products.",
};

export default function TermsPage() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <Navbar />
      <article className={`${pageShell} pt-28 sm:pt-32 pb-20 max-w-2xl`}>
        <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-4`}>Legal</p>
        <h1 className="font-serif text-[32px] sm:text-[40px] font-light text-[#0A0A0A] mb-8">Terms of Service</h1>
        <p className="text-[13px] text-[#999] mb-10">Last updated: May 2026</p>

        <div className="prose-legal space-y-6 text-[15px] text-[#666] leading-[1.9] font-light">
          <p>
            By using{" "}
            <Link href="/" className="text-[#1C3A2A] hover:underline">
              miskahealth.in
            </Link>{" "}
            (&quot;the Site&quot;) operated by MISKA Hair &amp; Skin Science, you agree to these terms. If you
            do not agree, please do not use the Site.
          </p>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Products &amp; orders</h2>
            <p>
              We sell hair and skin care products described on the Site. Prices, offers, and availability may
              change. An order is confirmed when payment is successfully processed. We may cancel orders for
              fraud prevention, stock issues, or legal compliance.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Shipping &amp; returns</h2>
            <p>
              Delivery is currently offered within India. Prepaid orders include free shipping; cash on delivery includes a ₹49 shipping fee shown at checkout.
              We do not accept returns. Exchanges for transit damage only are described in our{" "}
              <Link href="/return-policy" className="text-[#1C3A2A] hover:underline">
                Return &amp; Exchange Policy
              </Link>
              . Contact us for order-specific issues.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Accounts</h2>
            <p>
              You are responsible for keeping your sign-in credentials secure. Information you provide must be
              accurate. We may suspend accounts that misuse the Site or violate these terms.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Health disclaimer</h2>
            <p>
              Product descriptions are for general information. They are not medical advice. Consult a
              healthcare professional for serious scalp or skin conditions. Results vary by individual.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, MISKA is not liable for indirect or consequential damages
              arising from use of the Site or products. Our liability for any claim is limited to the amount you
              paid for the relevant order.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Governing law</h2>
            <p>
              These terms are governed by the laws of India. Disputes are subject to the courts of Bangalore,
              Karnataka, unless otherwise required by law.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Contact</h2>
            <p>
              <a href="mailto:support@miskahealth.in" className="text-[#1C3A2A] hover:underline">
                support@miskahealth.in
              </a>
            </p>
          </section>
        </div>

        <p className="mt-12 text-[12px] text-[#AAA]">
          <Link href="/return-policy" className="text-[#1C3A2A] hover:underline">
            Return Policy
          </Link>
          {" · "}
          <Link href="/privacy" className="text-[#1C3A2A] hover:underline">
            Privacy Policy
          </Link>
          {" · "}
          <Link href="/" className="text-[#1C3A2A] hover:underline">
            Home
          </Link>
        </p>
      </article>
    </main>
  );
}
