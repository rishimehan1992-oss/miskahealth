import { CHECKOUT_STEPS, type CheckoutStep } from "@/lib/checkout/types";

type Props = {
  current: CheckoutStep;
};

export default function CheckoutProgress({ current }: Props) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Checkout progress" className="mb-12 sm:mb-16 pb-8 shop-divider">
      <ol className="flex items-center justify-between max-w-lg">
        {CHECKOUT_STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex flex-col items-center gap-2 flex-1">
              <span
                className={`text-[10px] tracking-[0.14em] uppercase font-semibold ${
                  active ? "text-[#1C3A2A]" : done ? "text-[#666]" : "text-[#CCC]"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                className={`text-[9px] sm:text-[10px] tracking-[0.1em] uppercase text-center ${
                  active ? "text-[#0A0A0A] font-semibold" : "text-[#999]"
                }`}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
