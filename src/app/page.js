'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import SectionHeader from '@/components/SectionHeader';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getRooms, getGallery, getOtaLinks, getSiteConfig, getAmenities } from '@/lib/api';
import {
  Wifi, Wind, Tv, Sparkles, ShowerHead, Droplets,
  Flame, FlaskConical, Eye, CheckCircle, Shirt,
} from 'lucide-react';
import Image from 'next/image';

/* ── Design-system tokens (single source of truth) ─────── */
const C = {
  parchment:    'var(--color-parchment)',
  linen:        'var(--color-linen)',
  warmStone:    'var(--color-warm-stone)',
  walnut:       'var(--color-walnut)',
  espresso:     'var(--color-chocolate)',
  onyxWarm:     'var(--color-onyx-warm)',
  midnightRoast:'var(--color-midnight-roast)',
  saffron:      'var(--color-saffron)',
  chocolate:    'var(--color-chocolate)',
};

/* OTA brand colours — used only for the tiny 8 px dot accent */
const OTA_BRAND = {
  makemytrip: '#e8162d',
  oyo:        '#EE2D3C',
  goibibo:    '#00a3e0',
  agoda:      '#e9192a',
  tripcom:    '#007aff',
  bookingcom: '#003580',
  direct:     C.saffron,
};

export default function Home() {
  const [rooms,      setRooms]      = useState([]);
  const [gallery,    setGallery]    = useState([]);
  const [otaLinks,   setOtaLinks]   = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const [amenities,  setAmenities]  = useState([]);

  const heroHeadlineRef = useRef(null);
  const roomGridRef     = useRef(null);
  const amenitiesRef    = useRef(null);
  const locationRef     = useRef(null);
  const galleryRef      = useRef(null);

  useEffect(() => {
    Promise.all([getRooms(), getGallery(), getOtaLinks(), getSiteConfig(), getAmenities()]).then(
      ([r, g, o, s, a]) => { setRooms(r); setGallery(g.slice(0, 6)); setOtaLinks(o); setSiteConfig(s); setAmenities(a); }
    );
  }, []);

  // Animate once data is loaded
  useEffect(() => {
    if (!rooms.length) return;

    let isMounted = true;
    async function animate() {
      const { revealHeadline, revealRoomGrid, revealSection } = await import('@/lib/animations/scroll');
      if (!isMounted) return;

      // Headline word-split reveal
      if (heroHeadlineRef.current) revealHeadline(heroHeadlineRef.current);

      // Room grid staggered entrance — the signature interaction
      if (roomGridRef.current) {
        const cards = roomGridRef.current.querySelectorAll('[data-room-card]');
        revealRoomGrid(roomGridRef.current, cards);
      }

      // Section reveals
      if (amenitiesRef.current) revealSection(amenitiesRef.current);
      if (locationRef.current)  revealSection(locationRef.current);
      if (galleryRef.current)   revealSection(galleryRef.current);
    }

    animate();
    return () => { isMounted = false; };
  }, [rooms.length]);

  return (
    <>
      <Navbar variant="transparent" />
      <PageStyles />

      <main style={{ flex: 1 }}>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section
          data-section="hero"
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            backgroundColor: 'var(--color-cream)',
            display: 'flex',
            alignItems: 'flex-end',
            overflow: 'hidden',
          }}
        >
          {/* Dark gradient — no parallax, per constraints */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(41,38,34,0.25) 0%, rgba(41,38,34,0.85) 100%)',
              zIndex: 1,
            }}
          />

          {/* Textured parchment grain layer */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
              zIndex: 1,
              opacity: 0.5,
              pointerEvents: 'none',
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '90rem',
              margin: '0 auto',
              width: '100%',
              padding: '0 1.25rem 4rem',  /* mobile default */
            }}
            className="hero-inner"
          >
            {/* Meta labels */}
            <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
              {['Varanasi, India', 'Heritage Stay', 'Est. 1990s'].map(l => (
                <span
                  key={l}
                  style={{
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#FFFFFF',
                  }}
                >
                  {l}
                </span>
              ))}
            </div>

            {/* Display heading — animated by revealHeadline */}
            <h1
              ref={heroHeadlineRef}
              data-headline
              style={{
                fontFamily: 'var(--font-tt-ramillas-variable)',
                fontWeight: 300,
                fontSize: 'clamp(3.75rem, 9vw, 7.1875rem)',  /* 60px → 115px */
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#FFFFFF',
                maxWidth: '56.25rem',        /* 900px */
                marginBottom: '2.5rem',
              }}
            >
              Moksh<br />Haveli Inn
            </h1>

            <p
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
                color: '#FFFFFF',
                maxWidth: '26.25rem',        /* 420px */
                marginBottom: '2.5rem',
              }}
            >
              A heritage boutique guest house in the spiritual heart of Varanasi — where sacred ghats meet warm hospitality.
            </p>

            {/* CTAs */}
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <a href="/rooms" style={{ textDecoration: 'none' }}>
                <button
                  className="btn-hero-primary"
                  style={{
                    padding: '1rem 2.25rem',
                    border: `1px solid var(--color-gold)`,
                    borderRadius: '0.1875rem',
                    background: 'var(--color-gold)',
                    color: 'var(--color-chocolate)',
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 600,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    cursor: 'pointer',
                    transition: 'background 0.3s ease, color 0.3s ease, border-color 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-gold-hover)'; e.currentTarget.style.borderColor = 'var(--color-gold-hover)'; e.currentTarget.style.color = 'var(--color-cream)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-gold)'; e.currentTarget.style.borderColor = 'var(--color-gold)'; e.currentTarget.style.color = 'var(--color-chocolate)'; }}
                >
                  Explore Rooms
                </button>
              </a>
              <a href="/contact" style={{ textDecoration: 'none' }}>
                <button
                  style={{
                    padding: '1rem 2.25rem',
                    border: `1px solid rgba(255,255,255,0.40)`,
                    borderRadius: '0.1875rem',
                    background: 'transparent',
                    color: '#FFFFFF',
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    cursor: 'pointer',
                    transition: 'border-color 0.3s ease, color 0.3s ease, background 0.3s ease',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#FFFFFF'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.40)'; e.currentTarget.style.color = '#FFFFFF'; e.currentTarget.style.background = 'transparent'; }}
                >
                  Get in Touch
                </button>
              </a>
            </div>
          </div>

          {/* Star rating widget — hidden on small phones */}
          <div
            className="star-widget"
            style={{
              position: 'absolute',
              top: '5.75rem',              /* 92px */
              right: '2.5rem',
              zIndex: 2,
              backgroundColor: 'rgba(41,38,34,0.85)',
              border: `1px solid rgba(255,255,255,0.20)`,
              borderRadius: '0.1875rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem',
              backdropFilter: 'blur(8px)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.1875rem' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: 'var(--color-gold)', fontSize: '0.8125rem' }}>★</span>
              ))}
            </div>
            <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-satoshi)', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.025em' }}>
              4.7<span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'rgba(255,255,255,0.8)' }}>/5</span>
            </span>
            <span style={{ color: '#FFFFFF', fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Excellent
            </span>
          </div>
        </section>

        {/* ── DIVIDER ───────────────────────────────────────────── */}
        <Divider />

        {/* ── FEATURED ROOMS ────────────────────────────────────── */}
        <section
          style={{
            backgroundColor: 'var(--color-cream-deep)',
            padding: '5rem 1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}
          className="rooms-section"
        >
          {/* Jali lattice texture — faint 7% opacity geometric SVG */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '-10%',
              left: '-5%',
              width: '55%',
              height: '70%',
              background: `radial-gradient(ellipse at top left, rgba(201,168,76,0.15) 0%, transparent 65%)`,
              pointerEvents: 'none',
              zIndex: 0,
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '42%',
              height: '100%',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect x='20' y='0' width='14' height='14' transform='rotate(45 20 0)' fill='none' stroke='%23d8cbb8' stroke-width='0.8'/%3E%3Crect x='0' y='20' width='14' height='14' transform='rotate(45 0 20)' fill='none' stroke='%23d8cbb8' stroke-width='0.8'/%3E%3Crect x='40' y='20' width='14' height='14' transform='rotate(45 40 20)' fill='none' stroke='%23d8cbb8' stroke-width='0.8'/%3E%3Crect x='20' y='40' width='14' height='14' transform='rotate(45 20 40)' fill='none' stroke='%23d8cbb8' stroke-width='0.8'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
              opacity: 0.07,
              pointerEvents: 'none',
            }}
          />

          <div style={{ maxWidth: '90rem', margin: '0 auto', position: 'relative', zIndex: 1 }}>
            {/* Section header — light on dark */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3.5rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <SectionHeader caption="Our Rooms" heading="Stay in Heritage" size="heading" surface="light" />
              <a
                href="/rooms"
                style={{
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#000000',
                  textDecoration: 'underline',
                  textUnderlineOffset: '0.25rem',
                  opacity: 0.6,
                }}
              >
                View All Rooms →
              </a>
            </div>

            {/* Asymmetric room grid — GSAP staggered entrance triggered here */}
            <div
              ref={roomGridRef}
              data-section="room-grid"
              className="rooms-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'clamp(18rem, 61.5%, 1.6fr) 1fr',
                gridTemplateRows: 'auto auto',
                gap: '1.25rem',
              }}
            >
              {rooms.map((room, i) => {
                const isFeatured = room.rate === Math.max(...rooms.map(r => r.rate));
                return (
                  <PhotoRoomCard
                    key={room.id}
                    room={room}
                    featured={isFeatured}
                    whatsappNumber={siteConfig?.whatsappNumber}
                  />
                );
              })}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── AMENITIES ─────────────────────────────────────────── */}
        <section
          ref={amenitiesRef}
          data-section="amenities"
          style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}
        >
          <div
            className="amenities-layout"
            style={{
              maxWidth: '90rem',
              margin: '0 auto',
              display: 'grid',
              gridTemplateColumns: '1fr clamp(18rem, 38%, 28rem)',
              gap: '5rem',
              alignItems: 'start',
            }}
          >
            {/* Left — heading + amenity mini-grid */}
            <div>
              <SectionHeader
                caption="Amenities"
                heading="What's Included"
                subtext="Every room comes with thoughtfully curated amenities — from Split AC to private balconies with city views."
                size="heading-sm"
                surface="light"
              />
              <a
                href="/amenities"
                style={{
                  display: 'inline-block',
                  marginTop: '1.25rem',
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#000000',
                  textDecoration: 'underline',
                  textUnderlineOffset: '0.25rem',
                  opacity: 0.7,
                }}
              >
                View All Amenities →
              </a>
              <div
                className="amenities-inner-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1px',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  marginTop: '3rem',
                  border: '1px solid rgba(0,0,0,0.1)',
                }}
              >
                {amenities.map(({ id, name, category }) => (
                  <div
                    key={id}
                    style={{
                      backgroundColor: 'var(--color-cream-deep)',
                      padding: '1.25rem 1.25rem 1.25rem 1rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                    }}
                  >
                    <HomepageAmenityIcon name={name} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span
                        style={{
                          fontFamily: 'var(--font-satoshi)',
                          fontWeight: 500,
                          fontSize: '0.8125rem',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                          color: '#000000',
                          lineHeight: 1.2,
                        }}
                      >
                        {name}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-satoshi)',
                          fontWeight: 500,
                          fontSize: '0.6875rem',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                          color: 'var(--color-gold)',
                        }}
                      >
                        {category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — tall photo with italic caption */}
            <div
              style={{
                position: 'relative',
                aspectRatio: '4/5',
                overflow: 'hidden',
                border: '1px solid rgba(0,0,0,0.1)',
              }}
            >
              <Image
                src="/hotelpics/lobby_area.jpeg"
                alt="Haveli lobby — warm heritage detail"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  display: 'block',
                }}
              />
              {/* Italic caption overlay */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2rem 1.5rem 1.5rem',
                  background: 'linear-gradient(transparent, rgba(41,38,34,0.75))',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-tt-ramillas-variable)',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    fontSize: '1.25rem',
                    letterSpacing: '-0.02em',
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                  }}
                >
                  Every detail, considered.
                </span>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── GALLERY PREVIEW ───────────────────────────────────── */}
        <section
          ref={galleryRef}
          data-section="gallery-preview"
          style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}
        >
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <SectionHeader caption="Gallery" heading="The Property" size="heading-sm" surface="light" />
              <a
                href="/gallery"
                style={{
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#000000',
                  textDecoration: 'underline',
                  textUnderlineOffset: '0.25rem',
                  opacity: 0.7,
                }}
              >
                Full Gallery →
              </a>
            </div>
            <div
              className="gallery-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1.25rem',
              }}
            >
              {gallery.map(item => (
                <div
                  key={item.id}
                  style={{ aspectRatio: '4/3', overflow: 'hidden', position: 'relative' }}
                >
                  <Image
                    src={item.imageUrl}
                    alt={item.caption || item.category}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      display: 'block',
                      transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    }}
                    onMouseEnter={e => e.target.style.transform = 'scale(1.04)'}
                    onMouseLeave={e => e.target.style.transform = 'scale(1)'}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      padding: '1rem',
                      background: 'linear-gradient(transparent, rgba(41,38,34,0.7)',
                    }}
                  >
                    <span style={{
                      fontFamily: 'var(--font-satoshi)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      color: '#FFFFFF',
                    }}>
                      {item.caption}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        {/* ── OTA BOOK ON… ───────────────────────────────────────── */}

        <section
          data-section="ota"
          style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}
        >
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <SectionHeader
              caption="Online Travel Agencies"
              heading="Book on …"
              subtext="Find us on major booking platforms — or reach out directly for the best rate."
              size="heading-sm"
              surface="light"
            />
            <div
              className="ota-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
                gap: '1px',
                backgroundColor: 'rgba(0,0,0,0.1)',
                border: '1px solid rgba(0,0,0,0.1)',
                marginTop: '3rem',
              }}
            >
              {otaLinks.filter(o => o.active).map(ota => {
                const dot = OTA_BRAND[ota.id] || C.saffron;
                return (
                  <div
                    key={ota.id}
                    style={{
                      backgroundColor: 'var(--color-cream-deep)',
                      padding: '2.5rem 2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.5rem',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Brand dot + logo */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: dot, flexShrink: 0, display: 'inline-block' }} />
                      {ota.logoUrl ? (
                        <img
                          src={ota.logoUrl}
                          alt={`${ota.platform} logo`}
                          style={{ height: '2rem', width: 'auto', maxWidth: '8.5rem', objectFit: 'contain', display: 'block', borderRadius: '0.1875rem' }}
                        />
                      ) : (
                        <span style={{
                          fontFamily: 'var(--font-tt-ramillas-variable)',
                          fontWeight: 300,
                          fontSize: '2rem',
                          lineHeight: 0.9,
                          letterSpacing: '-0.04em',
                          textTransform: 'uppercase',
                          color: 'var(--color-gold)',
                        }}>
                          {ota.platform}
                        </span>
                      )}
                    </div>
                    <a
                      href={ota.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`ota-book-${ota.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.375rem',
                        padding: '0.625rem 1.375rem',
                        border: `1px solid var(--color-gold)`,
                        borderRadius: '0.1875rem',
                        background: 'transparent',
                        color: '#000000',
                        fontFamily: 'var(--font-satoshi)',
                        fontWeight: 500,
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        textDecoration: 'none',
                        whiteSpace: 'nowrap',
                        transition: 'background 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#d8cbb8'; e.currentTarget.style.color = '#2c2c2c'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d8cbb8'; }}
                    >
                      Book on {ota.platform} →
                    </a>
                  </div>
                );
              })}
              {/* Direct booking card */}
              <div
                style={{
                  backgroundColor: 'var(--color-cream-deep)',
                  padding: '2.5rem 2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                  alignItems: 'flex-start',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: C.saffron, flexShrink: 0, display: 'inline-block' }} />
                  <img
                    src="/logos/whatsapp.svg"
                    alt="WhatsApp logo"
                    style={{ height: '2rem', width: 'auto', maxWidth: '8.5rem', objectFit: 'contain', display: 'block', borderRadius: '0.1875rem' }}
                  />
                </div>
                <a
                  href={siteConfig ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMessage || '')}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="ota-book-direct"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.375rem',
                    padding: '0.625rem 1.375rem',
                    border: `1px solid var(--color-gold)`,
                    borderRadius: '0.1875rem',
                    background: 'transparent',
                    color: '#000000',
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'background 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), color 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#d8cbb8'; e.currentTarget.style.color = '#2c2c2c'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d8cbb8'; }}
                >
                  Book Direct →
                </a>
              </div>
            </div>
          </div>
        </section>

        <Divider />

        {/* ── LOCATION CTA (DARK) ───────────────────────────────── */}
        <section
          ref={locationRef}
          data-section="location"
          style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}
        >
          <div
            style={{
              maxWidth: '90rem',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              flexWrap: 'wrap',
              gap: '2.5rem',
            }}
          >
            <SectionHeader
              caption="Varanasi · India"
              heading="Sacred City, Serene Stay"
              subtext="Steps from the ghats of the Ganges — our heritage property puts you at the spiritual centre of India."
              size="heading"
              surface="light"
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
              {[
                { label: 'Get Directions', href: '/contact', muted: false },
                { label: 'Our Story',      href: '/about',   muted: true  },
              ].map(({ label, href, muted }) => (
                <a key={href} href={href} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      padding: '1rem 2.25rem',
                      border: `1px solid ${muted ? 'rgba(0,0,0,0.3)' : '#000000'}`,
                      borderRadius: '0.1875rem',
                      background: 'transparent',
                      color: '#000000',
                      fontFamily: 'var(--font-satoshi)',
                      fontWeight: 500,
                      fontSize: '0.8125rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      cursor: 'pointer',
                      transition: 'border-color 0.4s ease, color 0.4s ease',
                    }}
                  >
                    {label}
                  </button>
                </a>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {siteConfig && <WhatsAppFloat siteConfig={siteConfig} />}
    </>
  );
}

/**
 * PageStyles — single <style> block rendered once in the page.
 * Covers all hover interactions + responsive breakpoints.
 * Using !important to override inline styles where needed.
 */
function PageStyles() {
  return (
    <style>{`
      /* ── Hero ── */
      @media (min-width: 48rem) {
        .hero-inner { padding: 0 2.5rem 6rem !important; }
      }
      @media (max-width: 47.9375rem) {
        .star-widget { display: none !important; }
      }

      /* ── Rooms section padding ── */
      @media (min-width: 48rem) {
        .rooms-section { padding: 7.5rem 2.5rem !important; }
      }

      /* ── Photo card hover (desktop) ── */
      [data-room-card]:hover .photo-card-img {
        transform: scale(1.04);
      }
      [data-room-card]:hover .photo-card-reveal {
        opacity: 1 !important;
        transform: translateY(0) !important;
      }

      /* ── Touch / mobile: always show reveal panel ── */
      /* hover:none catches touchscreens; the width breakpoint is a belt-and-suspenders fallback */
      @media (hover: none) {
        [data-room-card] .photo-card-reveal {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }
      }

      /* ── Tablet: 600–900px ── */
      @media (max-width: 56.25rem) {
        /* Room grid collapses to single column */
        .rooms-grid {
          grid-template-columns: 1fr !important;
        }
        [data-room-card] {
          grid-column: 1 / -1 !important;
          grid-row: auto !important;
          min-height: 20rem !important;
        }
        /* Always show reveal on mobile since there's no hover */
        [data-room-card] .photo-card-reveal {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        /* Amenities: stack photo below text */
        .amenities-layout {
          grid-template-columns: 1fr !important;
          gap: 2.5rem !important;
        }

        /* Gallery: 2 cols on tablet */
        .gallery-grid {
          grid-template-columns: 1fr 1fr !important;
        }
      }

      /* ── Mobile: < 480px ── */
      @media (max-width: 30rem) {
        /* Gallery: 1 col on phone */
        .gallery-grid {
          grid-template-columns: 1fr !important;
        }
        /* Amenities inner: 1 col on small phones */
        .amenities-inner-grid {
          grid-template-columns: 1fr !important;
        }
        /* OTA grid: 1 col on small phones */
        .ota-grid {
          grid-template-columns: 1fr !important;
        }
      }
    `}</style>
  );
}

function Divider() {
  return (
    <div style={{ backgroundColor: 'var(--color-cream-deep)' }}>
      <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(216,203,184,0.1)' }} />
      </div>
    </div>
  );
}

/**
 * PhotoRoomCard — full-bleed photo card for the homepage asymmetric room grid.
 *
 * Default: photo background + saffron rule + room name + price pill.
 * Hover:   specs + single link CTA fade/slide in (opacity + translateY).
 * Featured (highest-priced): spans 2 rows, taller card, larger heading.
 */
function PhotoRoomCard({ room, featured, whatsappNumber }) {
  const { id, name, rate, size, maxOccupancy, beds, images, image } = room;
  const heroImage = (images && images[0]) || image || null;
  const max = maxOccupancy || room.max;
  const heroSrc = heroImage
    ? heroImage
    : `https://placehold.co/900x${featured ? '800' : '600'}/292622/978e81?text=${encodeURIComponent(name)}`;

  return (
    <div
      data-room-card
      style={{
        position: 'relative',
        overflow: 'hidden',
        gridRow: featured ? '1 / 3' : undefined,
        backgroundColor: 'var(--color-cream-deep)',
        minHeight: featured ? '44rem' : '22rem',
        cursor: 'pointer',
      }}
    >
      {/* Background photo */}
      <Image
        src={heroSrc}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
          transition: 'transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        }}
        className="photo-card-img"
      />

      {/* Dark gradient overlay — 95% at bottom, transparent at 60% */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, transparent 0%, transparent 40%, rgba(41,38,34,0.95) 100%)',
          zIndex: 1,
        }}
      />

      {/* Price pill — top right */}
      <div
        style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          zIndex: 3,
          backgroundColor: 'rgba(41,38,34,0.72)',
          border: '1px solid rgba(216,203,184,0.2)',
          borderRadius: '0.1875rem',
          padding: '0.25rem 0.625rem',
          fontFamily: 'var(--font-satoshi)',
          fontWeight: 500,
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          color: '#FFFFFF',
          backdropFilter: 'blur(4px)',
        }}
      >
        ₹{rate?.toLocaleString('en-IN')}/night
      </div>

      {/* Bottom content — always visible: rule + name; hover reveals specs + CTA */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          padding: featured ? '2rem' : '1.5rem',
        }}
        className="photo-card-content"
      >
        {/* Saffron rule */}
        <div
          style={{
            width: '2rem',
            height: '1px',
            backgroundColor: '#d49653',
            marginBottom: '0.75rem',
          }}
        />

        {/* Room name — always visible */}
        <h3
          style={{
            fontFamily: 'var(--font-tt-ramillas-variable)',
            fontWeight: 300,
            fontSize: featured ? '2.375rem' : '1.75rem',
            lineHeight: 0.95,
            letterSpacing: '-0.04em',
            textTransform: 'uppercase',
            color: '#FFFFFF',
            marginBottom: '1rem',
          }}
        >
          {name}
        </h3>

        {/* Hover-reveal block: specs + CTA */}
        <div
          className="photo-card-reveal"
          style={{
            opacity: 0,
            transform: 'translateY(0.75rem)',
            transition: 'opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          }}
        >
          {/* Specs row */}
          <div
            style={{
              display: 'flex',
              gap: '1.25rem',
              flexWrap: 'wrap',
              marginBottom: '1.25rem',
            }}
          >
            {size && (
              <span style={{ fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                {size}
              </span>
            )}
            {max && (
              <span style={{ fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                Max {max} guests
              </span>
            )}
            {beds && (
              <span style={{ fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF' }}>
                {beds}
              </span>
            )}
          </div>

          {/* Single link-style CTA */}
          <a
            href={`/rooms/${id}`}
            style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.8125rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#FFFFFF',
              textDecoration: 'underline',
              textUnderlineOffset: '0.25rem',
              display: 'inline-block',
            }}
          >
            Explore Room →
          </a>
        </div>
      </div>

      {/* No inline <style> here — all responsive CSS lives in <PageStyles /> */}
    </div>
  );
}

/* Amenity icon map — Lucide icons, saffron #d49653, 18px */
function HomepageAmenityIcon({ name }) {
  const n = (name || '').toLowerCase();
  const s = { flexShrink: 0, marginTop: '0.1rem', color: '#d49653' };
  const size = 18;
  const sw   = 1.5;

  if (n.includes('wi-fi') || n.includes('wifi'))        return <Wifi size={size} strokeWidth={sw} style={s} />;
  if (n.includes('air') || n.includes('ac'))            return <Wind size={size} strokeWidth={sw} style={s} />;
  if (n.includes('tv') || n.includes('television'))     return <Tv size={size} strokeWidth={sw} style={s} />;
  if (n.includes('balcony'))                            return <Sparkles size={size} strokeWidth={sw} style={s} />;
  if (n.includes('shower'))                             return <ShowerHead size={size} strokeWidth={sw} style={s} />;
  if (n.includes('bathroom'))                           return <Droplets size={size} strokeWidth={sw} style={s} />;
  if (n.includes('towel'))                              return <Shirt size={size} strokeWidth={sw} style={s} />;
  if (n.includes('water') && n.includes('hot'))         return <Flame size={size} strokeWidth={sw} style={s} />;
  if (n.includes('water') || n.includes('mineral'))     return <Droplets size={size} strokeWidth={sw} style={s} />;
  if (n.includes('kettle'))                             return <FlaskConical size={size} strokeWidth={sw} style={s} />;
  if (n.includes('toiletries') || n.includes('soap'))   return <FlaskConical size={size} strokeWidth={sw} style={s} />;
  if (n.includes('peep') || n.includes('security'))     return <Eye size={size} strokeWidth={sw} style={s} />;
  return <CheckCircle size={size} strokeWidth={sw} style={s} />;
}
