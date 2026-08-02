'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import Lightbox from '@/components/Lightbox';
import { getGallery, getSiteConfig } from '@/lib/api';

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
                id={`gallery-filter-${cat.toLowerCase()}`}
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

        {/* Masonry grid — CSS columns */}
        <section style={{ padding: '3rem 2.5rem 7.5rem' }}>
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
                    style={{ cursor: 'zoom-in', breakInside: 'avoid', marginBottom: '1px', position: 'relative', overflow: 'hidden' }}
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.caption || item.category}
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
            ) : (
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

      {/* Lightbox */}
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
      /* Masonry via CSS columns */
      .gallery-masonry {
        columns: 3;
        column-gap: 1px;
        background-color: #b6ab9c;
      }

      .gallery-item {
        display: block;
        break-inside: avoid;
        position: relative;
        overflow: hidden;
      }

      /* Hover overlay */
      .gallery-hover-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(transparent 45%, rgba(41,38,34,0.75));
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        padding: 1.25rem;
        opacity: 0;
        transition: opacity 0.4s ease;
      }
      .gallery-item:hover .gallery-hover-overlay {
        opacity: 1;
      }
      .gallery-item:hover .gallery-img {
        transform: scale(1.04);
      }

      /* Tablet: 2 columns */
      @media (max-width: 56.25rem) {
        .gallery-masonry { columns: 2; }
      }

      /* Mobile: 1 column */
      @media (max-width: 30rem) {
        .gallery-masonry { columns: 1; }
        section[style*="padding: 3rem 2.5rem"] {
          padding: 2rem 1.25rem 5rem !important;
        }
      }

      /* Filter tab row: tighter on mobile */
      @media (max-width: 30rem) {
        div[style*="padding: 2rem 2.5rem 0"] {
          padding: 1.5rem 1.25rem 0 !important;
        }
      }
    `}</style>
  );
}
