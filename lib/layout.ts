/** Shared horizontal page gutters — generous on mobile to avoid clipped letterforms */
export const pageGutter =
  "pl-[max(1.5rem,env(safe-area-inset-left,0px))] pr-[max(1.5rem,env(safe-area-inset-right,0px))] sm:pl-12 sm:pr-12 lg:pl-16 lg:pr-16 xl:pl-20 xl:pr-20";

export const pageShell = `max-w-6xl mx-auto w-full min-w-0 ${pageGutter}`;

/** Uppercase labels — tighter tracking on small screens so first letters stay in view */
export const labelCaps = "uppercase tracking-[0.16em] sm:tracking-[0.24em] lg:tracking-[0.28em]";
