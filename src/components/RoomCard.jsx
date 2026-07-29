'use client';

import Link from 'next/link';
import { Users, Maximize2, Star } from 'lucide-react';

/**
 * RoomCard — Amrit Palace design system
 * All lengths in rem. em for letter-spacing. 1px borders stay.
 */
export default function RoomCard({ room }) {
  const { id, name, rate, size, beds, max, image } = room;

  return (
    <div
      style={{
        borderRadius: 0,
        backgroundColor: '#d8cbb8',
        border: '1px solid #b6ab9c',   /* 1px hairline — intentional */
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.3s ease',
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
        {image ? (
          <img
            src={image}
            alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 0, display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: '#bfb4a3',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-tt-ramillas-variable)',
                fontWeight: 300,
                fontSize: '0.875rem',    /* 14px */
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: '#978e81',
              }}
            >
              Image coming
            </span>
          </div>
        )}

        {/* Rate tag */}
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',             /* 12px */
            right: '0.75rem',           /* 12px */
            backgroundColor: '#292622',
            color: '#d8cbb8',
            fontFamily: 'var(--font-satoshi)',
            fontWeight: 500,
            fontSize: '0.75rem',        /* 12px */
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            padding: '0.25rem 0.625rem', /* 4px 10px */
            borderRadius: 0,
          }}
        >
          ₹{rate?.toLocaleString('en-IN')}/night
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem 1.5rem 1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        {/* Room name */}
        <h3
          style={{
            fontFamily: 'var(--font-tt-ramillas-variable)',
            fontWeight: 300,
            fontSize: '1.625rem',       /* 26px */
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: '#2c2c2c',
          }}
        >
          {name}
        </h3>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: '#b6ab9c' }} />

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {size && <MetaItem icon={<Maximize2 size={12} strokeWidth={1.5} />} label={size} />}
          {max  && <MetaItem icon={<Users     size={12} strokeWidth={1.5} />} label={`Max ${max} guests`} />}
          {beds && <MetaItem icon={<Star      size={12} strokeWidth={1.5} color="#d49653" />} label={beds} />}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
          <Link href={`/rooms/${id}`} style={{ flex: 1, textDecoration: 'none' }}>
            <button
              style={{
                width: '100%',
                padding: '0.75rem 1.25rem',   /* 12px 20px */
                border: '1px solid #2c2c2c',
                borderRadius: '0.1875rem',     /* 3px */
                background: 'transparent',
                color: '#2c2c2c',
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                cursor: 'pointer',
                transition: 'background 0.3s ease, color 0.3s ease',
              }}
              onMouseEnter={e => { e.target.style.background = '#2c2c2c'; e.target.style.color = '#d8cbb8'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#2c2c2c'; }}
            >
              View Room
            </button>
          </Link>
          <a
            href={`https://wa.me/91XXXXXXXXXX?text=I'm interested in the ${encodeURIComponent(name)}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              flex: 1,
              padding: '0.75rem 1.25rem',
              border: '1px solid #2c2c2c',
              borderRadius: '0.1875rem',
              background: '#2c2c2c',
              color: '#d8cbb8',
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
              transition: 'opacity 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Enquire
          </a>
        </div>
      </div>
    </div>
  );
}

function MetaItem({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3125rem' }}>
      <span style={{ color: '#978e81', display: 'flex' }}>{icon}</span>
      <span
        style={{
          fontFamily: 'var(--font-satoshi)',
          fontWeight: 500,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          color: '#615b53',
        }}
      >
        {label}
      </span>
    </div>
  );
}
