'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Maximize2, Star } from 'lucide-react';

/* Design-system tokens */
const C = {
  parchment:     'var(--color-parchment)',
  linen:         'var(--color-linen)',
  warmStone:     'var(--color-warm-stone)',
  walnut:        'var(--color-walnut)',
  espresso:      'var(--color-chocolate)',
  onyxWarm:      'var(--color-onyx-warm)',
  midnightRoast: 'var(--color-midnight-roast)',
  saffron:       'var(--color-saffron)',
};

/**
 * RoomCard — Amrit Palace design system
 * Dark card on midnight-roast surface, parchment text, saffron accents.
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
      className="room-card-root"
      style={{
        borderRadius: 0,
        backgroundColor: 'var(--color-cream)',
        border: `1px solid rgba(216,203,184,0.08)`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'border-color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        cursor: 'default',
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(212,150,83,0.35)'}
      onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(216,203,184,0.08)'}
    >
      {/* Image */}
      <div style={{ position: 'relative', width: '100%', aspectRatio: '4/3', overflow: 'hidden' }}>
        {heroImage ? (
          <Image
            src={heroImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
            style={{
              objectFit: 'cover',
              borderRadius: 0,
              display: 'block',
              transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            className="room-card-img"
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              backgroundColor: 'var(--color-cream-deep)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-tt-ramillas-variable)',
                fontWeight: 300,
                fontSize: '0.875rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: C.chocolate,
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
            top: '0.75rem',
            right: '0.75rem',
            backgroundColor: 'rgba(41,38,34,0.80)',
            border: `1px solid rgba(216,203,184,0.20)`,
            color: '#FFFFFF',
            fontFamily: 'var(--font-satoshi)',
            fontWeight: 500,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '-0.01em',
            padding: '0.25rem 0.625rem',
            borderRadius: '0.1875rem',
            backdropFilter: 'blur(4px)',
          }}
        >
          ₹{rate?.toLocaleString('en-IN')}/night
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
        {/* Saffron rule */}
        <div style={{ width: '1.75rem', height: '1px', backgroundColor: 'var(--color-gold)' }} />

        {/* Room name */}
        <h3
          style={{
            fontFamily: 'var(--font-tt-ramillas-variable)',
            fontWeight: 300,
            fontSize: '1.625rem',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            textTransform: 'uppercase',
            color: 'var(--color-chocolate)',
          }}
        >
          {name}
        </h3>

        {/* Divider */}
        <div style={{ width: '100%', height: '1px', backgroundColor: `rgba(216,203,184,0.10)` }} />

        {/* Meta row */}
        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
          {size && <MetaItem icon={<Maximize2 size={12} strokeWidth={1.5} />} label={size} />}
          {max  && <MetaItem icon={<Users     size={12} strokeWidth={1.5} />} label={`Max ${max} guests`} />}
          {beds && <MetaItem icon={<Star      size={12} strokeWidth={1.5} color="var(--color-gold)" />} label={beds} />}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: 'auto', paddingTop: '0.5rem', flexWrap: 'wrap' }}>
          <Link href={`/rooms/${id}`} style={{ flex: 1, textDecoration: 'none' }}>
              <button
                style={{
                  width: '100%',
                  padding: '0.75rem 1.25rem',
                  border: `1px solid rgba(61,43,31,0.30)`,
                  borderRadius: '0.1875rem',
                  background: 'transparent',
                  color: C.chocolate,
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  transition: 'border-color 0.3s ease, color 0.3s ease',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-chocolate)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(61,43,31,0.30)'; e.currentTarget.style.color = C.chocolate; }}
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
              border: `1px solid var(--color-gold)`,
              borderRadius: '0.1875rem',
              background: 'var(--color-gold)',
              color: 'var(--color-chocolate)',
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.3s ease, border-color 0.3s ease, color 0.3s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-gold-hover)'; e.currentTarget.style.borderColor = 'var(--color-gold-hover)'; e.currentTarget.style.color = 'var(--color-cream)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-gold)'; e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-chocolate)'; }}
          >
            Enquire
          </a>
        </div>
      </div>

      <style>{`
        .room-card-root:hover .room-card-img { transform: scale(1.04); }
      `}</style>
    </div>
  );
}

function MetaItem({ icon, label }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3125rem' }}>
      <span style={{ color: 'var(--color-chocolate)', display: 'flex' }}>{icon}</span>
      <span
        style={{
          fontFamily: 'var(--font-satoshi)',
          fontWeight: 500,
          fontSize: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          color: 'var(--color-chocolate)',
        }}
      >
        {label}
      </span>
    </div>
  );
}
