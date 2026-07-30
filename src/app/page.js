'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import RoomCard from '@/components/RoomCard';
import SectionHeader from '@/components/SectionHeader';

// Mock room data — Section 04 of dev brief
const ROOMS = [
  { id: 'standard-room-with-balcony',   name: 'Standard Room with Balcony',   rate: 1500, qty: 3, size: '250 sq ft', beds: '1 King Bed',          max: 3, image: null },
  { id: 'master-room-with-balcony',     name: 'Master Room with Balcony',     rate: 2200, qty: 2, size: '300 sq ft', beds: '1 King + 1 Single',    max: 4, image: null },
  { id: 'deluxe-room-with-balcony',     name: 'Deluxe Room with Balcony',     rate: 3500, qty: 1, size: '400 sq ft', beds: '2 King Beds',          max: 6, image: null },
  { id: 'honeymoon-suite-with-balcony', name: 'Honeymoon Suite with Balcony', rate: 1200, qty: 4, size: '400 sq ft', beds: '1 King Bed',           max: 3, image: null },
];

const AMENITIES = [
  ['Air Conditioning', 'In-room'],   ['Free Wi-Fi',     'In-room'],
  ['LED TV',           'In-room'],   ['Electric Kettle','In-room'],
  ['Private Balcony',  'In-room'],   ['Private Bathroom','Bathroom'],
  ['Hot & Cold Water', 'Bathroom'],  ['Toiletries',     'Bathroom'],
  ['Bath Towels',      'Bathroom'],  ['Mineral Water',  'Food & Drink'],
  ['Peep Hole',        'Security'],  ['City View',      'Views'],
];

export default function Home() {
  return (
    <>
      <Navbar variant="transparent" />

      <main style={{ flex: 1 }}>

        {/* ── HERO ──────────────────────────────────────────────── */}
        <section
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '100vh',
            backgroundColor: '#292622',
            display: 'flex',
            alignItems: 'flex-end',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to bottom, rgba(41,38,34,0.3) 0%, rgba(41,38,34,0.75) 100%)',
              zIndex: 1,
            }}
          />

          <div
            style={{
              position: 'relative',
              zIndex: 2,
              maxWidth: '80rem',
              margin: '0 auto',
              width: '100%',
              padding: '0 2.5rem 5rem',
            }}
          >
            <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.5rem' }}>
              {['Varanasi, India', 'Heritage Stay', 'Established'].map(l => (
                <span
                  key={l}
                  style={{
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    color: '#978e81',
                  }}
                >
                  {l}
                </span>
              ))}
            </div>

            <h1
              style={{
                fontFamily: 'var(--font-tt-ramillas-variable)',
                fontWeight: 300,
                fontSize: 'clamp(3.75rem, 9vw, 7.1875rem)',
                lineHeight: 0.85,
                letterSpacing: '-0.04em',
                textTransform: 'uppercase',
                color: '#d8cbb8',
                maxWidth: '56.25rem',
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
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
                color: '#bfb4a3',
                maxWidth: '26.25rem',
                marginBottom: '2.5rem',
              }}
            >
              A heritage boutique guest house in the spiritual heart of Varanasi — where sacred ghats meet warm hospitality.
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Explore Rooms', href: '/rooms',  fill: false },
                { label: 'Book Now',      href: '/book',   fill: true  },
              ].map(({ label, href, fill }) => (
                <a key={href} href={href} style={{ textDecoration: 'none' }}>
                  <button
                    style={{
                      padding: '1rem 2.25rem',
                      border: '1px solid #d8cbb8',
                      borderRadius: '0.1875rem',
                      background: fill ? '#d8cbb8' : 'transparent',
                      color: fill ? '#2c2c2c' : '#d8cbb8',
                      fontFamily: 'var(--font-satoshi)',
                      fontWeight: 500,
                      fontSize: '0.8125rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      cursor: 'pointer',
                    }}
                  >
                    {label}
                  </button>
                </a>
              ))}
            </div>
          </div>

          <div
            style={{
              position: 'absolute',
              top: '5.75rem',
              right: '2.5rem',
              zIndex: 2,
              backgroundColor: 'rgba(41,38,34,0.85)',
              border: '1px solid rgba(216,203,184,0.15)',
              borderRadius: '0.1875rem',
              padding: '1rem 1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.375rem',
              backdropFilter: 'blur(0.5rem)',
            }}
          >
            <div style={{ display: 'flex', gap: '0.1875rem' }}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={{ color: '#d49653', fontSize: '0.8125rem' }}>★</span>
              ))}
            </div>
            <span style={{ color: '#d8cbb8', fontFamily: 'var(--font-satoshi)', fontWeight: 700, fontSize: '1.25rem', lineHeight: 1, letterSpacing: '-0.025em' }}>
              4.7<span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#978e81' }}>/5</span>
            </span>
            <span style={{ color: '#978e81', fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '-0.01em' }}>
              Excellent
            </span>
          </div>
        </section>

        <Divider />

        <section style={{ backgroundColor: '#d8cbb8', padding: '7.5rem 2.5rem' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '1.5rem' }}>
              <SectionHeader caption="Our Rooms" heading="Stay in Heritage" size="heading" />
              <a
                href="/rooms"
                style={{
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.8125rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  color: '#2c2c2c',
                  textDecoration: 'underline',
                  textUnderlineOffset: '0.25rem',
                  opacity: 0.7,
                }}
              >
                View All Rooms →
              </a>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(17.5rem, 1fr))',
                gap: '1px',
                backgroundColor: '#b6ab9c',
              }}
            >
              {ROOMS.map(room => (
                <div key={room.id} style={{ backgroundColor: '#d8cbb8' }}>
                  <RoomCard room={room} />
                </div>
              ))}
            </div>
          </div>
        </section>

        <Divider />

        <section style={{ backgroundColor: '#d8cbb8', padding: '7.5rem 2.5rem' }}>
          <div style={{ maxWidth: '80rem', margin: '0 auto' }}>
            <SectionHeader
              caption="Amenities"
              heading="What's Included"
              subtext="Every room comes with 16 thoughtfully curated amenities — from Split AC to private balconies with city views."
              size="heading-sm"
            />
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(12.5rem, 1fr))',
                gap: '1px',
                backgroundColor: '#b6ab9c',
                marginTop: '4rem',
              }}
            >
              {AMENITIES.map(([name, cat]) => (
                <div
                  key={name}
                  style={{ backgroundColor: '#d8cbb8', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.375rem' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-tt-ramillas-variable)',
                      fontWeight: 300,
                      fontSize: '1.375rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.04em',
                      color: '#2c2c2c',
                      lineHeight: 1,
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
                      color: '#978e81',
                    }}
                  >
                    {cat}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ backgroundColor: '#292622', padding: '7.5rem 2.5rem' }}>
          <div
            style={{
              maxWidth: '80rem',
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
              surface="dark"
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
                      border: `1px solid ${muted ? 'rgba(216,203,184,0.3)' : '#d8cbb8'}`,
                      borderRadius: '0.1875rem',
                      background: 'transparent',
                      color: muted ? '#978e81' : '#d8cbb8',
                      fontFamily: 'var(--font-satoshi)',
                      fontWeight: 500,
                      fontSize: '0.8125rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      cursor: 'pointer',
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

      <a
        href="https://wa.me/91XXXXXXXXXX?text=Hi! I'd like to enquire about rooms at Moksh Haveli Inn."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        style={{
          position: 'fixed',
          bottom: '1.75rem',
          right: '1.75rem',
          zIndex: 200,
          width: '3.25rem',
          height: '3.25rem',
          borderRadius: '50%',
          backgroundColor: '#25D366',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0.25rem 1rem rgba(37,211,102,0.35)',
          textDecoration: 'none',
          transition: 'transform 0.25s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.08)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </>
  );
}

function Divider() {
  return (
    <div style={{ backgroundColor: '#d8cbb8' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto', padding: '0 2.5rem' }}>
        <hr style={{ border: 'none', borderTop: '1px solid #b6ab9c' }} />
      </div>
    </div>
  );
}