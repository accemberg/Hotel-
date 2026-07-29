const fs = require('fs');

const files = [
  'src/components/SectionHeader.jsx',
  'src/components/RoomCard.jsx',
  'src/components/Navbar.jsx',
  'src/components/Footer.jsx',
  'src/app/page.js'
];

files.forEach(f => {
  const filePath = `c:/Users/lenovo/Desktop/moksh-haveli-inn/${f}`;
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Replace the serif fonts
  content = content.replace(/"'Cormorant Garamond', 'Playfair Display', Georgia, serif"/g, "'var(--font-tt-ramillas-variable)'");
  content = content.replace(/"'Cormorant Garamond', serif"/g, "'var(--font-tt-ramillas-variable)'");
  
  // Replace the sans-serif fonts
  content = content.replace(/'Inter, sans-serif'/g, "'var(--font-satoshi)'");
  
  fs.writeFileSync(filePath, content);
});
console.log('Done replacing fonts.');
