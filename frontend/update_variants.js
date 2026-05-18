const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace "show" with "visible" in Framer Motion props
    content = content.replace(/animate="show"/g, 'animate="visible"');
    content = content.replace(/whileInView="show"/g, 'whileInView="visible"');
    content = content.replace(/initial="hidden" animate="visible"/g, 'initial="hidden" animate="visible" viewport={{ once: true, amount: 0.15 }}');
    content = content.replace(/initial="hidden" whileInView="visible"/g, 'initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }}');
    
    // Fix viewport overrides if any
    content = content.replace(/viewport=\{\{ once: true, amount: 0.15 \}\} viewport=\{\{([^}]+)\}\}/g, 'viewport={{$1}}');

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
});
