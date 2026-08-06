'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Lightbox from '@/components/Lightbox';
import { getGallery, getSiteConfig } from '@/lib/api';

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

const CATEGORIES = ['All', 'Property', 'Rooms', 'Ghats', 'Dining'];

export default function GalleryPage() {
  const [gallery,    setGallery]    = useState([]);
  const [filtered,   setFiltered]   = useState([]);
  const [activeTab,  setActiveTab]  = useState('All');
  const [siteConfig, setSiteConfig] = useState(null);
  const [lightbox,   setLightbox]   = useState({ open: false, index: 0 });
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

  const openLightbox  = (index) => setLightbox({ open: true, index });
  const closeLightbox = ()      => setLightbox({ open: false, index: 0 });
  const prevImage = () => setLightbox(l => ({ ...l, index: (l.index - 1 + filtered.length) % filtered.length }));
  const nextImage = () => setLightbox(l => ({ ...l, index: (l.index + 1) % filtered.length }));

  return (
    <>
      <Navbar variant="solid" />
      <GalleryStyles />

      <main style={{ flex: 1, paddingTop: '4rem', backgroundColor: 'var(--color-cream)' }}>

        {/* Dark header */}
        <section style={{ backgroundColor: 'var(--color-cream)', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.06em', color: C.chocolate,
              display: 'block', marginBottom: '1.5rem',
            }}>
              Visual Archive
            </span>
            <h1 style={{
              fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
              fontSize: 'clamp(3.125rem, 6vw, 4.3125rem)', lineHeight: 0.9,
              letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--color-chocolate)',
              marginBottom: '1rem',
            }}>
              Gallery
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

        {/* Filter tabs — onyx-warm */}
        <div style={{ backgroundColor: 'var(--color-cream-deep)', padding: '2rem 2.5rem 0' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => {
              const isActive = activeTab === cat;
              return (
                <button
                  key={cat}
                  id={`gallery-filter-${cat.toLowerCase()}`}
                  onClick={() => setActiveTab(cat)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    border: `1px solid ${isActive ? C.saffron : 'rgba(216,203,184,0.25)'}`,
                    borderRadius: '0.1875rem',
                    background: isActive ? C.saffron : 'transparent',
                    color: isActive ? C.midnightRoast : C.linen,
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Masonry grid — onyx-warm bg */}
        <section style={{ backgroundColor: 'var(--color-cream-deep)', padding: '3rem 2.5rem 7.5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            {filtered.length > 0 ? (
              <div
                ref={gridRef}
                data-section="gallery"
                className="gallery-masonry"
              >
                {filtered.map((item, i) => (
                  <div
                    key={item.id}
                    className="gallery-item"
                    onClick={() => openLightbox(i)}
                    style={{ cursor: 'zoom-in', breakInside: 'avoid', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.caption || item.category}
                      loading="lazy"
                      decoding="async"
                      style={{
                        width: '100%',
                        height: 'auto',
                        display: 'block',
                        borderRadius: 0,
                        transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      }}
                      className="gallery-img"
                    />
                    {/* Hover overlay */}
                    <div className="gallery-hover-overlay">
                      <span style={{
                        fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                        textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF',
                        display: 'block', marginBottom: '0.25rem',
                      }}>
                        {item.caption}
                      </span>
                      <span style={{
                        fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.6875rem',
                        textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#FFFFFF',
                      }}>
                        {item.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{
                fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.9375rem',
                color: C.chocolate, textAlign: 'center', padding: '4rem 0',
              }}>
                No images in this category.
              </p>
            )}
          </div>
        </section>

      </main>

      {lightbox.open && (
        <Lightbox
          images={filtered}
          currentIndex={lightbox.index}
          onClose={closeLightbox}
          onPrev={prevImage}
          onNext={nextImage}
        />
      )}

      <Footer />
      {siteConfig && <WhatsAppFloat siteConfig={siteConfig} />}
    </>
  );
}

function GalleryStyles() {
  return (
    <style>{`
      .gallery-masonry {
        columns: 3;
        column-gap: 1.25rem;
      }
      .gallery-item {
        display: block;
        break-inside: avoid;
        position: relative;
        overflow: hidden;
        margin-bottom: 1.25rem;
      }
      .gallery-hover-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(transparent 45%, rgba(41,38,34,0.85));
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1.25rem;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .gallery-item:hover .gallery-hover-overlay { opacity: 1; }
      .gallery-item:hover .gallery-img { transform: scale(1.04); }

      @media (max-width: 56.25rem) { .gallery-masonry { columns: 2; } }
      @media (max-width: 30rem)    { .gallery-masonry { columns: 1; } }
    `}</style>
  );
}
