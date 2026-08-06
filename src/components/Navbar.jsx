'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Rooms',     href: '/rooms' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'Amenities', href: '/amenities' },
  { label: 'About',     href: '/about' },
  { label: 'Contact',   href: '/contact' },
];

/* Design-system tokens */
const SAFFRON   = 'var(--color-saffron)';
const PARCHMENT = 'var(--color-parchment)';
const MIDNIGHT  = 'var(--color-midnight-roast)';
const LINEN     = 'var(--color-linen)';

/**
 * Navbar — Amrit Palace design system
 * variant: 'transparent' (hero pages) | 'solid' (inner pages)
 *
 * Transparent → dark bg none, parchment text
 * Scrolled / solid → midnight-roast bg, parchment text
 * Mobile drawer → midnight-roast full-screen
 */
export default function Navbar({ variant = 'transparent' }) {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (variant !== 'transparent') return;
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [variant]);

  const isSolid = variant === 'solid' || scrolled;

  /* On transparent/dark hero: text always parchment.
     On scrolled/solid: midnight-roast bg, parchment text */
  const bgColor     = isSolid ? MIDNIGHT : 'transparent';
  const textColor   = PARCHMENT;
  const borderColor = isSolid ? 'rgba(216,203,184,0.10)' : 'rgba(216,203,184,0.08)';

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      <style>{`
        .nav-bar {
          padding: 0 1.25rem;
          display: flex;
          justify-content: space-between;
        }
        .nav-logo { display: flex; align-items: center; }
        .nav-desktop-links,
        .nav-desktop-cta { display: none; }
        .nav-hamburger { display: flex; }
        .nav-drawer { display: flex; }

        @media (min-width: 48rem) {
          .nav-bar {
            padding: 0 2.5rem;
            display: grid;
            grid-template-columns: 1fr auto 1fr;
          }
          .nav-logo { justify-content: flex-start; }
          .nav-desktop-links {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 2rem;
          }
          .nav-desktop-cta {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .nav-hamburger { display: none; }
          .nav-drawer    { display: none !important; }
        }

        /* Nav link hover */
        .nav-link:hover { opacity: 1 !important; }

        /* Book Now button hover */
        #nav-book-btn:hover {
          background: ${SAFFRON} !important;
          border-color: ${SAFFRON} !important;
          color: ${MIDNIGHT} !important;
        }
      `}</style>

      <nav
        id="main-nav"
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          zIndex: 100,
          backgroundColor: bgColor,
          borderBottom: `1px solid ${borderColor}`,
          backdropFilter: isSolid ? 'none' : 'blur(0)',
          transition: 'background-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* Top bar */}
        <div
          className="nav-bar"
          style={{ maxWidth: '90rem', margin: '0 auto', height: '4rem', alignItems: 'center', gap: '1rem' }}
        >
          {/* Logo */}
          <div className="nav-logo">
            <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
              <Image
                src="/logo.jpeg"
                alt="Moksh Haveli Inn"
                width={200}
                height={200}
                priority
                style={{
                  height: '2.75rem',
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                  mixBlendMode: 'screen',
                  filter: 'brightness(1.08) contrast(1.05)',
                  transition: 'filter 0.3s ease',
                }}
              />
            </Link>
          </div>

          {/* Desktop nav links */}
          <nav className="nav-desktop-links" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className="nav-link"
                  style={{
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    color: active ? SAFFRON : textColor,
                    textDecoration: 'none',
                    opacity: active ? 1 : 0.75,
                    transition: 'color 0.3s ease, opacity 0.25s ease',
                    borderBottom: active ? `1px solid ${SAFFRON}` : '1px solid transparent',
                    paddingBottom: '0.125rem',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Book Now */}
          <div className="nav-desktop-cta">
            <Link href="/rooms" style={{ textDecoration: 'none' }}>
              <button
                id="nav-book-btn"
                style={{
                  padding: '0.625rem 1.375rem',
                  border: `1px solid ${PARCHMENT}`,
                  borderRadius: '0.1875rem',
                  background: 'transparent',
                  color: PARCHMENT,
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
                }}
              >
                Book Now
              </button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setOpen(o => !o)}
            id="nav-menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="nav-mobile-drawer"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: textColor,
              padding: '0.375rem',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              transition: 'color 0.3s ease',
            }}
          >
            {open
              ? <X size={20} strokeWidth={1.5} />
              : <Menu size={20} strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* Mobile drawer — midnight roast */}
        <div
          id="nav-mobile-drawer"
          className="nav-drawer"
          style={{
            display: open ? 'flex' : 'none',
            flexDirection: 'column',
            backgroundColor: MIDNIGHT,
            borderTop: `1px solid rgba(216,203,184,0.10)`,
            padding: '1.75rem 1.25rem 2rem',
            gap: 0,
          }}
        >
          {NAV_LINKS.map(({ label, href }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setOpen(false)}
                style={{
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.9375rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: active ? SAFFRON : PARCHMENT,
                  textDecoration: 'none',
                  padding: '1rem 0',
                  borderBottom: `1px solid rgba(216,203,184,0.10)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {label}
                {active && (
                  <span style={{ color: SAFFRON, fontSize: '0.75rem' }}>✦</span>
                )}
              </Link>
            );
          })}

          {/* Mobile Book Now */}
          <Link href="/rooms" onClick={() => setOpen(false)} style={{ textDecoration: 'none', marginTop: '1.5rem' }}>
            <button
              style={{
                width: '100%',
                padding: '1rem',
                border: `1px solid ${SAFFRON}`,
                borderRadius: '0.1875rem',
                background: 'transparent',
                color: SAFFRON,
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'background 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = SAFFRON; e.currentTarget.style.color = MIDNIGHT; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = SAFFRON; }}
            >
              Book Now
            </button>
          </Link>

          <p
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: 'var(--color-walnut)',
              textAlign: 'center',
              marginTop: '1.25rem',
            }}
          >
            Varanasi · Heritage Stay
          </p>
        </div>
      </nav>
    </>
  );
}
