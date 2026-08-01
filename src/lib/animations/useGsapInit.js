'use client';

import { useEffect } from 'react';

/**
 * useGsapInit — Client-only hook
 *
 * Initialises Lenis smooth scroll and wires it to GSAP ScrollTrigger.
 * Safe to call from a client component wrapping the layout — runs once,
 * cleans up on unmount.
 */
export default function useGsapInit() {
  useEffect(() => {
    let cancelled = false;

    async function init() {
      const { initLenis, destroyLenis } = await import('./scroll');
      if (cancelled) return;
      await initLenis();
    }

    init();

    return () => {
      cancelled = true;
      import('./scroll').then(({ destroyLenis }) => destroyLenis());
    };
  }, []);
}
