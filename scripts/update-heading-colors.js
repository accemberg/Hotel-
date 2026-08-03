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

const files = walk('./src');
let totalUpdated = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;
  
  // Find all instances of var(--font-tt-ramillas-variable) and replace color that follows it
  let newContent = content.replace(/(fontFamily:\s*['"]var\(--font-tt-ramillas-variable\)['"][^}]*?)color:\s*['"]#[a-fA-F0-9]{6}['"]/gs, (match, p1) => {
    changed = true;
    return p1 + "color: '#DEB76A'";
  });
  
  // Find all instances where color precedes var(--font-tt-ramillas-variable)
  newContent = newContent.replace(/(color:\s*['"]#[a-fA-F0-9]{6}['"][^}]*?fontFamily:\s*['"]var\(--font-tt-ramillas-variable\)['"])/gs, (match) => {
    changed = true;
    return match.replace(/color:\s*['"]#[a-fA-F0-9]{6}['"]/, "color: '#DEB76A'");
  });

  if (changed) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
    totalUpdated++;
  }
});

console.log(`Finished updating ${totalUpdated} files.`);
