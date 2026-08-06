const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/app/page.js',
  'src/app/rooms/page.js',
];

filesToUpdate.forEach(file => {
  const fullPath = path.join(process.cwd(), file);
  if (!fs.existsSync(fullPath)) return;
  
  let content = fs.readFileSync(fullPath, 'utf8');

  // Replace parchment text with black
  content = content.replace(/color:\s*'#d8cbb8'/g, "color: '#000000'");
  
  // Replace muted walnut text with dark gray/black
  content = content.replace(/color:\s*'#978e81'/g, "color: '#000000'");
  content = content.replace(/color:\s*muted \? '#978e81' : '#d8cbb8'/g, "color: '#000000'");
  
  // Replace button borders to be gold or black so they are visible
  content = content.replace(/border:\s*`1px solid \$\{muted \? 'rgba\(216,203,184,0\.3\)' : '#d8cbb8'\}`/g, "border: `1px solid ${muted ? 'rgba(0,0,0,0.3)' : '#000000'}`");
  content = content.replace(/border-color:\s*'rgba\(216,203,184,0\.3\)'/g, "border-color: 'rgba(0,0,0,0.3)'");
  content = content.replace(/border:\s*`1px solid rgba\(216,203,184,0\.3\)`/g, "border: `1px solid rgba(0,0,0,0.3)`");
  
  // Replace faint borders in UI with dark faint borders
  content = content.replace(/backgroundColor:\s*'rgba\(216,203,184,0\.1\)'/g, "backgroundColor: 'rgba(0,0,0,0.1)'");
  content = content.replace(/border:\s*'1px solid rgba\(216,203,184,0\.1\)'/g, "border: '1px solid rgba(0,0,0,0.1)'");
  
  // Update C.parchment to #000000 in rooms/page.js button hover states etc
  content = content.replace(/C\.parchment/g, "'#000000'");
  content = content.replace(/C\.linen/g, "'#000000'");

  fs.writeFileSync(fullPath, content, 'utf8');
});
