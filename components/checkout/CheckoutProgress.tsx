import { CHECKOUT_STEPS, type CheckoutStep } from "@/lib/checkout/types";

type Props = {
  current: CheckoutStep;
};

export default function CheckoutProgress({ current }: Props) {
  const currentIndex = CHECKOUT_STEPS.findIndex((s) => s.id === current);

  return (
    <nav aria-label="Checkout progress" className="mb-10 sm:mb-14">
      <ol className="flex items-center gap-0">
        {CHECKOUT_STEPS.map((step, i) => {
          const done = i < currentIndex;
          const active = step.id === current;
          return (
            <li key={step.id} className="flex items-center flex-1 last:flex-none min-w-0">
              <div className="flex flex-col items-center gap-2 min-w-0 flex-1">
                <span
                  className={`w-8 h-8 flex items-center justify-center text-[11px] font-semibold border transition-colors ${
                    active
                      ? "bg-[#1C3A2A] border-[#1C3A2A] text-white"
                      : done
                        ? "bg-[#1C3A2A]/10 border-[#1C3A2A] text-[#1C3A2A]"
                        : "bg-white border-[#E5E2DB] text-[#AAA]"
                  }`}
                >
                  {done ? "✓" : i + 1}
                </span>
                <span
                  className={`text-[9px] sm:text-[10px] tracking-[0.12em] uppercase text-center truncate w-full px-1 ${
                    active ? "text-[#0A0A0A] font-semibold" : "text-[#999]"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < CHECKOUT_STEPS.length - 1 && (
                <div
                  className={`h-px flex-1 mx-2 sm:mx-4 mb-6 ${done ? "bg-[#1C3A2A]/40" : "bg-[#E5E2DB]"}`}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
