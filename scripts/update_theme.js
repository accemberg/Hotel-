const fs = require('fs');

let content = fs.readFileSync('src/app/page.js', 'utf8');

// 1. Hero section background
content = content.replace(
  /backgroundColor: '.*?#292622'.*?/,
  "backgroundColor: 'var(--color-cream)',"
);
content = content.replace(
  /backgroundColor: C\.midnightRoast,/,
  "backgroundColor: 'var(--color-cream)',"
);

// 2. Hero glow
content = content.replace(
  /rgba\(212,150,83,0\.12\)/g,
  "rgba(201,168,76,0.15)"
);

// 3. Hero meta labels
content = content.replace(
  /color: C\.walnut,/g,
  "color: 'var(--color-gold)',"
);
content = content.replace(
  /color: '#978e81',/g,
  "color: 'var(--color-gold)',"
);

// 4. Hero heading
content = content.replace(
  /textTransform: 'uppercase',\s*color: C\.parchment,/g,
  "textTransform: 'uppercase',\n                color: 'var(--color-gold)',"
);
content = content.replace(
  /color: '#DEB76A',/g,
  "color: 'var(--color-gold)',"
);

// 5. Hero description
content = content.replace(
  /letterSpacing: '-0\.01em',\s*color: C\.linen,/g,
  "letterSpacing: '-0.01em',\n                color: C.espresso,"
);
content = content.replace(
  /color: '#bfb4a3',/g,
  "color: C.espresso,"
);

// 6. Hero primary button
content = content.replace(
  /border: `1px solid \$\{C\.saffron\}`/g,
  "border: `1px solid var(--color-gold)`"
);
content = content.replace(
  /border: '1px solid #d8cbb8'/g,
  "border: `1px solid var(--color-gold)`"
);
content = content.replace(
  /background: C\.saffron,\s*color: C\.midnightRoast/g,
  "background: 'var(--color-gold)',\n                    color: 'var(--color-chocolate)'"
);

// 7. Hero secondary button
content = content.replace(
  /border: `1px solid rgba\(216,203,184,0\.30\)`/g,
  "border: `1px solid rgba(61,43,31,0.30)`"
);
content = content.replace(
  /border: '1px solid rgba\(216,203,184,0\.35\)'/g,
  "border: `1px solid rgba(61,43,31,0.30)`"
);
content = content.replace(
  /background: 'transparent',\s*color: C\.parchment/g,
  "background: 'transparent',\n                    color: C.espresso"
);

// 8. Rooms section background
content = content.replace(
  /backgroundColor: C\.onyxWarm,/g,
  "backgroundColor: 'var(--color-cream-deep)',"
);
// 9. Rooms SectionHeader surface
content = content.replace(
  /heading="Stay in Heritage" size="heading" surface="dark"/g,
  'heading="Stay in Heritage" size="heading" surface="light"'
);
// 10. Rooms Grid bg
content = content.replace(
  /backgroundColor: `rgba\(216,203,184,0\.08\)`/g,
  'backgroundColor: `rgba(201,168,76,0.15)`'
);

// 11. Gallery preview background
content = content.replace(
  /style=\{\{\s*backgroundColor: C\.midnightRoast,\s*padding: '7\.5rem 2\.5rem'\s*\}\}/g,
  "style={{ backgroundColor: 'var(--color-cream-deep)', padding: '7.5rem 2.5rem' }}"
);
content = content.replace(
  /heading="The Property" size="heading-sm" surface="dark"/g,
  'heading="The Property" size="heading-sm" surface="light"'
);

// 12. Location section background
content = content.replace(
  /style=\{\{\s*backgroundColor: C\.onyxWarm,\s*padding: '7\.5rem 2\.5rem'\s*\}\}/g,
  "style={{ backgroundColor: 'var(--color-cream)', padding: '7.5rem 2.5rem' }}"
);
content = content.replace(
  /size="heading"\s*surface="dark"/g,
  'size="heading"\n              surface="light"'
);

// 13. Location buttons
content = content.replace(
  /border: `1px solid \$\{\w+ \? C\.saffron : 'rgba\(216,203,184,0\.25\)'\}`/g,
  "border: `1px solid ${primary ? 'var(--color-gold)' : 'rgba(61,43,31,0.30)'}`"
);
content = content.replace(
  /background: \w+ \? C\.saffron : 'transparent'/g,
  "background: primary ? 'var(--color-gold)' : 'transparent'"
);
content = content.replace(
  /color: \w+ \? C\.midnightRoast : C\.linen/g,
  "color: primary ? 'var(--color-chocolate)' : C.espresso"
);

// 14. Divider
content = content.replace(
  /backgroundColor: C\.onyxWarm/g,
  "backgroundColor: 'var(--color-cream-deep)'"
);
content = content.replace(
  /borderTop: `1px solid \$\{C\.espresso\}`/g,
  "borderTop: `1px solid rgba(201,168,76,0.25)`"
);

fs.writeFileSync('src/app/page.js', content, 'utf8');
