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

/**
 * Lucide icon map for amenities — saffron stroke, 20px
 */
function AmenityLucideIcon({ name }) {
  const n = (name || '').toLowerCase();
  const iconStyle = { flexShrink: 0, color: '#d49653' };
  const size = 18;
  const sw   = 1.5;

  if (n.includes('wi-fi') || n.includes('wifi'))   return <Wifi size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('air') || n.includes('ac'))        return <Wind size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('tv') || n.includes('television')) return <Tv size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('balcony'))                        return <Sparkles size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('shower'))                         return <ShowerHead size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('bathroom'))                       return <Droplets size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('towel'))                          return <Shirt size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('water') && n.includes('hot'))     return <Flame size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('water') || n.includes('mineral')) return <Droplets size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('kettle'))                         return <FlaskConical size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('toiletries') || n.includes('soap')) return <FlaskConical size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('peep') || n.includes('security')) return <Eye size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('fridge') || n.includes('refrig')) return <Refrigerator size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('bed'))                            return <BedDouble size={size} strokeWidth={sw} style={iconStyle} />;
  if (n.includes('dining') || n.includes('food'))  return <Utensils size={size} strokeWidth={sw} style={iconStyle} />;
  return <CheckCircle size={size} strokeWidth={sw} style={iconStyle} />;
}

// Category display order
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

  // Group amenities by category, respecting display order
  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = amenities.filter(a => a.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});
  // Append any unlisted categories
  amenities.forEach(a => {
    if (!CATEGORY_ORDER.includes(a.category) && !grouped[a.category]) {
      grouped[a.category] = amenities.filter(x => x.category === a.category);
    }
  });

  return (
    <>
      <Navbar variant="solid" />
      <AmenitiesStyles />

      <main style={{ flex: 1, paddingTop: '4.5rem', backgroundColor: '#292622' }}>

        {/* Dark header */}
        <section style={{ backgroundColor: '#292622', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#978e81',
              display: 'block', marginBottom: '1.5rem',
            }}>
              Every Stay Includes
            </span>
            <h1 style={{
              fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
              fontSize: 'clamp(3.125rem, 6vw, 4.3125rem)', lineHeight: 0.9,
              letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#DEB76A',
              maxWidth: '30rem',
            }}>
              Amenities
            </h1>
          </div>
        </section>

        {/* Hairline */}
        <div style={{ backgroundColor: '#292622' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(216,203,184,0.1)' }} />
          </div>
        </div>

        {/* Intro */}
        <section style={{ padding: '5rem 2.5rem 0', maxWidth: '90rem', margin: '0 auto' }}>
          <div className="amenities-intro">
            <SectionHeader
              caption="Standard Across All Rooms"
              heading="What's Included"
              subtext="Every room at Moksh Haveli Inn comes with a thoughtfully curated set of amenities — from split AC to private balconies. Heritage warmth, modern comfort."
              size="heading-sm"
            />
          </div>
        </section>

        {/* Grouped amenity grid */}
        <section
          ref={gridRef}
          data-section="amenities"
          style={{ padding: '4rem 2.5rem 7.5rem', maxWidth: '90rem', margin: '0 auto' }}
        >
          <div className="amenities-categories">
            {Object.entries(grouped).map(([category, items]) => (
              <div key={category} className="amenity-group">
                {/* Category label */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  marginBottom: '1.25rem',
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid rgba(216,203,184,0.1)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.6875rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: '#d49653',
                  }}>
                    {category}
                  </span>
                  <span style={{
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.6875rem',
                    color: '#b6ab9c',
                  }}>
                    — {items.length} {items.length === 1 ? 'item' : 'items'}
                  </span>
                </div>

                {/* Item grid within category */}
                <div className="amenity-item-grid">
                  {items.map(({ id, name, notes }) => (
                    <div
                      key={id}
                      style={{
                        backgroundColor: '#292622',
                        border: '1px solid rgba(216,203,184,0.1)',
                        padding: '1.25rem 1.25rem 1.25rem 1rem',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '0.75rem',
                        transition: 'background-color 0.3s ease',
                      }}
                      className="amenity-card"
                    >
                      <AmenityLucideIcon name={name} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{
                          fontFamily: 'var(--font-satoshi)',
                          fontWeight: 500,
                          fontSize: '0.8125rem',
                          textTransform: 'uppercase',
                          letterSpacing: '-0.01em',
                          color: '#d8cbb8',
                          lineHeight: 1.2,
                        }}>
                          {name}
                        </span>
                        {notes && (
                          <span style={{
                            fontFamily: 'var(--font-satoshi)',
                            fontWeight: 500,
                            fontSize: '0.6875rem',
                            letterSpacing: '-0.01em',
                            color: '#978e81',
                            lineHeight: 1.4,
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
      /* Category groups: 2-col on large screens */
      .amenities-categories {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3.5rem 5rem;
      }

      /* Item grid within each category */
      .amenity-item-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1px;
        background-color: #b6ab9c;
        border: 1px solid #b6ab9c;
      }

      /* Hover: slight linen tint */
      .amenity-card:hover {
        background-color: #bfb4a3 !important;
      }

      /* Intro layout */
      .amenities-intro {
        max-width: 42rem;
      }

      /* Tablet: single column for category groups */
      @media (max-width: 56.25rem) {
        .amenities-categories {
          grid-template-columns: 1fr;
          gap: 3rem;
        }
        section[style*="padding: 5rem 2.5rem 0"] {
          padding: 3rem 1.5rem 0 !important;
        }
        section[data-section="amenities"] {
          padding: 3rem 1.5rem 5rem !important;
        }
      }

      /* Mobile: item grid also goes 1-col */
      @media (max-width: 30rem) {
        .amenity-item-grid {
          grid-template-columns: 1fr !important;
        }
        section[data-section="amenities"] {
          padding: 2rem 1.25rem 4rem !important;
        }
        section[style*="padding: 5rem 2.5rem 0"] {
          padding: 2.5rem 1.25rem 0 !important;
        }
      }
    `}</style>
  );
}
