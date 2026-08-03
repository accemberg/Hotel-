'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import SectionHeader from '@/components/SectionHeader';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getRooms, getOtaLinks, getSiteConfig } from '@/lib/api';

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

      <main style={{ flex: 1, paddingTop: '4.5rem' /* nav height */ }}>

        {/* Page header — dark atmospheric */}
        <section style={{ backgroundColor: '#292622', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#978e81',
              display: 'block',
              marginBottom: '1.5rem',
            }}>
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
                color: '#DEB76A',
                marginBottom: '1.5rem',
              }}
            >
              Our Rooms
            </h1>
            <p style={{
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.9375rem',
              lineHeight: 1.6,
              letterSpacing: '-0.01em',
              color: '#bfb4a3',
              maxWidth: '30rem',
            }}>
              Four distinct room types, each with a private balcony and the warmth of a century-old haveli.
            </p>
          </div>
        </section>

        {/* Hairline divider */}
        <div style={{ backgroundColor: '#292622' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(216,203,184,0.1)' }} />
          </div>
        </div>

        {/* Room grid */}
        <section style={{ backgroundColor: '#292622', padding: '7.5rem 2.5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div
              ref={gridRef}
              data-section="room-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
                gap: '1px',
                backgroundColor: 'rgba(216,203,184,0.1)',
              }}
            >
              {rooms.map(room => (
                <div key={room.id} style={{ backgroundColor: '#292622' }}>
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
        <div style={{ backgroundColor: '#292622' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(216,203,184,0.1)' }} />
          </div>
        </div>

        {/* OTA Book on... */}
        <section data-section="ota" style={{ backgroundColor: '#292622', padding: '7.5rem 2.5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <SectionHeader
              caption="Online Travel Agencies"
              heading="Book on …"
              subtext="Find us on major booking platforms — or enquire directly for the best rate."
              size="heading-sm"
            />
            <div
              className="ota-grid-rooms"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(14rem, 1fr))',
                gap: '1px',
                backgroundColor: 'rgba(216,203,184,0.1)',
                border: '1px solid rgba(216,203,184,0.1)',
                marginTop: '3rem',
              }}
            >
              {otaLinks.filter(o => o.active).map(ota => (
                <div key={ota.id} style={{ backgroundColor: '#292622', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
                  <span style={{ fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300, fontSize: '2rem', lineHeight: 0.9, letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#DEB76A' }}>
                    {ota.platform}
                  </span>
                  <a
                    href={ota.listingUrl}
                    target="_blank" rel="noopener noreferrer"
                    id={`rooms-ota-book-${ota.id}`}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.375rem', border: '1px solid #d8cbb8', borderRadius: '0.1875rem', background: 'transparent', color: '#d8cbb8', fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '-0.01em', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 0.4s ease, color 0.4s ease' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#d8cbb8'; e.currentTarget.style.color = '#2c2c2c'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#2c2c2c'; }}
                  >
                    Book on {ota.platform} →
                  </a>
                </div>
              ))}
              <div style={{ backgroundColor: '#292622', padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'flex-start' }}>
                <span style={{ fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300, fontSize: '2rem', lineHeight: 0.9, letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#DEB76A' }}>
                  Direct
                </span>
                <a
                  href={siteConfig ? `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMessage || '')}` : '#'}
                  target="_blank" rel="noopener noreferrer"
                  id="rooms-ota-book-direct"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', padding: '0.625rem 1.375rem', border: '1px solid #d8cbb8', borderRadius: '0.1875rem', background: 'transparent', color: '#d8cbb8', fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '-0.01em', textDecoration: 'none', whiteSpace: 'nowrap', transition: 'background 0.4s ease, color 0.4s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.background = '#d8cbb8'; e.currentTarget.style.color = '#2c2c2c'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#d8cbb8'; }}
                >
                  Enquire via WhatsApp →
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
