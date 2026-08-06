'use client';

import { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Lightbox — full-screen image viewer
 *
 * Design system: var(--color-white-overlay) overlay, 0px radius, no box-shadow, hairline borders.
 * Lucide icons for prev/next/close (strokeWidth 1.5, size 20).
 *
 * @param {{
 *   images: Array<{ imageUrl: string, caption: string, category: string }>,
 *   initialIndex: number,
 *   currentIndex: number,
 *   onClose: () => void,
 *   onPrev: () => void,
 *   onNext: () => void,
 * }} props
 */
export default function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  const image = images[currentIndex];

  // Keyboard navigation
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape')     onClose();
    if (e.key === 'ArrowLeft')  onPrev();
    if (e.key === 'ArrowRight') onNext();
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  if (!image) return null;

  return (
    <div
      id="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Image viewer"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        backgroundColor: 'rgba(41,38,34,0.97)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
      }}
    >
      {/* Close button — top right */}
      <button
        id="lightbox-close"
        onClick={onClose}
        aria-label="Close lightbox"
        style={{
          position: 'absolute',
          top: '1.25rem',
          right: '1.25rem',
          background: 'none',
          border: '1px solid rgba(216,203,184,0.2)',
          borderRadius: '0.1875rem',
          color: 'var(--color-white-overlay)',
          cursor: 'pointer',
          padding: '0.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'border-color 0.3s ease',
          zIndex: 2,
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(216,203,184,0.5)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(216,203,184,0.2)'}
      >
        <X size={18} strokeWidth={1.5} />
      </button>

      {/* Counter */}
      <div
        style={{
          position: 'absolute',
          top: '1.375rem',
          left: '1.5rem',
          fontFamily: 'var(--font-satoshi)',
          fontWeight: 500,
          fontSize: '0.6875rem',
          textTransform: 'uppercase',
          letterSpacing: '-0.01em',
          color: '#FFFFFF',
          zIndex: 2,
        }}
      >
        {currentIndex + 1} / {images.length}
      </div>

      {/* Image container — click inside doesn't close */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '90vw',
          height: '75vh',
          maxWidth: '72rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Image
          key={currentIndex}
          src={image.imageUrl}
          alt={image.caption || image.category}
          fill
          sizes="90vw"
          style={{
            objectFit: 'contain',
            display: 'block',
            borderRadius: 0,
            animation: 'lightbox-fade 0.25s ease',
          }}
        />

        {/* Prev arrow */}
        {images.length > 1 && (
          <button
            id="lightbox-prev"
            onClick={onPrev}
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: '-3.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: '1px solid rgba(216,203,184,0.2)',
              borderRadius: '0.1875rem',
              color: 'var(--color-white-overlay)',
              cursor: 'pointer',
              padding: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(216,203,184,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(216,203,184,0.2)'}
          >
            <ChevronLeft size={20} strokeWidth={1.5} />
          </button>
        )}

        {/* Next arrow */}
        {images.length > 1 && (
          <button
            id="lightbox-next"
            onClick={onNext}
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: '-3.5rem',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none',
              border: '1px solid rgba(216,203,184,0.2)',
              borderRadius: '0.1875rem',
              color: 'var(--color-white-overlay)',
              cursor: 'pointer',
              padding: '0.625rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'border-color 0.3s ease',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(216,203,184,0.5)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(216,203,184,0.2)'}
          >
            <ChevronRight size={20} strokeWidth={1.5} />
          </button>
        )}
      </div>

      {/* Caption bar — bottom */}
      {(image.caption || image.category) && (
        <div
          onClick={e => e.stopPropagation()}
          style={{
            marginTop: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {image.caption && (
            <span
              style={{
                fontFamily: 'var(--font-tt-ramillas-variable)',
                fontWeight: 300,
                fontStyle: 'italic',
                fontSize: '1.0625rem',
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
                lineHeight: 1.3,
                textAlign: 'center',
              }}
            >
              {image.caption}
            </span>
          )}
          {image.category && (
            <span
              style={{
                fontFamily: 'var(--font-satoshi)',
                fontWeight: 500,
                fontSize: '0.6875rem',
                textTransform: 'uppercase',
                letterSpacing: '-0.01em',
                color: 'rgba(255,255,255,0.8)',
              }}
            >
              {image.category}
            </span>
          )}
        </div>
      )}

      {/* Fade animation */}
      <style>{`
        @keyframes lightbox-fade {
          from { opacity: 0; transform: scale(0.98); }
          to   { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
