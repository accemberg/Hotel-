const fs = require('fs');
const path = require('path');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(function(file) {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) { 
      results = results.concat(walk(file));
    } else { 
      if (file.endsWith('.js') || file.endsWith('.jsx')) results.push(file);
    }
  });
  return results;
}

const files = walk('./src/app');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // 1. Backgrounds
  content = content.replace(/backgroundColor:\s*['"]#(d8cbb8|5C4A3D)['"]/g, "backgroundColor: '#292622'");
  content = content.replace(/backgroundColor:\s*['"]#(b6ab9c|4A3B2C)['"]/g, "backgroundColor: 'rgba(216,203,184,0.1)'");
  
  // 2. Borders and Dividers
  content = content.replace(/border(Top|Bottom|Left|Right)?:\s*['"]1px solid #(b6ab9c|4A3B2C)['"]/g, "border$1: '1px solid rgba(216,203,184,0.1)'");
  content = content.replace(/border:\s*['"]1px solid #2c2c2c['"]/g, "border: '1px solid #d8cbb8'");

  // 3. Text colors
  content = content.replace(/color:\s*['"]#2c2c2c['"]/g, "color: '#d8cbb8'");
  content = content.replace(/color:\s*['"]#615b53['"]/g, "color: '#bfb4a3'");

  // 4. Fix OTA button hover effects specifically
  // The line is: onMouseEnter={e => { e.currentTarget.style.background = '#2c2c2c'; e.currentTarget.style.color = '#d8cbb8'; }}
  // We want: background = '#d8cbb8'; color = '#2c2c2c'
  content = content.replace(/style\.background = ['"]#2c2c2c['"];\s*e\.currentTarget\.style\.color = ['"]#d8cbb8['"]/g, "style.background = '#d8cbb8'; e.currentTarget.style.color = '#2c2c2c'");

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Converted to dark mode:', file);
  }
});

console.log('Dark mode conversion complete.');
