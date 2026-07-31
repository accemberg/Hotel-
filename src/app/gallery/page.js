'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getGallery, getSiteConfig } from '@/lib/api';

const CATEGORIES = ['All', 'Property', 'Rooms', 'Ghats', 'Dining'];

export default function GalleryPage() {
  const [gallery,    setGallery]    = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [activeTab,  setActiveTab]  = useState('All');
  const [siteConfig, setSiteConfig] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    Promise.all([getGallery(), getSiteConfig()]).then(([g, s]) => {
      setGallery(g);
      setFiltered(g);
      setSiteConfig(s);
    });
  }, []);

  useEffect(() => {
    setFiltered(activeTab === 'All' ? gallery : gallery.filter(i => i.category === activeTab));
  }, [activeTab, gallery]);

  useEffect(() => {
    if (!filtered.length || !gridRef.current) return;
    let isMounted = true;
    async function animate() {
      const { revealSection } = await import('@/lib/animations/scroll');
      if (!isMounted || !gridRef.current) return;
      revealSection(gridRef.current, { start: 'top 90%' });
    }
    animate();
    return () => { isMounted = false; };
  }, [filtered.length]);

  return (
    <>
      <Navbar variant="solid" />

      <main style={{ flex: 1, paddingTop: '4.5rem', backgroundColor: '#d8cbb8' }}>

        {/* Dark header */}
        <section style={{ backgroundColor: '#292622', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#978e81',
              display: 'block', marginBottom: '1.5rem',
            }}>
              Visual Archive
            </span>
            <h1 style={{
              fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
              fontSize: 'clamp(3.125rem, 6vw, 4.3125rem)', lineHeight: 0.9,
              letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#d8cbb8',
            }}>
              Gallery
            </h1>
          </div>
        </section>

        {/* Hairline */}
        <div style={{ backgroundColor: '#d8cbb8' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid #b6ab9c' }} />
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ backgroundColor: '#d8cbb8', padding: '2rem 2.5rem 0' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                style={{
                  padding: '0.375rem 0.875rem',
                  border: `1px solid ${activeTab === cat ? '#2c2c2c' : '#b6ab9c'}`,
                  borderRadius: '0.1875rem',
                  background: activeTab === cat ? '#2c2c2c' : 'transparent',
                  color: activeTab === cat ? '#d8cbb8' : '#615b53',
                  fontFamily: 'var(--font-satoshi)',
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.01em',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid */}
        <section style={{ padding: '3rem 2.5rem 7.5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div
              ref={gridRef}
              data-section="gallery"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1px',
                backgroundColor: '#b6ab9c',
              }}
            >
              {filtered.map((item, i) => (
                <div
                  key={item.id}
                  style={{
                    aspectRatio: i % 7 === 0 ? '2/1' : '4/3',
                    gridColumn: i % 7 === 0 ? 'span 2' : 'span 1',
                    overflow: 'hidden',
                    position: 'relative',
                  }}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.caption || item.category}
                    style={{
                      width: '100%',
                      height: '100%',
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
                      inset: 0,
                      background: 'linear-gradient(transparent 50%, rgba(41,38,34,0.7))',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-end',
                      padding: '1.25rem',
                      opacity: 0,
                      transition: 'opacity 0.4s ease',
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '0'}
                  >
                    <span style={{
                      fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                      textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#d8cbb8',
                      display: 'block', marginBottom: '0.25rem',
                    }}>
                      {item.caption}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.6875rem',
                      textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#978e81',
                    }}>
                      {item.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <p style={{
                fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.9375rem',
                color: '#978e81', textAlign: 'center', padding: '4rem 0',
              }}>
                No images in this category.
              </p>
            )}
          </div>
        </section>

      </main>

      <Footer />
      {siteConfig && <WhatsAppFloat siteConfig={siteConfig} />}
    </>
  );
}
