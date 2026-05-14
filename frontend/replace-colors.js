const fs = require('fs');
const files = [
  'src/pages/Home.jsx',
  'src/components/layout/NavBar.jsx',
  'src/components/layout/Footer.jsx'
];

const replacements = {
  'brand-blue': '[#1A6BFF]',
  'brand-violet': '[#6C3FFF]',
  'brand-gold': '[#C9A84C]',
  'dark-bg': '[#0A0A0F]',
  'dark-surface': '[#0F0F1C]',
  'htext-primary': '[#F0F0FF]',
  'htext-secondary': '[#8888AA]',
  'htext-muted': '[#55556A]',
  'bg-gradient-hero': 'bg-gradient-to-r from-[#1A6BFF] via-[#6C3FFF] to-[#C9A84C]',
  'bg-gradient-subtle': 'bg-gradient-to-b from-[#1A6BFF]/10 to-transparent'
};

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    for (const [key, value] of Object.entries(replacements)) {
      content = content.split(key).join(value);
    }
    fs.writeFileSync(file, content);
    console.log(`Updated ${file}`);
  }
});
