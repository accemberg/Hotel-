/**
 * Card — Amrit Palace design system
 * Sharp 0 border-radius, no shadow, optional 1px hairline border.
 * All spacing in rem.
 */
export default function Card({ children, variant = 'bordered', className = '', style = {} }) {
  const base = {
    borderRadius: 0,
    backgroundColor: '#5C4A3D',
    padding: '1.75rem',   /* 28px → 1.75rem */
    boxShadow: 'none',
  };
  const bordered = variant === 'bordered'
    ? { border: '1px solid #4A3B2C' }  /* 1px hairline — intentional */
    : {};

  return (
    <div style={{ ...base, ...bordered, ...style }} className={className}>
      {children}
    </div>
  );
}
