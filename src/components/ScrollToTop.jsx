'use client';

import { useEffect, useState } from 'react';

/**
 * ScrollToTop — Moksh Haveli Inn
 * Gold border, white fill, chocolate arrow. Matches the site's luxury tone.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
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
          border: 1px solid var(--color-gold);
          border-radius: 0.1875rem;
          background: #FFFFFF;
          color: var(--color-chocolate);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-satoshi);
          font-size: 1rem;
          font-weight: 500;
          line-height: 1;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
          transition:
            background     0.3s ease,
            color          0.3s ease,
            border-color   0.3s ease,
            opacity        0.3s ease,
            transform      0.3s ease;
          opacity: ${visible ? 1 : 0};
          pointer-events: ${visible ? 'auto' : 'none'};
          transform: ${visible ? 'translateY(0)' : 'translateY(0.75rem)'};
        }
        .scroll-to-top-btn:hover {
          background: var(--color-gold);
          border-color: var(--color-gold);
          color: #FFFFFF;
        }
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
