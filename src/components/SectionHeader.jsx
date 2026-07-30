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
  surface = 'light',
  className = '',
}) {
  const headingColor = surface === 'dark' ? '#d8cbb8' : '#2c2c2c';
  const captionColor = '#978e81';
  const subtextColor = surface === 'dark' ? '#bfb4a3' : '#615b53';

  // rem sizes + em tracking (scales with font-size — correct behaviour)
  const sizeMap = {
    'heading-lg': { fontSize: '4.3125rem', lineHeight: 0.9,  letterSpacing: '-0.04em' },
    'heading':    { fontSize: '4.0625rem', lineHeight: 0.85, letterSpacing: '-0.04em' },
    'heading-sm': { fontSize: '3.125rem',  lineHeight: 0.9,  letterSpacing: '-0.03em' },
    'subheading': { fontSize: '2.625rem',  lineHeight: 1.0,  letterSpacing: '-0.04em' },
  };

  const hStyle = sizeMap[size] || sizeMap['heading'];

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {caption && (
        <span
          style={{
            fontFamily: 'var(--font-satoshi)',
            fontWeight: 500,
            fontSize: '0.75rem',         /* 12px */
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
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
            fontSize: '0.9375rem',       /* 15px */
            lineHeight: 1.4,
            letterSpacing: '-0.01em',
            color: subtextColor,
            maxWidth: '32.5rem',         /* 520px */
          }}
        >
          {subtext}
        </p>
      )}
    </div>
  );
}
