/** Matches --site-top in globals.css (fixed header). */
const NAV_OFFSET = 96;

/** Scroll to an in-page section; retries until the element exists (post-navigation). */
export function scrollToSection(id: string, behavior: ScrollBehavior = "smooth") {
  const run = (attempt: number) => {
    const el = document.getElementById(id);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: Math.max(0, top), behavior: attempt > 0 ? "auto" : behavior });
      window.history.replaceState(null, "", `#${id}`);
      return;
    }
    if (attempt < 12) {
      requestAnimationFrame(() => run(attempt + 1));
    }
  };
  run(0);
}
