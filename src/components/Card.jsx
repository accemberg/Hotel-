/**
 * Card — Amrit Palace design system
 * Sharp 0 border-radius, no shadow, optional 1px hairline border.
 * All spacing in rem.
 */
export default function Card({ children, variant = 'bordered', className = '', style = {} }) {
  const base = {
    borderRadius: 0,
    backgroundColor: 'var(--color-card-bg)',
    padding: '1.75rem',   /* 28px → 1.75rem */
    boxShadow: 'none',
  };
  const bordered = variant === 'bordered'
    ? { border: '1px solid var(--color-card-border)' }  /* 1px hairline — intentional */
    : {};

  return (
    <div style={{ ...base, ...bordered, ...style }} className={className}>
      {children}
    </div>
  );
}
