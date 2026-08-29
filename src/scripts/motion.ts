/**
 * Cross-browser parity for the scroll-driven reveals.
 *
 * Chromium runs them natively via `animation-timeline: view()`. Everywhere
 * else the matching `@supports not (...)` block in global.css puts the same
 * elements in their "from" state and waits for `.is-inview`, which this
 * observer adds at the same trigger distance.
 */

const SELECTOR = '.anim-reveal, .anim-rise-scroll, .anim-row';

export function initScrollReveals(): void {
  const supportsScrollTimeline =
    typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline', 'view()');

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = document.querySelectorAll<HTMLElement>(SELECTOR);

  if (supportsScrollTimeline || reducedMotion || !('IntersectionObserver' in window)) {
    // Native path, reduced motion, or no observer support: reveal everything.
    if (!supportsScrollTimeline) targets.forEach((el) => el.classList.add('is-inview'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-inview');
        observer.unobserve(entry.target);
      }
    },
    // ~18–26% of the element in view, matching the CSS `animation-range`.
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' },
  );

  targets.forEach((el) => observer.observe(el));
}
