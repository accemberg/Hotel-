'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',      href: '/' },
  { label: 'Rooms',     href: '/rooms' },
  { label: 'Amenities', href: '/amenities' },
  { label: 'Gallery',   href: '/gallery' },
  { label: 'About',     href: '/about' },
  { label: 'Contact',   href: '/contact' },
];

/**
 * Navbar — Amrit Palace design system
 * All lengths in rem. em for letter-spacing. 1px borders stay.
 * variant: 'transparent' (over hero) | 'solid' (other pages)
 */
export default function Navbar({ variant = 'transparent' }) {
  const [open, setOpen] = useState(false);

  const isDark = variant === 'transparent';
  const textColor   = isDark ? '#d8cbb8' : '#2c2c2c';
  const borderColor = isDark ? 'rgba(216,203,184,0.15)' : '#b6ab9c';
  const bg          = isDark ? 'transparent' : '#d8cbb8';

  return (
    <nav
      style={{
        position: isDark ? 'absolute' : 'sticky',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        backgroundColor: bg,
        borderBottom: `1px solid ${borderColor}`,   /* 1px hairline — intentional */
      }}
    >
      <div
        style={{
          maxWidth: '80rem',           /* 1280px */
          margin: '0 auto',
          padding: '0 2.5rem',         /* 40px */
          height: '4.5rem',            /* 72px */
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo / Wordmark */}
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span
              style={{
                fontFamily: 'var(--font-tt-ramillas-variable)',
                fontWeight: 300,
                fontSize: '1.375rem',   /* 22px */
                textTransform: 'uppercase',
                letterSpacing: '-0.04em',
                color: textColor,
              }}
            >
              Moksh Haveli Inn
            </span>
            <span
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.625rem',   /* 10px */
                textTransform: 'uppercase',
                letterSpacing: '0.09em',
                color: '#978e81',
                marginTop: '0.125rem',  /* 2px */
              }}
            >
              Varanasi · Est. Heritage
            </span>
          </div>
        </Link>

        {/* Desktop nav links */}
        <div
          style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}
          className="hidden md:flex"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.75rem',    /* 12px */
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: textColor,
                textDecoration: 'none',
                opacity: 0.85,
                transition: 'opacity 0.25s ease',
              }}
              onMouseEnter={e => e.target.style.opacity = 1}
              onMouseLeave={e => e.target.style.opacity = 0.85}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex" style={{ alignItems: 'center', gap: '0.75rem' }}>
          <Link href="/book" style={{ textDecoration: 'none' }}>
            <button
              style={{
                padding: '0.625rem 1.375rem',  /* 10px 22px */
                border: `1px solid ${textColor}`,
                borderRadius: '0.1875rem',       /* 3px */
                background: 'transparent',
                color: textColor,
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'background 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={e => {
                e.target.style.background = textColor;
                e.target.style.color = isDark ? '#2c2c2c' : '#d8cbb8';
              }}
              onMouseLeave={e => {
                e.target.style.background = 'transparent';
                e.target.style.color = textColor;
              }}
            >
              Book Now
            </button>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: textColor, padding: '0.25rem' }}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} strokeWidth={1.5} /> : <Menu size={22} strokeWidth={1.5} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div
          className="md:hidden"
          style={{
            backgroundColor: '#292622',
            borderTop: '1px solid rgba(216,203,184,0.1)',
            padding: '1.5rem 2.5rem 2rem',       /* 24px 40px 32px */
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',                       /* 20px */
          }}
        >
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.8125rem',            /* 13px */
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: '#d8cbb8',
                textDecoration: 'none',
              }}
            >
              {label}
            </Link>
          ))}
          <Link href="/book" onClick={() => setOpen(false)} style={{ textDecoration: 'none', marginTop: '0.5rem' }}>
            <button
              style={{
                padding: '0.75rem 1.75rem',
                border: '1px solid #d8cbb8',
                borderRadius: '0.1875rem',
                background: 'transparent',
                color: '#d8cbb8',
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
              }}
            >
              Book Now
            </button>
          </Link>
        </div>
      )}
    </nav>
  );
}
