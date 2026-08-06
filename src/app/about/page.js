'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapEmbed from '@/components/MapEmbed';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import SectionHeader from '@/components/SectionHeader';
import { getSiteConfig } from '@/lib/api';

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
      const { revealSection } = await import('@/lib/animations/scroll');
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

      <main style={{ flex: 1, paddingTop: '4rem' }}>

        {/* Dark header */}
        <section style={{ backgroundColor: 'var(--color-cream)', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.06em', color: C.chocolate,
              display: 'block', marginBottom: '1.5rem',
            }}>
              Our Story
            </span>
            <h1 style={{
              fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
              fontSize: 'clamp(3.125rem, 6vw, 4.3125rem)', lineHeight: 0.9,
              letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--color-chocolate)',
              maxWidth: '36rem', marginBottom: '1rem',
            }}>
              About Moksh Haveli Inn
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

        {/* About text — parchment editorial layout */}
        <section
          ref={storyRef}
          data-section="about"
          style={{ backgroundColor: 'var(--color-cream)', padding: '7.5rem 2.5rem' }}
        >
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div className="about-grid">
              {/* Left — heading */}
              <div>
                <SectionHeader
                  caption="Heritage · Varanasi"
                  heading="A Place Worth Returning To"
                  size="heading-sm"
                  surface="light"
                />
              </div>

              {/* Right — story text */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {paragraphs.length > 0 ? paragraphs.map((para, i) => (
                  <p key={i} style={{
                    fontFamily: 'var(--font-satoshi)', fontWeight: 500,
                    fontSize: '0.9375rem', lineHeight: 1.8,
                    letterSpacing: '-0.01em', color: C.chocolate,
                  }}>
                    {para}
                  </p>
                )) : (
                  /* Fallback copy if CMS is empty */
                  [
                    'Moksh Haveli Inn is a heritage boutique guest house nestled in the spiritual heart of Varanasi — steps from the sacred ghats of the Ganges.',
                    'We blend centuries-old haveli architecture with modern comfort: split AC, private balconies with city views, and attentive warm service that makes every guest feel at home.',
                    'Whether you are a pilgrim, a traveller, or simply seeking stillness, Moksh Haveli offers a sanctuary where the ancient city meets quiet hospitality.',
                  ].map((para, i) => (
                    <p key={i} style={{
                      fontFamily: 'var(--font-satoshi)', fontWeight: 500,
                      fontSize: '0.9375rem', lineHeight: 1.8,
                      letterSpacing: '-0.01em', color: C.chocolate,
                    }}>
                      {para}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Divider */}
        <div style={{ backgroundColor: 'var(--color-cream-deep)' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '0 2.5rem' }}>
            <hr style={{ border: 'none', borderTop: `1px solid ${C.chocolate}` }} />
          </div>
        </div>

        {/* Map — dark */}
        <section
          ref={mapRef}
          data-section="map"
          style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}
        >
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <SectionHeader
              caption="Find Us"
              heading="Location"
              subtext={siteConfig?.address || 'Near Assi Ghat, Varanasi, Uttar Pradesh — 221001'}
              size="heading-sm"
              surface="light"
            />
            <div style={{ marginTop: '3rem' }}>
              <MapEmbed mapEmbedUrl={siteConfig?.mapEmbedUrl} height="32rem" />
            </div>
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
      .about-grid {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 5rem;
        align-items: start;
      }
      @media (max-width: 56.25rem) {
        .about-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
      }
    `}</style>
  );
}
