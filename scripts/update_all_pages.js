const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/about/page.js',
  'src/app/amenities/page.js',
  'src/app/contact/page.js',
  'src/app/gallery/page.js',
  'src/app/rooms/page.js',
  'src/app/rooms/[slug]/page.js',
  'src/components/RoomCard.jsx',
  'src/components/SectionHeader.jsx',
  'src/components/Lightbox.jsx',
  'src/components/WhatsAppFloat.jsx',
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) {
    console.warn('File not found:', fullPath);
    return;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // BACKGROUND REPLACEMENTS
  content = content.replace(/backgroundColor:\s*C\.midnightRoast/g, "backgroundColor: 'var(--color-cream)'");
  content = content.replace(/backgroundColor:\s*C\.onyxWarm/g, "backgroundColor: 'var(--color-cream-deep)'");
  content = content.replace(/backgroundColor:\s*'#292622'/g, "backgroundColor: 'var(--color-cream)'");
  content = content.replace(/backgroundColor:\s*C\.parchment/g, "backgroundColor: 'var(--color-cream)'"); // Replaces old light sections
  
  // TEXT REPLACEMENTS
  content = content.replace(/color:\s*C\.parchment/g, "color: 'var(--color-chocolate)'");
  content = content.replace(/color:\s*C\.linen/g, "color: C.espresso");
  content = content.replace(/color:\s*C\.walnut/g, "color: C.espresso");
  
  // ACCENT REPLACEMENTS
  content = content.replace(/backgroundColor:\s*C\.saffron/g, "backgroundColor: 'var(--color-gold)'");
  content = content.replace(/color:\s*C\.saffron/g, "color: 'var(--color-gold)'");
  content = content.replace(/borderTop:\s*`1px solid \$\{C\.saffron\}`/g, "borderTop: `1px solid var(--color-gold)`");
  content = content.replace(/border:\s*`1px solid \$\{C\.saffron\}`/g, "border: `1px solid var(--color-gold)`");

  // SECTION HEADER SURFACES
  // Since all backgrounds are cream now, any surface="dark" should become surface="light"
  content = content.replace(/surface="dark"/g, 'surface="light"');

  // ROOM DETAILS SPECIFIC [slug]/page.js
  if (file === 'src/app/rooms/[slug]/page.js') {
    content = content.replace(/backgroundColor: 'var\(--color-white-overlay\)'/g, "backgroundColor: 'var(--color-cream)'");
    content = content.replace(/backgroundColor: 'rgba\(0,0,0,0\.05\)'/g, "backgroundColor: 'rgba(201,168,76,0.15)'");
    content = content.replace(/color: 'var\(--color-gray-dark\)'/g, "color: 'var(--color-chocolate)'");
    content = content.replace(/color: 'var\(--color-gray-medium\)'/g, "color: C.espresso");
  }

  // ROOM CARD COMPONENT SPECIFIC
  if (file === 'src/components/RoomCard.jsx') {
    content = content.replace(/color: '#DEB76A'/g, "color: 'var(--color-chocolate)'");
    content = content.replace(/color: '#978e81'/g, "color: C.espresso");
    content = content.replace(/color: '#d8cbb8'/g, "color: 'var(--color-chocolate)'");
    content = content.replace(/backgroundColor: '#d49653'/g, "backgroundColor: 'var(--color-gold)'");
    content = content.replace(/color: '#d49653'/g, "color: 'var(--color-gold)'");
    content = content.replace(/backgroundColor: 'rgba\(41,38,34,0\.72\)'/g, "backgroundColor: 'rgba(246,237,216,0.85)'");
  }

  // LIGHTBOX COMPONENT SPECIFIC
  if (file === 'src/components/Lightbox.jsx') {
    // Keep lightbox overlay dark, but update accents
    content = content.replace(/color: '#DEB76A'/g, "color: 'var(--color-gold)'");
  }

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Updated:', file);
});
