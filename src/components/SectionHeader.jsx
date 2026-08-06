/**
 * SectionHeader — Amrit Palace design system
 * All font-sizes and spacing in rem. Letter-spacing in em (scales with font-size).
 * surface: 'light' | 'dark'
 */
export default function SectionHeader({
  caption,
  heading,
  subtext,
  size = 'heading',
  surface = 'dark',
  className = '',
}) {
  const isDark = surface === 'dark';

  // Surface-correct color roles from the design system
  const headingColor = isDark ? 'var(--color-parchment)' : '#000000';
  const captionColor = isDark ? 'var(--color-walnut)' : '#000000';
  const subtextColor = isDark ? 'var(--color-linen)' : '#000000';

  const sizeMap = {
    'heading-lg': { fontSize: '4.3125rem', lineHeight: 0.9,  letterSpacing: '-0.04em' },
    'heading':    { fontSize: '4.0625rem', lineHeight: 0.85, letterSpacing: '-0.04em' },
    'heading-sm': { fontSize: '3.125rem',  lineHeight: 0.9,  letterSpacing: '-0.03em' },
    'subheading': { fontSize: '2.625rem',  lineHeight: 1.0,  letterSpacing: '-0.04em' },
  };

  const hStyle = sizeMap[size] || sizeMap['heading'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }} className={className}>
      {caption && (
        <span
          style={{
            fontFamily: 'var(--font-satoshi)',
            fontWeight: 500,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: captionColor,
          }}
        >
          {caption}
        </span>
      )}
      <h2
        style={{
          fontFamily: 'var(--font-tt-ramillas-variable)',
          fontWeight: 300,
          textTransform: 'uppercase',
          color: headingColor,
          ...hStyle,
        }}
      >
        {heading}
      </h2>
      {subtext && (
        <p
          style={{
            fontFamily: 'var(--font-satoshi)',
            fontWeight: 500,
            fontSize: '0.9375rem',
            lineHeight: 1.6,
            letterSpacing: '-0.01em',
            color: subtextColor,
            maxWidth: '32.5rem',
            marginTop: '0.25rem',
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
