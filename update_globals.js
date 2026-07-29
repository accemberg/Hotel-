const fs = require('fs');

const filePath = 'c:/Users/lenovo/Desktop/moksh-haveli-inn/src/app/globals.css';
let css = fs.readFileSync(filePath, 'utf8');

css = css.replace(
  /--font-display:\s*[^;]+;/, 
  "--font-tt-ramillas-variable: 'TT Ramillas Variable', 'Cormorant Garamond', 'Playfair Display', Georgia, serif;"
);

css = css.replace(
  /--font-sans:\s*[^;]+;/,
  "--font-satoshi: 'Satoshi', 'Inter', 'DM Sans', ui-sans-serif, system-ui, sans-serif;"
);

css = css.replace(/var\(--font-display\)/g, 'var(--font-tt-ramillas-variable)');
css = css.replace(/var\(--font-sans\)/g, 'var(--font-satoshi)');

fs.writeFileSync(filePath, css);
console.log('Updated globals.css');
