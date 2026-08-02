/**
 * lib/animations/scroll.js
 *
 * Lenis smooth scroll + GSAP ScrollTrigger utilities.
 *
 * SYNC PATTERN (standard Lenis ↔ GSAP):
 *   gsap.ticker.add(time => lenis.raf(time * 1000))   ← drives Lenis from GSAP's rAF
 *   lenis.on('scroll', ScrollTrigger.update)           ← keeps ScrollTrigger positions in sync
 *   gsap.ticker.lagSmoothing(0)                        ← prevents stale frames on tab-switch
 *
 * All scroll animations are wrapped in gsap.matchMedia() so
 * prefers-reduced-motion users get instant reveals, no motion.
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis = null;

// Store the reference to the tick function so we can remove it properly later
function rafTicker(time) {
  if (lenis) {
    lenis.raf(time * 1000);
  }
}

/** Initialise Lenis and wire it into gsap.ticker */
export async function initLenis() {
  if (typeof window === 'undefined') return null;
  if (lenis) return lenis;

  const { default: Lenis } = await import('lenis');

  lenis = new Lenis({
    duration: 1.2,
    easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo-ease-out
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  // Sync: Lenis scroll → ScrollTrigger position update
  lenis.on('scroll', ScrollTrigger.update);

  // Sync: GSAP ticker → Lenis RAF
  gsap.ticker.add(rafTicker);

  // Prevent stale frames on tab visibility change
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function destroyLenis() {
  if (!lenis) return;
  gsap.ticker.remove(rafTicker);
  lenis.destroy();
  lenis = null;
}

export function getLenis() { return lenis; }

// ─── Animation helpers ──────────────────────────────────────────────────────

const EASE = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'; // site's organic-deceleration signature
const DURATION = 0.8;
const STAGGER  = 0.1;

/**
 * Generic section reveal — fades up from a small Y offset.
 * @param {Element|string} el  Target element or selector
 * @param {Object} opts        ScrollTrigger options override
 */
export function revealSection(el, opts = {}) {
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: DURATION,
        ease: EASE,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          end: 'top 55%',
          toggleActions: 'play none none none',
          ...opts,
        },
      },
    );
  });

  // prefers-reduced-motion: instant reveal, no tween
  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(el, { opacity: 1, y: 0 });
  });
}

/**
 * Headline line-split reveal — splits inner text into lines by wrapping words
 * into line spans, then staggers them in with a clip-path.
 *
 * @param {Element} headingEl  The heading element whose text to split
 */
export function revealHeadline(headingEl) {
  if (!headingEl) return;

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Hand-rolled line split: wrap every word in a span, then group by line
    const originalText = headingEl.innerHTML;
    const words = originalText.split(/(<br\s*\/?>|\n)/gi);

    // Reset and split
    const wrappedLines = words.map(chunk => {
      if (/^<br/i.test(chunk)) return '<br/>';
      return chunk
        .split(' ')
        .filter(Boolean)
        .map(w => `<span class="word-wrap" style="display:inline-block;overflow:hidden;vertical-align:top;"><span class="word-inner" style="display:inline-block;">${w}</span></span>`)
        .join(' ');
    });

    headingEl.innerHTML = wrappedLines.join('');

    const wordInners = headingEl.querySelectorAll('.word-inner');

    gsap.fromTo(
      wordInners,
      { y: '110%', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 1.0,
        ease: EASE,
        stagger: 0.04,
        scrollTrigger: {
          trigger: headingEl,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      },
    );
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(headingEl, { opacity: 1 });
  });
}

/**
 * Room grid entrance — THE signature interaction.
 *
 * Cards enter with a staggered clip-path reveal (bottom edge wipes up) + Y-offset,
 * triggered off the grid container. All cards timed together, not independently.
 *
 * @param {Element}  gridEl    The grid container element
 * @param {NodeList|Array} cards  The card child elements
 */
export function revealRoomGrid(gridEl, cards) {
  if (!gridEl || !cards || !cards.length) return;

  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    // Set initial state on all cards
    gsap.set(cards, {
      clipPath: 'inset(0 0 100% 0)',
      y: 48,
      opacity: 0,
    });

    gsap.to(cards, {
      clipPath: 'inset(0 0 0% 0)',
      y: 0,
      opacity: 1,
      duration: 0.9,
      ease: EASE,
      stagger: 0.1,        // 100ms between each card
      clearProps: 'clipPath,transform,opacity', // clean up so CSS hover works unimpeded
      scrollTrigger: {
        trigger: gridEl,
        start: 'top 78%',
        toggleActions: 'play none none none',
      },
    });
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    gsap.set(cards, { clipPath: 'none', y: 0, opacity: 1 });
  });
}
