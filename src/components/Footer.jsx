import Link from 'next/link';
import Image from 'next/image';

const LINKS = {
  Explore: [
    { label: 'Rooms',     href: '/rooms' },
    { label: 'Amenities', href: '/amenities' },
    { label: 'Gallery',   href: '/gallery' },
    { label: 'About',     href: '/about' },
  ],
  Visit: [
    { label: 'Contact',    href: '/contact' },
    { label: 'Book Now',   href: '/rooms' },
    { label: 'Directions', href: '/contact#map' },
  ],
};

/* Design-system tokens */
const MIDNIGHT  = 'var(--color-midnight-roast)';
const PARCHMENT = 'var(--color-parchment)';
const LINEN     = 'var(--color-linen)';
const WALNUT    = 'var(--color-walnut)';
const ESPRESSO  = 'var(--color-espresso)';
const SAFFRON   = 'var(--color-saffron)';
const WARM_STONE = 'var(--color-warm-stone)';

/**
 * Footer — Amrit Palace design system
 * Dark midnight-roast surface, parchment + walnut text.
 */
export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--color-footer-bg)',          /* slightly deeper than midnight for footer contrast */
        borderTop: `1px solid rgba(216,203,184,0.12)`,
        padding: '5rem 2.5rem 2.5rem',
      }}
    >
      <div style={{ maxWidth: '80rem', margin: '0 auto' }}>

        {/* Top grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(11.25rem, 1fr))',
            gap: '3rem',
            marginBottom: '4rem',
          }}
        >
          {/* Brand */}
          <div style={{ gridColumn: 'span 2' }}>
            <Image
              src="/logo.jpeg"
              alt="Moksh Haveli Inn"
              width={200}
              height={200}
              style={{
                height: '5rem',
                width: 'auto',
                objectFit: 'contain',
                display: 'block',
                mixBlendMode: 'screen',
                marginBottom: '1.25rem',
                filter: 'brightness(1.1)',
              }}
            />
            <p
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.8125rem',
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
                color: WALNUT,
                maxWidth: '17.5rem',
              }}
            >
              A heritage boutique guest house in the heart of Varanasi — where the sacred meets serenity.
            </p>

            {/* Social links */}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.75rem' }}>
              {[
                { label: 'WhatsApp',  href: 'https://wa.me/91XXXXXXXXXX' },
                { label: 'Instagram', href: 'https://www.instagram.com/' },
              ].map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '0.5rem 1rem',
                    border: `1px solid rgba(216,203,184,0.20)`,
                    borderRadius: '0.1875rem',
                    color: LINEN,
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    transition: 'border-color 0.3s ease, color 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = SAFFRON; e.currentTarget.style.color = SAFFRON; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(216,203,184,0.20)'; e.currentTarget.style.color = LINEN; }}
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
                  fontSize: '0.6875rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  color: SAFFRON,
                  marginBottom: '1.25rem',
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
                        color: WALNUT,
                        textDecoration: 'none',
                        transition: 'color 0.25s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.color = PARCHMENT; }}
                      onMouseLeave={e => { e.currentTarget.style.color = WALNUT; }}
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
                letterSpacing: '0.06em',
                color: SAFFRON,
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
                    color: i < 3 ? LINEN : WALNUT,
                  }}
                >
                  {line}
                </span>
              ))}
            </address>
          </div>
        </div>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: `rgba(216,203,184,0.10)`, marginBottom: '2rem' }} />

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
                color: ESPRESSO,
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
