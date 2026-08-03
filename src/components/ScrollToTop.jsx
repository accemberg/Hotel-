'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollToTop — Amrit Palace design system
 *
 * Fixed bottom-right button. Appears after 300px of scroll.
 * Saffron accent, 0.1875rem radius, dark semi-transparent bg.
 * Appears on ALL pages (public + admin).
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // check on mount
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        .scroll-to-top-btn {
          position: fixed;
          bottom: 6.5rem;
          right: 1.75rem;
          z-index: 200;
          width: 2.75rem;
          height: 2.75rem;
          border: 1px solid #DEB76A;
          border-radius: 0.1875rem;
          background: rgba(41, 38, 34, 0.88);
          color: #DEB76A;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(0.5rem);
          -webkit-backdrop-filter: blur(0.5rem);
          font-family: var(--font-satoshi);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1;
          transition:
            background  0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            color       0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            opacity     0.35s ease,
            transform   0.35s ease;
          opacity: ${visible ? 1 : 0};
          pointer-events: ${visible ? 'auto' : 'none'};
          transform: ${visible ? 'translateY(0)' : 'translateY(0.75rem)'};
        }
        .scroll-to-top-btn:hover {
          background: #DEB76A;
          color: #292622;
        }
        /* Keep away from WhatsApp float on mobile */
        @media (max-width: 47.9375rem) {
          .scroll-to-top-btn {
            bottom: 7.5rem;
            right: 1.25rem;
          }
        }
      `}</style>

      <button
        id="scroll-to-top"
        className="scroll-to-top-btn"
        onClick={handleClick}
        aria-label="Scroll back to top"
        title="Scroll to top"
      >
        {/* Upward chevron — pure CSS, no icon dependency */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polyline points="3 10 8 5 13 10" />
        </svg>
      </button>
    </>
  );
}
