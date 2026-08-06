'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SectionHeader from '@/components/SectionHeader';
import { getAmenities, getSiteConfig } from '@/lib/api';
import {
  Wifi, Wind, Tv,
  ShowerHead, Droplets,
  Flame, FlaskConical, Eye, Refrigerator,
  BedDouble, Utensils, Shield, Sparkles, CheckCircle, Shirt,
} from 'lucide-react';

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

function AmenityLucideIcon({ name }) {
  const n = (name || '').toLowerCase();
  const s = { flexShrink: 0, color: 'var(--color-gold)' };
  const size = 18; const sw = 1.5;
  if (n.includes('wi-fi') || n.includes('wifi'))     return <Wifi size={size} strokeWidth={sw} style={s} />;
  if (n.includes('air') || n.includes('ac'))         return <Wind size={size} strokeWidth={sw} style={s} />;
  if (n.includes('tv') || n.includes('television'))  return <Tv size={size} strokeWidth={sw} style={s} />;
  if (n.includes('balcony'))                         return <Sparkles size={size} strokeWidth={sw} style={s} />;
  if (n.includes('shower'))                          return <ShowerHead size={size} strokeWidth={sw} style={s} />;
  if (n.includes('bathroom'))                        return <Droplets size={size} strokeWidth={sw} style={s} />;
  if (n.includes('towel'))                           return <Shirt size={size} strokeWidth={sw} style={s} />;
  if (n.includes('water') && n.includes('hot'))      return <Flame size={size} strokeWidth={sw} style={s} />;
  if (n.includes('water') || n.includes('mineral'))  return <Droplets size={size} strokeWidth={sw} style={s} />;
  if (n.includes('kettle'))                          return <FlaskConical size={size} strokeWidth={sw} style={s} />;
  if (n.includes('toiletries') || n.includes('soap'))return <FlaskConical size={size} strokeWidth={sw} style={s} />;
  if (n.includes('peep') || n.includes('security'))  return <Eye size={size} strokeWidth={sw} style={s} />;
  if (n.includes('fridge') || n.includes('refrig'))  return <Refrigerator size={size} strokeWidth={sw} style={s} />;
  if (n.includes('bed'))                             return <BedDouble size={size} strokeWidth={sw} style={s} />;
  if (n.includes('dining') || n.includes('food'))    return <Utensils size={size} strokeWidth={sw} style={s} />;
  return <CheckCircle size={size} strokeWidth={sw} style={s} />;
}

const CATEGORY_ORDER = ['In-room', 'Bathroom', 'Food & Drink', 'Security'];

export default function AmenitiesPage() {
  const [amenities,  setAmenities]  = useState([]);
  const [siteConfig, setSiteConfig] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([getAmenities(), getSiteConfig()]).then(([a, s]) => {
      setAmenities(a);
      setSiteConfig(s);
    });
  }, []);

  useEffect(() => {
    if (!amenities.length || !gridRef.current) return;
    let isMounted = true;
    async function animate() {
      const { revealSection } = await import('@/lib/animations/scroll');
      if (!isMounted || !gridRef.current) return;
      revealSection(gridRef.current, { start: 'top 88%' });
    }
    animate();
    return () => { isMounted = false; };
  }, [amenities.length]);

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = amenities.filter(a => a.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});
  amenities.forEach(a => {
    if (!CATEGORY_ORDER.includes(a.category) && !grouped[a.category]) {
      grouped[a.category] = amenities.filter(x => x.category === a.category);
    }
  });

  return (
    <>
      <Navbar variant="solid" />
      <AmenitiesStyles />

      <main style={{ flex: 1, paddingTop: '4rem', backgroundColor: 'var(--color-cream)' }}>

        {/* Dark header */}
        <section style={{ backgroundColor: 'var(--color-cream)', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.06em', color: C.chocolate,
              display: 'block', marginBottom: '1.5rem',
            }}>
              Every Stay Includes
            </span>
            <h1 style={{
              fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
              fontSize: 'clamp(3.125rem, 6vw, 4.3125rem)', lineHeight: 0.9,
              letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--color-chocolate)',
              marginBottom: '1rem',
            }}>
              Amenities
            </h1>
            <div style={{ width: '2.5rem', height: '1px', backgroundColor: 'var(--color-gold)' }} />
          </div>
        </section>

        {/* Divider */}
        <div style={{ backgroundColor: 'var(--color-cream-deep)' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: `1px solid ${C.chocolate}` }} />
          </div>
        </div>

        {/* Intro — parchment */}
        <section style={{ backgroundColor: 'var(--color-cream)', padding: '5rem 2.5rem 0' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div style={{ maxWidth: '42rem' }}>
              <SectionHeader
                caption="Standard Across All Rooms"
                heading="What's Included"
                subtext="Every room at Moksh Haveli Inn comes with a thoughtfully curated set of amenities — from split AC to private balconies. Heritage warmth, modern comfort."
                size="heading-sm"
                surface="light"
              />
            </div>
          </div>
        </section>

        {/* Grouped amenity grid — parchment */}
        <section
          ref={gridRef}
          data-section="amenities"
          style={{ backgroundColor: 'var(--color-cream)', padding: '4rem 2.5rem 7.5rem' }}
        >
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div className="amenities-categories">
              {Object.entries(grouped).map(([category, items]) => (
                <div key={category} className="amenity-group">
                  {/* Category label */}
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.75rem',
                    marginBottom: '1.25rem', paddingBottom: '0.75rem',
                    borderBottom: `1px solid ${C.warmStone}`,
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-satoshi)', fontWeight: 500,
                      fontSize: '0.6875rem', textTransform: 'uppercase',
                      letterSpacing: '0.06em', color: 'var(--color-gold)',
                    }}>
                      {category}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-satoshi)', fontWeight: 500,
                      fontSize: '0.6875rem', color: C.chocolate,
                    }}>
                      — {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>

                  {/* Item grid within category */}
                  <div className="amenity-item-grid">
                    {items.map(({ id, name, notes }) => (
                      <div
                        key={id}
                        className="amenity-card"
                        style={{
                          backgroundColor: 'var(--color-cream)',
                          border: `1px solid ${C.warmStone}`,
                          padding: '1.25rem 1.25rem 1.25rem 1rem',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '0.75rem',
                          transition: 'background-color 0.3s ease',
                        }}
                      >
                        <AmenityLucideIcon name={name} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <span style={{
                            fontFamily: 'var(--font-satoshi)', fontWeight: 500,
                            fontSize: '0.8125rem', textTransform: 'uppercase',
                            letterSpacing: '-0.01em', color: C.onyxWarm, lineHeight: 1.2,
                          }}>
                            {name}
                          </span>
                          {notes && (
                            <span style={{
                              fontFamily: 'var(--font-satoshi)', fontWeight: 500,
                              fontSize: '0.6875rem', letterSpacing: '-0.01em',
                              color: C.chocolate, lineHeight: 1.4,
                            }}>
                              {notes}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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

function AmenitiesStyles() {
  return (
    <style>{`
      .amenities-categories {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3.5rem 5rem;
      }
      .amenity-item-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background-color: var(--color-warm-stone);
        border: 1px solid var(--color-warm-stone);
      }
      .amenity-card:hover { background-color: #cbbfaf !important; }

      @media (max-width: 56.25rem) {
        .amenities-categories { grid-template-columns: 1fr; gap: 3rem; }
      }
      @media (max-width: 30rem) {
        .amenity-item-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}
