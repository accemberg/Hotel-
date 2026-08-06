const fs = require('fs');
const path = require('path');

// 1. Update text colors to chocolate in the main pages
const pagesToUpdate = [
  'src/app/about/page.js',
  'src/app/amenities/page.js',
  'src/app/contact/page.js',
  'src/app/gallery/page.js',
  'src/app/rooms/page.js',
  'src/app/rooms/[slug]/page.js',
  'src/app/page.js',
  'src/components/RoomCard.jsx',
  'src/components/SectionHeader.jsx',
  'src/components/WhatsAppFloat.jsx',
];

pagesToUpdate.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Replace espresso with chocolate to unify the dark text color
  content = content.replace(/C\.espresso/g, "C.chocolate");
  content = content.replace(/var\(--color-espresso\)/g, "var(--color-chocolate)");

  // Make sure buttons with transparent background have a visible border/text
  // E.g. rgba(216,203,184,0.30) -> var(--color-gold)
  content = content.replace(/rgba\(216,203,184,0\.30\)/g, "rgba(61,43,31,0.30)");
  
  fs.writeFileSync(fullPath, content, 'utf8');
});

// 2. Update 404 page
const notFoundPath = path.join(process.cwd(), 'src/app/not-found.js');
if (fs.existsSync(notFoundPath)) {
  let content = fs.readFileSync(notFoundPath, 'utf8');
  
  // Change background to cream
  content = content.replace(/var\(--color-white-overlay\)/g, "var(--color-cream)");
  
  // Change text colors to chocolate instead of saffron where appropriate
  content = content.replace(/color:\s*var\(--color-saffron\)/g, "color: var(--color-chocolate)");
  content = content.replace(/color:\s*'var\(--color-saffron\)'/g, "color: 'var(--color-chocolate)'");
  
  // Update 404 watermark
  content = content.replace(/rgba\(216,\s*203,\s*184,\s*0\.15\)/g, "rgba(201,168,76,0.15)");
  
  // Update buttons
  content = content.replace(/background:\s*var\(--color-saffron\)/g, "background: var(--color-gold-hover)");
  content = content.replace(/background:\s*rgba\(222,183,106,0\.1\)/g, "background: rgba(201,168,76,0.1)");
  content = content.replace(/border-color:\s*rgba\(222,183,106,0\.3\)/g, "border-color: var(--color-gold)");
  content = content.replace(/border-color:\s*rgba\(222,183,106,0\.6\)/g, "border-color: var(--color-gold-hover)");
  content = content.replace(/border:\s*1px solid var\(--color-saffron\)/g, "border: 1px solid var(--color-gold)");
  content = content.replace(/var\(--color-saffron\)/g, "var(--color-gold)"); // fallback for other saffron

  // Fix button text on hover
  content = content.replace(/color:\s*var\(--color-white-overlay\)/g, "color: var(--color-cream)");

  // Jali and glow colors
  content = content.replace(/%23d8cbb8/g, "%23C9A84C"); // parchment hex to gold hex for jali SVG
  content = content.replace(/rgba\(212,150,83,0\.07\)/g, "rgba(201,168,76,0.15)"); // glow

  fs.writeFileSync(notFoundPath, content, 'utf8');
}
