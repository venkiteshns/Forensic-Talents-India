const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const viewportStr = 'viewport={{ once: true, amount: 0.15 }}';

walkDir('./src', function(filePath) {
  if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Replace staggerContainer and others to use "visible"
    content = content.replace(/animate="show"/g, `initial="hidden" whileInView="visible" ${viewportStr}`);
    content = content.replace(/whileInView="show"/g, `whileInView="visible"`);
    content = content.replace(/viewport=\{\{ once: true, margin: "-10%" \}\}/g, viewportStr);
    content = content.replace(/viewport=\{\{ once: true \}\}/g, viewportStr);
    
    // Sometimes initial="hidden" might be duplicated now, so cleanup:
    content = content.replace(/initial="hidden"\s+initial="hidden"/g, 'initial="hidden"');
    content = content.replace(/initial="hidden"\s+whileInView="visible"\s+viewport=\{\{[^}]+\}\}\s+initial="hidden"/g, `initial="hidden" whileInView="visible" ${viewportStr}`);

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Updated ' + filePath);
    }
  }
});
