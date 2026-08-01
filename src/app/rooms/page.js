'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import SectionHeader from '@/components/SectionHeader';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getRooms, getSiteConfig } from '@/lib/api';

export default function RoomsPage() {
  const [rooms,      setRooms]      = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([getRooms(), getSiteConfig()]).then(([r, s]) => {
      setRooms(r);
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
                color: '#d8cbb8',
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
        <div style={{ backgroundColor: '#d8cbb8' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid #b6ab9c' }} />
          </div>
        </div>

        {/* Room grid */}
        <section style={{ backgroundColor: '#d8cbb8', padding: '7.5rem 2.5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div
              ref={gridRef}
              data-section="room-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(20rem, 1fr))',
                gap: '1px',
                backgroundColor: '#b6ab9c',
              }}
            >
              {rooms.map(room => (
                <div key={room.id} style={{ backgroundColor: '#d8cbb8' }}>
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

      </main>

      <Footer />
      {siteConfig && <WhatsAppFloat siteConfig={siteConfig} />}
    </>
  );
}
