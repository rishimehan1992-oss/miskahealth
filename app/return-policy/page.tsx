import Link from "next/link";
import Navbar from "@/components/Navbar";
import { labelCaps, pageShell } from "@/lib/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Return & Exchange Policy",
  description:
    "MISKA return and exchange policy: no returns; exchange only for transit damage, assessed at our discretion. India orders on miskahealth.in.",
  alternates: { canonical: "https://www.miskahealth.in/return-policy" },
};

export default function ReturnPolicyPage() {
  return (
    <main className="bg-[#F9F8F5] min-h-screen overflow-x-clip">
      <Navbar />
      <article className={`${pageShell} pt-28 sm:pt-32 pb-20 max-w-2xl`}>
        <p className={`text-[10px] ${labelCaps} text-[#1C3A2A] font-semibold mb-4`}>Legal</p>
        <h1 className="font-serif text-[32px] sm:text-[40px] font-light text-[#0A0A0A] mb-8">
          Return &amp; Exchange Policy
        </h1>
        <p className="text-[13px] text-[#999] mb-10">Last updated: June 2026</p>

        <div className="prose-legal space-y-6 text-[15px] text-[#666] leading-[1.9] font-light">
          <p>
            This policy applies to purchases made on{" "}
            <Link href="/" className="text-[#1C3A2A] hover:underline">
              miskahealth.in
            </Link>{" "}
            (&quot;MISKA&quot;, &quot;we&quot;, &quot;us&quot;). By placing an order, you agree to the terms
            below.
          </p>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">No returns</h2>
            <p>
              We do <strong className="text-[#0A0A0A] font-medium">not accept returns</strong> for change of
              mind, wrong selection, opened or used products, allergic reactions, or dissatisfaction with
              results. All sales are final once an order is confirmed and dispatched, except as stated below
              for transit damage.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Exchange for transit damage only</h2>
            <p>
              If your order arrives <strong className="text-[#0A0A0A] font-medium">damaged in transit</strong>{" "}
              (e.g. broken bottle, leaking seal, crushed packaging that affects the product), you may request
              an <strong className="text-[#0A0A0A] font-medium">exchange</strong> of the same product — not a
              cash refund.
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-3">
              <li>Contact us within <strong className="text-[#0A0A0A] font-medium">48 hours</strong> of delivery with your order ID, photos of the outer package, inner packaging, and damaged product.</li>
              <li>Keep all packaging until we confirm next steps.</li>
              <li>We may ask for additional proof (video, courier remarks, etc.) to assess the claim.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Our discretion</h2>
            <p>
              Whether damage qualifies as transit-related and whether an exchange is approved is determined by{" "}
              <strong className="text-[#0A0A0A] font-medium">MISKA at our sole discretion</strong>. We are not
              obliged to approve every request. Claims that appear to result from misuse, storage after
              delivery, normal transit marks that do not affect the product, or requests made outside the
              48-hour window may be declined.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">What we do not cover</h2>
            <ul className="list-disc pl-5 space-y-2">
              <li>Returns or refunds for any reason other than approved transit-damage exchange.</li>
              <li>Minor cosmetic box dents that do not affect the product inside.</li>
              <li>Delays caused by couriers beyond our control (we will help trace the shipment).</li>
              <li>Incorrect address or failed delivery attempts due to customer-provided details.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Approved exchange process</h2>
            <p>
              If we approve your claim, we will arrange a replacement shipment to the same delivery address.
              You may be asked to return or dispose of the damaged unit as we instruct. Exchange timelines
              depend on stock and courier availability in your pin code.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Prepaid &amp; COD orders</h2>
            <p>
              For prepaid orders, an approved transit-damage claim is resolved by exchange, not a payment
              reversal. For cash-on-delivery orders, exchange applies the same way; we do not refund cash
              already collected on delivery except where required by applicable law.
            </p>
          </section>

          <section>
            <h2 className="text-[#0A0A0A] font-medium text-[17px] mb-2">Contact</h2>
            <p>
              For transit-damage claims or order questions:{" "}
              <a href="mailto:support@miskahealth.in" className="text-[#1C3A2A] hover:underline">
                support@miskahealth.in
              </a>
              <br />
              Include your <strong className="text-[#0A0A0A] font-medium">order ID</strong> and clear photos in
              your first message.
            </p>
          </section>
        </div>

        <p className="mt-12 text-[12px] text-[#AAA]">
          <Link href="/terms" className="text-[#1C3A2A] hover:underline">
            Terms of Service
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
