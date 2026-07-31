'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',    href: '/' },
  { label: 'Rooms',   href: '/rooms' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'About',   href: '/about' },
  { label: 'Contact', href: '/contact' },
];

/**
 * Navbar — Amrit Palace design system
 * Responsive purely via vanilla CSS (<style> block injected once).
 * No Tailwind classes.
 *
 * variant: 'transparent' (over hero) | 'solid' (other pages)
 *
 * Scroll behaviour:
 *   - Starts transparent on hero pages (variant='transparent')
 *   - After 60px scroll → solid parchment, 0.4s crossfade
 *
 * Mobile: hamburger menu with full-screen dark drawer.
 * Desktop (≥ 768px): horizontal link row + Book Now button.
 */
export default function Navbar({ variant = 'transparent' }) {
  const [open, setOpen]         = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname                = usePathname();

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Lock body scroll when drawer is open
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

  const isSolid     = variant === 'solid' || scrolled;
  const textColor   = isSolid ? '#2c2c2c' : '#d8cbb8';
  const borderColor = isSolid ? '#b6ab9c' : 'rgba(216,203,184,0.15)';
  const bgColor     = isSolid ? '#d8cbb8' : 'transparent';

  const isActive = (href) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <>
      {/* ── Responsive CSS — injected once ── */}
      <style>{`
        /* Nav bar inner: mobile uses tighter padding */
        .nav-bar {
          padding: 0 1.25rem;
        }
        /* Desktop links + book button: hidden on mobile */
        .nav-desktop-links,
        .nav-desktop-cta {
          display: none;
        }
        /* Hamburger: shown on mobile */
        .nav-hamburger {
          display: flex;
        }
        /* Mobile drawer: full-width dark panel */
        .nav-drawer {
          display: flex;
        }
        @media (min-width: 48rem) {
          .nav-bar {
            padding: 0 2.5rem;
          }
          .nav-desktop-links {
            display: flex;
            align-items: center;
            gap: 2rem;
          }
          .nav-desktop-cta {
            display: flex;
            align-items: center;
          }
          .nav-hamburger {
            display: none;
          }
          .nav-drawer {
            display: none !important;
          }
        }
      `}</style>

      <nav
        id="main-nav"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          backgroundColor: bgColor,
          borderBottom: `1px solid ${borderColor}`,
          transition: 'background-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
      >
        {/* ── Top bar ── */}
        <div
          className="nav-bar"
          style={{
            maxWidth: '90rem',
            margin: '0 auto',
            height: '4rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Wordmark */}
          <Link href="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
              <span
                style={{
                  fontFamily: 'var(--font-tt-ramillas-variable)',
                  fontWeight: 300,
                  fontSize: '1.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.04em',
                  color: textColor,
                  transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                Moksh Haveli Inn
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.5625rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#978e81',
                  marginTop: '0.125rem',
                }}
              >
                Varanasi · Heritage
              </span>
            </div>
          </Link>

          {/* Desktop nav links */}
          <nav className="nav-desktop-links" aria-label="Main navigation">
            {NAV_LINKS.map(({ label, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={href}
                  href={href}
                  style={{
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    color: active ? '#d49653' : textColor,
                    textDecoration: 'none',
                    opacity: active ? 1 : 0.85,
                    transition: 'color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.25s ease',
                    borderBottom: active ? '1px solid #d49653' : '1px solid transparent',
                    paddingBottom: '0.125rem',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.opacity = '1'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.opacity = '0.85'; }}
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
                  border: `1px solid ${textColor}`,
                  borderRadius: '0.1875rem',
                  background: 'transparent',
                  color: textColor,
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'background 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = textColor;
                  e.currentTarget.style.color = isSolid ? '#d8cbb8' : '#2c2c2c';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = textColor;
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
              transition: 'color 0.4s ease',
            }}
          >
            {open
              ? <X size={20} strokeWidth={1.5} />
              : <Menu size={20} strokeWidth={1.5} />
            }
          </button>
        </div>

        {/* ── Mobile drawer ── */}
        <div
          id="nav-mobile-drawer"
          className="nav-drawer"
          style={{
            display: open ? 'flex' : 'none',
            flexDirection: 'column',
            backgroundColor: '#292622',
            borderTop: '1px solid rgba(216,203,184,0.1)',
            padding: '1.75rem 1.25rem 2rem',
            gap: '0',
          }}
        >
          {NAV_LINKS.map(({ label, href }, i) => {
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
                  color: active ? '#d49653' : '#d8cbb8',
                  textDecoration: 'none',
                  padding: '1rem 0',
                  borderBottom: '1px solid rgba(216,203,184,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                {label}
                {active && (
                  <span style={{ color: '#d49653', fontSize: '0.75rem' }}>✦</span>
                )}
              </Link>
            );
          })}

          {/* Mobile Book Now */}
          <Link
            href="/rooms"
            onClick={() => setOpen(false)}
            style={{ textDecoration: 'none', marginTop: '1.5rem' }}
          >
            <button
              style={{
                width: '100%',
                padding: '1rem',
                border: '1px solid #d8cbb8',
                borderRadius: '0.1875rem',
                background: 'transparent',
                color: '#d8cbb8',
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.8125rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
              }}
            >
              Book Now
            </button>
          </Link>

          {/* Contact quick-link */}
          <p
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.6875rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#615b53',
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
