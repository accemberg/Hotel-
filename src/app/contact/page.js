'use client';

import { useEffect, useRef, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import MapEmbed from '@/components/MapEmbed';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getSiteConfig } from '@/lib/api';
import { Mail, Phone, MapPin, MessageCircle } from 'lucide-react';

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

export default function ContactPage() {
  const [siteConfig, setSiteConfig] = useState(null);
  const contentRef = useRef(null);

  useEffect(() => {
    getSiteConfig().then(setSiteConfig);
  }, []);

  useEffect(() => {
    if (!siteConfig) return;
    let isMounted = true;
    async function animate() {
      const { revealSection } = await import('@/lib/animations/scroll');
      if (!isMounted) return;
      if (contentRef.current) revealSection(contentRef.current, { start: 'top 88%' });
    }
    animate();
    return () => { isMounted = false; };
  }, [siteConfig]);

  const buildWhatsAppUrl = () => {
    if (!siteConfig?.whatsappNumber) return '#';
    return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappDefaultMessage || '')}`;
  };

  return (
    <>
      <Navbar variant="solid" />
      <ContactStyles />

      <main style={{ flex: 1, paddingTop: '4rem' }}>

        {/* Dark header */}
        <section style={{ backgroundColor: 'var(--color-cream)', padding: '6rem 2.5rem 5rem' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <span style={{
              fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
              textTransform: 'uppercase', letterSpacing: '0.06em', color: C.chocolate,
              display: 'block', marginBottom: '1.5rem',
            }}>
              Reach Out
            </span>
            <h1 style={{
              fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
              fontSize: 'clamp(3.125rem, 6vw, 4.3125rem)', lineHeight: 0.9,
              letterSpacing: '-0.04em', textTransform: 'uppercase', color: 'var(--color-chocolate)',
              marginBottom: '1rem',
            }}>
              Contact Us
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

        {/* Contact content — parchment */}
        <section
          ref={contentRef}
          data-section="contact"
          style={{ backgroundColor: 'var(--color-cream)', padding: '7.5rem 2.5rem' }}
        >
          <div style={{ maxWidth: '90rem', margin: '0 auto' }}>
            <div className="contact-grid">

              {/* Left — contact info */}
              <div>
                <span style={{
                  fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '0.06em', color: C.chocolate,
                  display: 'block', marginBottom: '1.5rem',
                }}>
                  Get in touch
                </span>
                <h2 style={{
                  fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
                  fontSize: '3.125rem', lineHeight: 0.9, letterSpacing: '-0.04em',
                  textTransform: 'uppercase', color: C.onyxWarm, marginBottom: '3rem',
                }}>
                  We'd Love to<br />Hear from You
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                  {/* Address */}
                  {siteConfig?.address && (
                    <ContactRow icon={<MapPin size={14} strokeWidth={1.5} />} label="Address">
                      {siteConfig.address}
                    </ContactRow>
                  )}

                  {/* Phone */}
                  {siteConfig?.phone && (
                    <ContactRow icon={<Phone size={14} strokeWidth={1.5} />} label="Phone">
                      <a href={`tel:${siteConfig.phone}`} style={{ color: C.onyxWarm, textDecoration: 'none' }}>
                        {siteConfig.phone}
                      </a>
                    </ContactRow>
                  )}

                  {/* Email */}
                  {siteConfig?.email && (
                    <ContactRow icon={<Mail size={14} strokeWidth={1.5} />} label="Email">
                      <a href={`mailto:${siteConfig.email}`} style={{ color: C.onyxWarm, textDecoration: 'none' }}>
                        {siteConfig.email}
                      </a>
                    </ContactRow>
                  )}

                  {/* WhatsApp CTA */}
                  <div style={{ paddingTop: '1rem', borderTop: `1px solid ${C.warmStone}` }}>
                    <a
                      href={buildWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.875rem 1.75rem',
                        border: `1px solid var(--color-gold)`,
                        borderRadius: '0.1875rem',
                        background: C.saffron,
                        color: C.midnightRoast,
                        fontFamily: 'var(--font-satoshi)',
                        fontWeight: 500,
                        fontSize: '0.8125rem',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                        textDecoration: 'none',
                        transition: 'background 0.3s ease, border-color 0.3s ease',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = C.parchment; e.currentTarget.style.borderColor = C.onyxWarm; }}
                      onMouseLeave={e => { e.currentTarget.style.background = C.saffron; e.currentTarget.style.borderColor = C.saffron; }}
                    >
                      <MessageCircle size={14} strokeWidth={1.5} />
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>

              {/* Right — Map */}
              <div>
                <MapEmbed mapEmbedUrl={siteConfig?.mapEmbedUrl} height="32rem" />
                <p style={{
                  fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '-0.01em', color: C.chocolate,
                  marginTop: '1rem',
                }}>
                  Near Assi Ghat, Varanasi — accessible by auto-rickshaw from the railway station
                </p>
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

function ContactStyles() {
  return (
    <style>{`
      .contact-grid {
        display: grid;
        grid-template-columns: 1fr 1.5fr;
        gap: 5rem;
        align-items: start;
      }
      @media (max-width: 56.25rem) {
        .contact-grid { grid-template-columns: 1fr !important; gap: 3rem !important; }
      }
    `}</style>
  );
}

function ContactRow({ icon, label, children }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{ color: 'var(--color-gold)', paddingTop: '0.125rem', flexShrink: 0 }}>{icon}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        <span style={{
          fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.6875rem',
          textTransform: 'uppercase', letterSpacing: '0.06em', color: C.chocolate,
        }}>
          {label}
        </span>
        <span style={{
          fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.9375rem',
          lineHeight: 1.6, letterSpacing: '-0.01em', color: C.onyxWarm,
        }}>
          {children}
        </span>
      </div>
    </div>
  );
}

