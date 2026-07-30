import Link from 'next/link';

const LINKS = {
  Explore: [
    { label: 'Rooms',     href: '/rooms' },
    { label: 'Amenities', href: '/amenities' },
    { label: 'Gallery',   href: '/gallery' },
    { label: 'About',     href: '/about' },
  ],
  Visit: [
    { label: 'Contact',    href: '/contact' },
    { label: 'Book Now',   href: '/book' },
    { label: 'Directions', href: '/contact#map' },
  ],
};

/**
 * Footer — Amrit Palace design system
 * All lengths in rem. em for letter-spacing. 1px borders stay.
 */
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#292622',
        borderTop: '1px solid rgba(216,203,184,0.1)',  /* 1px hairline — intentional */
        padding: '5rem 2.5rem 2.5rem',                 /* 80px 40px 40px */
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>  {/* 1280px */}

        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(11.25rem, 1fr))', /* 180px */
            gap: '3rem',             /* 48px */
            marginBottom: '4rem',    /* 64px */
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <h2
              style={{
                fontFamily: 'var(--font-tt-ramillas-variable)',
                fontWeight: 300,
                fontSize: '2.625rem',  /* 42px */
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#d8cbb8',
                marginBottom: '1rem',
              }}
            >
              Moksh<br />Haveli Inn
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.8125rem',  /* 13px */
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
                color: '#978e81',
                maxWidth: '17.5rem',    /* 280px */
              }}
            >
              A heritage boutique guest house in the heart of Varanasi — where the sacred meets serenity.
            </p>

            {/* Social */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
              {['WhatsApp', 'Instagram'].map(label => (
                <a
                  key={label}
                  href={label === 'WhatsApp' ? 'https://wa.me/91XXXXXXXXXX' : 'https://www.instagram.com/'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.5rem 1rem',              /* 8px 16px */
                    border: '1px solid rgba(216,203,184,0.25)',
                    borderRadius: '0.1875rem',
                    color: '#d8cbb8',
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.6875rem',               /* 11px */
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    transition: 'border-color 0.3s ease',
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>

          {/* Nav link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <p
                style={{
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.6875rem',                 /* 11px */
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em',
                  color: '#978e81',
                  marginBottom: '1.25rem',               /* 20px */
                }}
              >
                {group}
              </p>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        fontFamily: 'var(--font-satoshi)',
                        fontWeight: 500,
                        fontSize: '0.8125rem',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        color: '#bfb4a3',
                        textDecoration: 'none',
                        transition: 'color 0.25s ease',
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <p
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '0.03em',
                color: '#978e81',
                marginBottom: '1.25rem',
              }}
            >
              Contact
            </p>
            <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {[
                'Moksh Haveli Inn',
                'Varanasi, Uttar Pradesh',
                'India — 221001',
                '+91 XX XXXX XXXX',
                'hello@mokshhaveli.in',
              ].map((line, i) => (
                <span
                  key={i}
                  style={{
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    letterSpacing: '-0.01em',
                    color: '#bfb4a3',
                  }}
                >
                  {line}
                </span>
              ))}
            </address>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(182,171,156,0.2)', marginBottom: '2rem' }} />

        {/* Bottom row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
          }}
        >
          {[
            `© ${new Date().getFullYear()} Moksh Haveli Inn · All rights reserved`,
            'Built by Accemberg Technology Pvt. Ltd.',
          ].map((text, i) => (
            <span
              key={i}
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: '#615b53',
              }}
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </footer>
  );
}
