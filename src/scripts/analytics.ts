/**
 * Thin analytics shim. Both ORDER NOW buttons (header, floating, menu column)
 * and the hero's ORDER PICKUP call `track()` on click.
 *
 * It forwards to whatever is on the page — GTM's dataLayer, a global gtag, or
 * Plausible — and always dispatches a `cm:track` CustomEvent so any other tag
 * manager can listen. With no provider installed it is a no-op.
 */

type Payload = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Payload }) => void;
  }
}

export function track(event: string, props: Payload = {}): void {
  if (typeof window === 'undefined') return;

  try {
    window.dataLayer?.push({ event, ...props });
    window.gtag?.('event', event, props);
    window.plausible?.(event, { props });
    window.dispatchEvent(new CustomEvent('cm:track', { detail: { event, ...props } }));
  } catch {
    /* Analytics must never break the page. */
  }
}

/** Wires every `[data-track]` element on the page. */
export function bindTracking(root: ParentNode = document): void {
  root.querySelectorAll<HTMLElement>('[data-track]').forEach((el) => {
    el.addEventListener('click', () => {
      track(el.dataset.track!, {
        location: el.dataset.trackLocation ?? 'unknown',
        href: el instanceof HTMLAnchorElement ? el.href : undefined,
      });
    });
  });
}
