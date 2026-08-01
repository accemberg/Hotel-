'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Users, Maximize2, Star } from 'lucide-react';

/**
 * RoomCard — Amrit Palace design system
 * All lengths in rem. em for letter-spacing. 1px borders stay.
 *
 * GSAP signature interaction: Staggered grid entrance
 *   - data-room-card attr lets the grid's animation utility target these
 *   - Initial clip-path / opacity set by GSAP in scroll.js revealRoomGrid()
 *   - On hover: border-color shift only — no scale, no shadow
 */
export default function RoomCard({ room, whatsappNumber, whatsappDefaultMessage }) {
  const { id, name, rate, size, beds, maxOccupancy, images, image } = room;
  const heroImage = (images && images[0]) || image || null;
  const max = maxOccupancy || room.max;

  const buildEnquireUrl = () => {
    const num = whatsappNumber || '919000000000';
    const msg = `Hi! I'm interested in the ${name} at Moksh Haveli Inn. Please share availability.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div
      data-room-card
      style={{
        borderRadius: 0,
        backgroundColor: '#d8cbb8',
        border: '1px solid #b6ab9c',   /* 1px hairline — intentional */
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#615b53'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#b6ab9c'}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
        {heroImage ? (
          <img
            src={heroImage}
            alt={name}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 0,
              display: 'block',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.025)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
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
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
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
                transition: 'background 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              }}
              onMouseEnter={e => { e.target.style.background = '#2c2c2c'; e.target.style.color = '#d8cbb8'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#2c2c2c'; }}
            >
              View Room
            </button>
          </Link>
          <a
            href={buildEnquireUrl()}
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
              transition: 'opacity 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
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
