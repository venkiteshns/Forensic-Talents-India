const fs = require('fs');
let content = fs.readFileSync('frontend/src/data/serviceDetails.js', 'utf8');
content = content.replace(/"question": "(.*?)\\n(.*?)",\s*"answer": ""/g, (match, q, a) => {
  return `"question": "${q}",\n        "answer": "${a}"`;
});
fs.writeFileSync('frontend/src/data/serviceDetails.js', content);
console.log('Fixed FAQs');
