'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapEmbed from '@/components/MapEmbed';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SectionHeader from '@/components/SectionHeader';
import { getSiteConfig } from '@/lib/api';

export default function AboutPage() {
  const [siteConfig, setSiteConfig] = useState(null);
  const storyRef = useRef(null);
  const mapRef   = useRef(null);

  useEffect(() => {
    getSiteConfig().then(setSiteConfig);
  }, []);

  useEffect(() => {
    if (!siteConfig) return;
    let isMounted = true;
    async function animate() {
      const { revealHeadline, revealSection } = await import('@/lib/animations/scroll');
      if (!isMounted) return;
      if (storyRef.current) revealSection(storyRef.current);
      if (mapRef.current)   revealSection(mapRef.current, { start: 'top 85%' });
    }
    animate();
    return () => { isMounted = false; };
  }, [siteConfig]);

  const paragraphs = siteConfig?.aboutText?.split('\n\n').filter(Boolean) || [];

  return (
    <>
      <Navbar variant="solid" />
      <AboutStyles />

      <main style={{ flex: 1, paddingTop: '4.5rem', backgroundColor: '#292622' }}>

        {/* Dark header */}
        <section style={{ backgroundColor: '#292622', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#978e81',
              display: 'block', marginBottom: '1.5rem',
            }}>
              Our Story
            </span>
            <h1 style={{
              fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
              fontSize: 'clamp(3.125rem, 6vw, 4.3125rem)', lineHeight: 0.9,
              letterSpacing: '-0.04em', textTransform: 'uppercase', color: '#DEB76A',
              maxWidth: '36rem',
            }}>
              About Moksh Haveli Inn
            </h1>
          </div>
        </section>

        {/* Hairline */}
        <div style={{ backgroundColor: '#292622' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: '1px solid rgba(216,203,184,0.1)' }} />
          </div>
        </div>

        {/* About text — editorial two-column layout */}
        <section
          ref={storyRef}
          data-section="about"
          style={{ padding: '7.5rem 2.5rem', maxWidth: '90rem', margin: '0 auto' }}
        >
          <div
            className="about-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '5rem',
              alignItems: 'start',
            }}
          >
            {/* Left — section heading */}
            <div>
              <SectionHeader
                caption="Heritage · Varanasi"
                heading="A Place Worth Returning To"
                size="heading-sm"
              />
            </div>

            {/* Right — story text */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {paragraphs.map((para, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.9375rem',
                    lineHeight: 1.75,
                    letterSpacing: '-0.01em',
                    color: '#bfb4a3',
                  }}
                >
                  {para}
                </p>
              ))}
            </div>
          </div>
        </section>

        {/* Hairline */}
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
          <hr style={{ border: 'none', borderTop: '1px solid rgba(216,203,184,0.1)' }} />
        </div>

        {/* Map */}
        <section
          ref={mapRef}
          data-section="map"
          style={{ padding: '7.5rem 2.5rem', maxWidth: '90rem', margin: '0 auto' }}
        >
          <SectionHeader
            caption="Find Us"
            heading="Location"
            subtext={siteConfig?.address}
            size="heading-sm"
          />
          <div style={{ marginTop: '3rem' }}>
            <MapEmbed mapEmbedUrl={siteConfig?.mapEmbedUrl} height="32rem" />
          </div>
        </section>

      </main>

      <Footer />
      {siteConfig && <WhatsAppFloat siteConfig={siteConfig} />}
    </>
  );
}

function AboutStyles() {
  return (
    <style>{`
      /* Tablet: stack 2-col about grid */
      @media (max-width: 56.25rem) {
        .about-grid {
          grid-template-columns: 1fr !important;
          gap: 2.5rem !important;
        }
        section[data-section="about"] {
          padding: 4rem 1.5rem !important;
        }
        section[data-section="map"] {
          padding: 4rem 1.5rem !important;
        }
      }
      /* Mobile */
      @media (max-width: 30rem) {
        section[data-section="about"] {
          padding: 3rem 1.25rem !important;
        }
        section[data-section="map"] {
          padding: 3rem 1.25rem !important;
        }
        section[style*="padding: 6rem"] {
          padding: 4rem 1.25rem 3rem !important;
        }
      }
    `}</style>
  );
}
