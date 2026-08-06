'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import SectionHeader from '@/components/SectionHeader';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getRooms, getOtaLinks, getSiteConfig } from '@/lib/api';
import { ExternalLink } from 'lucide-react';

/* Design-system tokens */
const C = {
  parchment:    'var(--color-parchment)',
  linen:        'var(--color-linen)',
  warmStone:    'var(--color-warm-stone)',
  walnut:       'var(--color-walnut)',
  espresso:     'var(--color-chocolate)',
  onyxWarm:     'var(--color-onyx-warm)',
  midnightRoast:'var(--color-midnight-roast)',
  saffron:      'var(--color-saffron)',
};

const OTA_BRAND = {
  makemytrip: '#e8162d',
  oyo:        '#EE2D3C',
  goibibo:    '#00a3e0',
  agoda:      '#e9192a',
  tripcom:    '#007aff',
  bookingcom: '#003580',
  direct:     C.saffron,
};

export default function RoomsPage() {
  const [rooms,      setRooms]      = useState([]);
  const [otaLinks,   setOtaLinks]   = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([getRooms(), getOtaLinks(), getSiteConfig()]).then(([r, o, s]) => {
      setRooms(r);
      setOtaLinks(o);
      setSiteConfig(s);
    });
  }, []);

  useEffect(() => {
    if (!rooms.length || !gridRef.current) return;
    let isMounted = true;
    async function animate() {
      const { revealRoomGrid } = await import('@/lib/animations/scroll');
      if (!isMounted || !gridRef.current) return;
      const cards = gridRef.current.querySelectorAll('[data-room-card]');
      revealRoomGrid(gridRef.current, cards);
    }
    animate();
    return () => { isMounted = false; };
  }, [rooms.length]);

  return (
    <>
      <Navbar variant="solid" />
      <RoomsStyles />

      <main style={{ flex: 1, paddingTop: '4rem' }}>

        {/* Page header — dark atmospheric */}
        <section style={{ backgroundColor: 'var(--color-cream)', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                color: C.chocolate,
                display: 'block',
                marginBottom: '1.5rem',
              }}
            >
              Accommodation
            </span>
            <h1
              style={{
                fontFamily: 'var(--font-tt-ramillas-variable)',
                fontWeight: 300,
                fontSize: 'clamp(3.125rem, 6vw, 4.3125rem)',
                lineHeight: 0.9,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: 'var(--color-chocolate)',
                marginBottom: '1rem',
              }}
            >
              Our Rooms
            </h1>
            <div style={{ width: '2.5rem', height: '1px', backgroundColor: 'var(--color-gold)', margin: '1rem 0' }} />
            <p
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.9375rem',
                lineHeight: 1.7,
                letterSpacing: '-0.01em',
                color: C.chocolate,
                maxWidth: '30rem',
              }}
            >
              Four distinct room types, each with a private balcony and the warmth of a century-old haveli.
            </p>
          </div>
        </section>

        {/* Hairline divider */}
        <div style={{ backgroundColor: 'var(--color-cream-deep)' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: `1px solid ${C.chocolate}` }} />
          </div>
        </div>

        {/* Room grid — onyx warm */}
        <section style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div
              ref={gridRef}
              data-section="room-grid"
              className="rooms-grid-page"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
                gap: '1px',
                backgroundColor: `rgba(216,203,184,0.08)`,
              }}
            >
              {rooms.map(room => (
                <div key={room.id} style={{ backgroundColor: 'var(--color-cream)' }}>
                  <RoomCard
                    room={room}
                    whatsappNumber={siteConfig?.whatsappNumber}
                    whatsappDefaultMessage={siteConfig?.whatsappDefaultMessage}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Hairline divider */}
        <div style={{ backgroundColor: 'var(--color-cream-deep)' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: `1px solid ${C.chocolate}` }} />
          </div>
        </div>

        {/* OTA Book on… — parchment */}
        <section data-section="ota" style={{ backgroundColor: 'var(--color-cream)', padding: '7.5rem 2.5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <SectionHeader
              caption="Online Travel Agencies"
              heading="Book on …"
              subtext="Find us on major booking platforms — or enquire directly for the best rate."
              size="heading-sm"
              surface="light"
            />
            <div
              className="ota-grid-rooms"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1px',
                backgroundColor: C.warmStone,
                border: `1px solid ${C.warmStone}`,
                marginTop: '3rem',
              }}
            >
              {otaLinks.filter(o => o.active).map(ota => {
                const dot = OTA_BRAND[ota.id] || C.saffron;
                return (
                  <div
                    key={ota.id}
                    className="ota-card-rooms"
                    style={{
                      backgroundColor: 'var(--color-cream)',
                      padding: '2.5rem 2rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.25rem',
                      alignItems: 'flex-start',
                      transition: 'background 0.3s ease',
                    }}
                  >
                    {/* Brand logo + dot accent */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                      <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: dot, flexShrink: 0, display: 'inline-block' }} />
                      {ota.logoUrl ? (
                        <img
                          src={ota.logoUrl}
                          alt={`${ota.platform} logo`}
                          style={{ height: '2rem', width: 'auto', maxWidth: '8rem', objectFit: 'contain', display: 'block', borderRadius: '0.1875rem' }}
                        />
                      ) : (
                        <span style={{ fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300, fontSize: '2rem', lineHeight: 0.9, letterSpacing: '-0.04em', textTransform: 'uppercase', color: C.onyxWarm }}>
                          {ota.platform}
                        </span>
                      )}
                    </div>
                    <a
                      href={ota.listingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      id={`rooms-ota-book-${ota.id}`}
                      className="ota-book-btn-rooms"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.375rem', border: `1px solid ${C.chocolate}`, borderRadius: '0.1875rem', background: 'transparent', color: C.chocolate, fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '-0.01em', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'border-color 0.3s ease, color 0.3s ease' }}
                    >
                      Book on {ota.platform}
                      <ExternalLink size={11} strokeWidth={1.5} />
                    </a>
                  </div>
                );
              })}

              {/* Direct booking */}
              <div
                className="ota-card-rooms"
                style={{ backgroundColor: 'var(--color-cream)', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', alignItems: 'flex-start', transition: 'background 0.3s ease' }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <span style={{ width: '0.375rem', height: '0.375rem', borderRadius: '50%', backgroundColor: 'var(--color-gold)', flexShrink: 0, display: 'inline-block' }} />
                  <img
                    src="/logos/whatsapp.svg"
                    alt="WhatsApp logo"
                    style={{ height: '2rem', width: 'auto', maxWidth: '8rem', objectFit: 'contain', display: 'block', borderRadius: '0.1875rem' }}
                  />
                </div>
                <a
                  href={siteConfig ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMessage || '')}` : '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  id="rooms-ota-book-direct"
                  className="ota-book-btn-rooms"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.375rem', border: `1px solid ${C.chocolate}`, borderRadius: '0.1875rem', background: 'transparent', color: C.chocolate, fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '-0.01em', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'border-color 0.3s ease, color 0.3s ease' }}
                >
                  Enquire via WhatsApp
                  <ExternalLink size={11} strokeWidth={1.5} />
                </a>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      {siteConfig && <WhatsAppFloat siteConfig={siteConfig} />}
    </>
  );
}

function RoomsStyles() {
  return (
    <style>{`
      .ota-card-rooms:hover { background: #cbbfaf !important; }
      .ota-card-rooms:hover .ota-book-btn-rooms {
        border-color: var(--color-onyx-warm) !important;
        color: var(--color-onyx-warm) !important;
      }
      /* Desktop: 4-col OTA (set inline) */
      @media (max-width: 72rem) {
        .ota-grid-rooms { grid-template-columns: repeat(3, 1fr) !important; }
      }
      @media (max-width: 56.25rem) {
        .ota-grid-rooms { grid-template-columns: repeat(2, 1fr) !important; }
        .rooms-grid-page { grid-template-columns: 1fr !important; }
      }
      @media (max-width: 30rem) {
        .ota-grid-rooms { grid-template-columns: 1fr !important; }
        .rooms-grid-page { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}
