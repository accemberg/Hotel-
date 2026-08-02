import Link from 'next/link';

export const metadata = {
  title: '404 — Page Not Found',
  description: 'The page you are looking for does not exist.',
};

/**
 * Branded 404 — Moksh Haveli Inn
 * Premium dark atmospheric design. Amrit Palace design system.
 */
export default function NotFound() {
  return (
    <>
      <style>{`
        @keyframes mhi-float {
          0%, 100% { transform: translateY(0); }
          50%       { transform: translateY(-0.5rem); }
        }
        .mhi-404-code {
          font-family: var(--font-tt-ramillas-variable);
          font-weight: 300;
          font-size: clamp(8rem, 20vw, 18rem);
          line-height: 0.8;
          letter-spacing: -0.04em;
          text-transform: uppercase;
          color: transparent;
          -webkit-text-stroke: 1px rgba(216, 203, 184, 0.15);
          text-stroke: 1px rgba(216, 203, 184, 0.15);
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          user-select: none;
          white-space: nowrap;
          animation: mhi-float 6s ease-in-out infinite;
        }
        .mhi-404-saffron-rule {
          width: 3rem;
          height: 1px;
          background: #DEB76A;
          margin-bottom: 1.5rem;
        }
        .mhi-404-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 2rem;
          border: 1px solid #DEB76A;
          border-radius: 0.1875rem;
          background: transparent;
          color: #DEB76A;
          font-family: var(--font-satoshi);
          font-size: 0.8125rem;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: -0.01em;
          text-decoration: none;
          cursor: pointer;
          transition:
            background 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94),
            color      0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          white-space: nowrap;
        }
        .mhi-404-btn:hover {
          background: #DEB76A;
          color: #292622;
        }
        .mhi-404-btn-muted {
          border-color: rgba(222,183,106,0.3);
          color: #DEB76A;
        }
        .mhi-404-btn-muted:hover {
          background: rgba(222,183,106,0.1);
          color: #DEB76A;
          border-color: rgba(222,183,106,0.6);
        }
        /* Jali lattice — same as rooms section */
        .mhi-404-jali {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='20' y='0' width='14' height='14' transform='rotate(45 20 0)' fill='none' stroke='%23d8cbb8' stroke-width='0.8'/%3E%3Crect x='0' y='20' width='14' height='14' transform='rotate(45 0 20)' fill='none' stroke='%23d8cbb8' stroke-width='0.8'/%3E%3Crect x='40' y='20' width='14' height='14' transform='rotate(45 40 20)' fill='none' stroke='%23d8cbb8' stroke-width='0.8'/%3E%3Crect x='20' y='40' width='14' height='14' transform='rotate(45 20 40)' fill='none' stroke='%23d8cbb8' stroke-width='0.8'/%3E%3C/svg%3E");
          background-repeat: repeat;
          opacity: 0.04;
          pointer-events: none;
        }
        /* Grain texture */
        .mhi-404-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: 0.4;
          pointer-events: none;
        }
        /* Glow halo behind content */
        .mhi-404-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 40rem;
          height: 40rem;
          background: radial-gradient(ellipse at center, rgba(212,150,83,0.07) 0%, transparent 70%);
          pointer-events: none;
        }
        @media (max-width: 30rem) {
          .mhi-404-actions { flex-direction: column !important; }
          .mhi-404-btn    { width: 100%; justify-content: center; }
        }
      `}</style>

      <main
        style={{
          position: 'relative',
          minHeight: '100vh',
          backgroundColor: '#292622',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '2rem 1.25rem',
        }}
      >
        {/* Atmospheric layers */}
        <div className="mhi-404-jali" aria-hidden="true" />
        <div className="mhi-404-grain" aria-hidden="true" />
        <div className="mhi-404-glow"  aria-hidden="true" />

        {/* Ghost 404 numeral watermark */}
        <span className="mhi-404-code" aria-hidden="true">404</span>

        {/* Content */}
        <div
          style={{
            position: 'relative',
            zIndex: 2,
            maxWidth: '34rem',
            width: '100%',
          }}
        >
          {/* Saffron rule */}
          <div className="mhi-404-saffron-rule" />

          {/* Overline */}
          <span
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#DEB76A',
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
              color: '#DEB76A',
              marginBottom: '1.75rem',
            }}
          >
            Lost in<br />Varanasi?
          </h1>

          {/* Body */}
          <p
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.9375rem',
              lineHeight: 1.65,
              letterSpacing: '-0.01em',
              color: '#DEB76A',
              maxWidth: '26rem',
              marginBottom: '2.5rem',
            }}
          >
            Even the oldest city in the world has lanes that go nowhere. The page you're
            looking for doesn't exist — but the haveli does.
          </p>

          {/* Star separator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '2.5rem',
            }}
          >
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(222,183,106,0.1)' }} />
            <span style={{ color: '#DEB76A', fontSize: '0.625rem' }}>✦</span>
            <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(222,183,106,0.1)' }} />
          </div>

          {/* CTAs */}
          <div
            className="mhi-404-actions"
            style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
          >
            <Link href="/" className="mhi-404-btn">
              ← Back to Home
            </Link>
            <Link href="/rooms" className="mhi-404-btn mhi-404-btn-muted">
              Browse Rooms
            </Link>
          </div>

          {/* WhatsApp footnote */}
          <p
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#DEB76A',
              marginTop: '2rem',
            }}
          >
            Need help?{' '}
            <a
              href="https://wa.me/919000000000"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#DEB76A',
                textDecoration: 'underline',
                textUnderlineOffset: '0.25rem',
                transition: 'color 0.25s ease',
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
