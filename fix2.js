const fs = require('fs');
const path = require('path');

function fixFiles(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixFiles(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      content = content.replace(/@Request\(\) req\)/g, '@Request() req: any)');
      content = content.replace(/@Request\(\) req \{/g, '@Request() req: any) {');
      fs.writeFileSync(fullPath, content);
    }
  }
}

fixFiles(path.join(__dirname, 'src'));
