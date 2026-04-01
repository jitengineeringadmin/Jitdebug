const fs = require('fs');
const path = require('path');

function mkdirp(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

mkdirp('packages/shared/src');
mkdirp('apps/api/src');
mkdirp('apps/web/src');
mkdirp('apps/api/prisma');

// Move Prisma
if (fs.existsSync('prisma')) {
  fs.renameSync('prisma', 'apps/api/prisma');
}

// Move API
if (fs.existsSync('src/api')) {
  fs.renameSync('src/api', 'apps/api/src/api');
}

// Move Web
if (fs.existsSync('src/app')) {
  fs.renameSync('src/app', 'apps/web/src/app');
}
if (fs.existsSync('src/components')) {
  fs.renameSync('src/components', 'apps/web/src/components');
}
if (fs.existsSync('src/lib')) {
  fs.renameSync('src/lib', 'apps/web/src/lib');
}

// Move configs
const filesToWeb = ['next.config.ts', 'tailwind.config.ts', 'postcss.config.mjs', 'components.json', 'tsconfig.json'];
for (const file of filesToWeb) {
  if (fs.existsSync(file)) {
    fs.renameSync(file, 'apps/web/' + file);
  }
}

console.log('Moved files successfully.');
