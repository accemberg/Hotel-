'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppFloat from '@/components/WhatsAppFloat';
import { getRoomBySlug, getSiteConfig } from '@/lib/api';
import { Maximize2, Users, Star, ChevronLeft } from 'lucide-react';

export default function RoomDetailPage() {
  const { slug }    = useParams();
  const [room,        setRoom]        = useState(null);
  const [siteConfig,  setSiteConfig]  = useState(null);
  const [activeImg,   setActiveImg]   = useState(0);
  const [notFound,    setNotFound]    = useState(false);

  const titleRef    = useRef(null);
  const detailRef   = useRef(null);

  useEffect(() => {
    if (!slug) return;
    Promise.all([getRoomBySlug(slug), getSiteConfig()]).then(([r, s]) => {
      if (!r) { setNotFound(true); return; }
      setRoom(r);
      setSiteConfig(s);
    });
  }, [slug]);

  useEffect(() => {
    if (!room) return;
    let isMounted = true;
    async function animate() {
      const { revealHeadline, revealSection } = await import('@/lib/animations/scroll');
      if (!isMounted) return;
      if (titleRef.current)  revealHeadline(titleRef.current);
      if (detailRef.current) revealSection(detailRef.current);
    }
    animate();
    return () => { isMounted = false; };
  }, [room]);

  if (notFound) {
    return (
      <>
        <Navbar variant="solid" />
        <main style={{ flex: 1, paddingTop: '4.5rem', backgroundColor: '#292622', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300, fontSize: '3.125rem', textTransform: 'uppercase', color: '#DEB76A', marginBottom: '1rem' }}>Room not found</h1>
            <Link href="/rooms" style={{ color: '#bfb4a3', fontFamily: 'var(--font-satoshi)', fontSize: '0.8125rem', textTransform: 'uppercase' }}>← All Rooms</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!room) {
    return (
      <>
        <Navbar variant="solid" />
        <main style={{ flex: 1, paddingTop: '4.5rem', backgroundColor: '#292622', minHeight: '60vh' }} />
        <Footer />
      </>
    );
  }

  const buildEnquireUrl = () => {
    const num = siteConfig?.whatsappNumber || '919000000000';
    const msg = `Hi! I'd like to enquire about the ${room.name} at Moksh Haveli Inn. Please share availability and rates.`;
    return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  };

  return (
    <>
      <Navbar variant="solid" />

      <main style={{ flex: 1, paddingTop: '4.5rem', backgroundColor: '#292622' }}>

        {/* Back nav */}
        <div style={{ maxWidth: '90rem', margin: '0 auto', padding: '2rem 2.5rem 0' }}>
          <Link
            href="/rooms"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              fontFamily: 'var(--font-satoshi)',
              fontWeight: 500,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '-0.01em',
              color: '#978e81',
              textDecoration: 'none',
            }}
          >
            <ChevronLeft size={12} strokeWidth={1.5} /> All Rooms
          </Link>
        </div>

        {/* Hero image gallery */}
        <section style={{ padding: '2rem 2.5rem 0', maxWidth: '90rem', margin: '0 auto' }}>
          {/* Main image */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/7', overflow: 'hidden', border: '1px solid rgba(216,203,184,0.1)', borderRadius: 0 }}>
            <Image
              src={room.images?.[activeImg] || `https://placehold.co/1400x600/bfb4a3/615b53?text=${encodeURIComponent(room.name)}`}
              alt={room.name}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 100vw"
              style={{ objectFit: 'cover', display: 'block' }}
            />
          </div>
          {/* Thumbnails */}
          {room.images?.length > 1 && (
            <div style={{ display: 'flex', gap: '1px', marginTop: '1px', backgroundColor: 'rgba(216,203,184,0.1)' }}>
              {room.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  style={{
                    flex: 1,
                    position: 'relative',
                    aspectRatio: '4/3',
                    border: 'none',
                    borderBottom: i === activeImg ? '2px solid #d49653' : '2px solid transparent',
                    padding: 0,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    transition: 'opacity 0.3s ease',
                    opacity: i === activeImg ? 1 : 0.6,
                  }}
                >
                  <Image src={img} alt="" fill sizes="(max-width: 768px) 33vw, 20vw" style={{ objectFit: 'cover', display: 'block' }} />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Content */}
        <section style={{ maxWidth: '90rem', margin: '0 auto', padding: '4rem 2.5rem 7.5rem' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr clamp(18rem, 30%, 24rem)',
              gap: '5rem',
              alignItems: 'start',
            }}
          >
            {/* Left — room info */}
            <div>
              <span style={{
                fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#978e81',
                display: 'block', marginBottom: '1rem',
              }}>
                Moksh Haveli Inn · Varanasi
              </span>
              <h1
                ref={titleRef}
                data-headline
                style={{
                  fontFamily: 'var(--font-tt-ramillas-variable)',
                  fontWeight: 300,
                  fontSize: 'clamp(2.625rem, 5vw, 4.0625rem)',
                  lineHeight: 0.9,
                  letterSpacing: '-0.04em',
                  textTransform: 'uppercase',
                  color: '#DEB76A',
                  marginBottom: '2rem',
                }}
              >
                {room.name}
              </h1>

              {/* Hairline divider */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(216,203,184,0.1)', marginBottom: '2rem' }} />

              {/* Meta */}
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                {room.size && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Maximize2 size={14} strokeWidth={1.5} color="#978e81" />
                    <span style={{ fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#bfb4a3' }}>{room.size}</span>
                  </div>
                )}
                {room.maxOccupancy && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Users size={14} strokeWidth={1.5} color="#978e81" />
                    <span style={{ fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#bfb4a3' }}>Max {room.maxOccupancy} guests</span>
                  </div>
                )}
                {room.beds && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Star size={14} strokeWidth={1.5} color="#d49653" />
                    <span style={{ fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.8125rem', textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#bfb4a3' }}>{room.beds}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <p style={{
                fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.9375rem',
                lineHeight: 1.7, letterSpacing: '-0.01em', color: '#bfb4a3',
                maxWidth: '36rem', marginBottom: '3rem',
              }}>
                {room.description}
              </p>

              {/* Hairline divider */}
              <div style={{ width: '100%', height: '1px', backgroundColor: 'rgba(216,203,184,0.1)', marginBottom: '2.5rem' }} />

              {/* Amenities */}
              <div ref={detailRef} data-section="amenities">
                <p style={{
                  fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#978e81',
                  marginBottom: '1.25rem',
                }}>
                  Room Amenities
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(11rem, 1fr))', gap: '1px', backgroundColor: 'rgba(216,203,184,0.1)' }}>
                  {(room.amenities || []).map(amenity => (
                    <div key={amenity} style={{ backgroundColor: '#292622', padding: '0.875rem 1rem' }}>
                      <span style={{
                        fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                        textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#d8cbb8',
                      }}>
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — pricing + enquiry */}
            <div style={{
              position: 'sticky',
              top: '5.5rem',
              border: '1px solid rgba(216,203,184,0.1)',
              borderRadius: 0,
              overflow: 'hidden',
            }}>
              <div style={{ backgroundColor: '#292622', padding: '1.75rem' }}>
                <p style={{
                  fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                  textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#978e81',
                  marginBottom: '0.5rem',
                }}>
                  Starting from
                </p>
                <p style={{
                  fontFamily: 'var(--font-tt-ramillas-variable)', fontWeight: 300,
                  fontSize: '2.625rem', lineHeight: 1, letterSpacing: '-0.04em',
                  color: '#DEB76A',
                }}>
                  ₹{room.rate?.toLocaleString('en-IN')}
                  <span style={{ fontFamily: 'var(--font-satoshi)', fontSize: '0.8125rem', fontWeight: 500, color: '#978e81', letterSpacing: '-0.01em' }}> /night</span>
                </p>
              </div>

              <div style={{ backgroundColor: '#292622', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <a
                  href={buildEnquireUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    width: '100%',
                    padding: '1rem',
                    border: '1px solid #d8cbb8',
                    borderRadius: '0.1875rem',
                    background: '#2c2c2c',
                    color: '#d8cbb8',
                    fontFamily: 'var(--font-satoshi)',
                    fontWeight: 500,
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    letterSpacing: '-0.01em',
                    textDecoration: 'none',
                    textAlign: 'center',
                    transition: 'opacity 0.4s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                  Enquire via WhatsApp
                </a>
                <p style={{
                  fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.75rem',
                  letterSpacing: '-0.01em', color: '#978e81', textAlign: 'center',
                }}>
                  We'll respond within a few hours
                </p>

                <div style={{ borderTop: '1px solid rgba(216,203,184,0.1)', paddingTop: '1rem', marginTop: '0.25rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-satoshi)', fontWeight: 500, fontSize: '0.6875rem',
                    textTransform: 'uppercase', letterSpacing: '-0.01em', color: '#978e81',
                    marginBottom: '0.75rem',
                  }}>
                    Also available on
                  </p>
                  <a
                    href="https://www.makemytrip.com/hotels/moksh_haveli_inn-details-varanasi.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'block',
                      padding: '0.625rem 1rem',
                      border: '1px solid rgba(216,203,184,0.1)',
                      borderRadius: '0.1875rem',
                      textAlign: 'center',
                      fontFamily: 'var(--font-satoshi)',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '-0.01em',
                      color: '#bfb4a3',
                      textDecoration: 'none',
                      transition: 'border-color 0.3s ease, color 0.3s ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#615b53'; e.currentTarget.style.color = '#2c2c2c'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#b6ab9c'; e.currentTarget.style.color = '#615b53'; }}
                  >
                    MakeMyTrip
                  </a>
                </div>
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
