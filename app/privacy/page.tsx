import Link from "next/link";
import Navbar from "@/components/Navbar";
import { labelCaps, pageShell } from "@/lib/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How MISKA Hair & Skin Science collects and uses your information.",
};

export default function PrivacyPage() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <Navbar />
      <article className={`${pageShell} pt-28 sm:pt-32 pb-20 max-w-2xl`}>
        <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-4`}>Legal</p>
        <h1 className="font-serif text-[32px] sm:text-[40px] font-light text-[#0A0A0A] mb-8">Privacy Policy</h1>
        <p className="text-[13px] text-[#999] mb-10">Last updated: May 2026</p>

        <div className="prose-legal space-y-6 text-[15px] text-[#666] leading-[1.9] font-light">
          <p>
            MISKA Hair &amp; Skin Science (&quot;MISKA&quot;, &quot;we&quot;, &quot;us&quot;) operates{" "}
            <Link href="/" className="text-[#1C3A2A] hover:underline">
              miskahealth.in
            </Link>
            . This policy explains what information we collect when you use our website, create an account, or
            place an order.
          </p>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Information we collect</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Name, email, phone number, and delivery address when you check out or save an address.</li>
              <li>Account details if you sign in with email or Google (via our auth provider, Supabase).</li>
              <li>Order history, payment status, and cart data needed to fulfil your purchase.</li>
              <li>Basic technical data (browser, device, pages visited) for site security and performance.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">How we use it</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Process and deliver orders, send confirmations, and provide customer support.</li>
              <li>Operate sign-in, saved addresses, and order history for registered users.</li>
              <li>Process payments securely through Razorpay (we do not store full card or UPI credentials).</li>
              <li>Improve our website and comply with applicable law.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Sharing</h2>
            <p>
              We share data only with service providers needed to run the store (e.g. payment processing,
              hosting, authentication) and when required by law. We do not sell your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Retention &amp; security</h2>
            <p>
              We keep order and account data as long as needed for business, tax, and legal purposes. We use
              industry-standard measures to protect data in transit and at rest.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Your choices</h2>
            <p>
              You may request access, correction, or deletion of your personal data by contacting us. You can
              sign out of your account at any time from checkout.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Contact</h2>
            <p>
              Questions about this policy:{" "}
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
          <Link href="/terms" className="text-[#1C3A2A] hover:underline">
            Terms of Service
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
