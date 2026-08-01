'use client';

import useGsapInit from '@/lib/animations/useGsapInit';

/**
 * ClientProviders — thin client wrapper so layout.js stays a server component.
 * Bootstraps Lenis + GSAP once for the whole app.
 */
export default function ClientProviders({ children }) {
  useGsapInit();
  return <>{children}</>;
}
