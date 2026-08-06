import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found | Moksh Haveli Inn',
  description: 'The page you are looking for does not exist.',
};

/**
 * Branded 404 — Moksh Haveli Inn
 * Dark chocolate/midnight atmosphere with gold accents.
 */
export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes mhi-float {
          0%, 100% { transform: translate(-50%, -50%) translateY(0);    }
          50%       { transform: translate(-50%, -50%) translateY(-0.6rem); }
        }
        /* Ghost watermark */
        .mhi-404-code {
          font-family: var(--font-tt-ramillas-variable);
          font-weight: 300;
          font-size: clamp(8rem, 22vw, 20rem);
          line-height: 0.8;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1px rgba(201,168,76,0.12);
          text-stroke: 1px rgba(201,168,76,0.12);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          animation: mhi-float 7s ease-in-out infinite;
        }
        /* Gold rule */
        .mhi-404-rule {
          width: 3rem;
          height: 1px;
          background: var(--color-gold);
          margin-bottom: 1.5rem;
        }
        /* Jali lattice overlay */
        .mhi-404-jali {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='20' y='0' width='14' height='14' transform='rotate(45 20 0)' fill='none' stroke='%23C9A84C' stroke-width='0.8'/%3E%3Crect x='0' y='20' width='14' height='14' transform='rotate(45 0 20)' fill='none' stroke='%23C9A84C' stroke-width='0.8'/%3E%3Crect x='40' y='20' width='14' height='14' transform='rotate(45 40 20)' fill='none' stroke='%23C9A84C' stroke-width='0.8'/%3E%3Crect x='20' y='40' width='14' height='14' transform='rotate(45 20 40)' fill='none' stroke='%23C9A84C' stroke-width='0.8'/%3E%3C/svg%3E");
          background-repeat: repeat;
          opacity: 0.06;
          pointer-events: none;
        }
        /* Radial glow behind content */
        .mhi-404-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 45rem;
          height: 45rem;
          background: radial-gradient(ellipse at center, rgba(201,168,76,0.08) 0%, transparent 70%);
          pointer-events: none;
        }
        /* Primary CTA */
        .mhi-404-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          border: 1px solid var(--color-gold);
          border-radius: 0.1875rem;
          background: var(--color-gold);
          color: var(--color-chocolate);
          font-family: var(--font-satoshi);
          font-size: 0.8125rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          text-decoration: none;
          cursor: pointer;
          transition:
            background    0.3s ease,
            border-color  0.3s ease,
            color         0.3s ease;
          white-space: nowrap;
        }
        .mhi-404-btn:hover {
          background: var(--color-gold-hover);
          border-color: var(--color-gold-hover);
        }
        /* Secondary ghost CTA */
        .mhi-404-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          border: 1px solid rgba(201,168,76,0.35);
          border-radius: 0.1875rem;
          background: transparent;
          color: var(--color-parchment);
          font-family: var(--font-satoshi);
          font-size: 0.8125rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          text-decoration: none;
          cursor: pointer;
          transition:
            background    0.3s ease,
            border-color  0.3s ease;
          white-space: nowrap;
        }
        .mhi-404-btn-ghost:hover {
          background: rgba(201,168,76,0.10);
          border-color: rgba(201,168,76,0.55);
        }
        @media (max-width: 30rem) {
          .mhi-404-actions { flex-direction: column !important; }
          .mhi-404-btn, .mhi-404-btn-ghost { width: 100%; justify-content: center; }
        }
      `}</style>

      <main
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: 'var(--color-midnight-roast)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '2rem 1.25rem',
        }}
      >
        {/* Atmospheric layers */}
        <div className="mhi-404-jali" aria-hidden="true" />
        <div className="mhi-404-glow"  aria-hidden="true" />

        {/* Ghost 404 numeral */}
        <span className="mhi-404-code" aria-hidden="true">404</span>

        {/* Content card */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '34rem',
            width: '100%',
          }}
        >
          {/* Gold rule */}
          <div className="mhi-404-rule" />

          {/* Overline */}
          <span
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              color: 'var(--color-gold)',
              display: 'block',
              marginBottom: '1.25rem',
            }}
          >
            Error 404 · Page Not Found
          </span>

          {/* Headline */}
          <h1
            style={{
              fontFamily: 'var(--font-tt-ramillas-variable)',
              fontWeight: 300,
              fontSize: 'clamp(2.625rem, 7vw, 4.3125rem)',
              lineHeight: 0.88,
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              color: 'var(--color-parchment)',
              marginBottom: '1.75rem',
            }}
          >
            Lost in<br />Varanasi?
          </h1>

          {/* Body */}
          <p
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 400,
              fontSize: '0.9375rem',
              lineHeight: 1.7,
              letterSpacing: '-0.01em',
              color: 'var(--color-walnut)',
              maxWidth: '26rem',
              marginBottom: '2.5rem',
            }}
          >
            Even the oldest city in the world has lanes that go nowhere.
            The page you're looking for doesn't exist — but the haveli does.
          </p>

          {/* Divider */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(201,168,76,0.15)' }} />
            <span style={{ color: 'var(--color-gold)', fontSize: '0.6rem', opacity: 0.6 }}>✦</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(201,168,76,0.15)' }} />
          </div>

          {/* CTAs */}
          <div
            className="mhi-404-actions"
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <Link href="/" className="mhi-404-btn">
              ← Back to Home
            </Link>
            <Link href="/rooms" className="mhi-404-btn-ghost">
              Browse Rooms
            </Link>
          </div>

          {/* WhatsApp footnote */}
          <p
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 400,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--color-walnut)',
              marginTop: '2rem',
            }}
          >
            Need help?{' '}
            <a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'var(--color-gold)',
                textDecoration: 'underline',
                textUnderlineOffset: '0.25rem',
                transition: 'opacity 0.2s ease',
              }}
            >
              Chat on WhatsApp →
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
