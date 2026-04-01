const fs = require('fs');
const path = require('path');

const apiSrc = 'apps/api/src/api';
const dest = 'apps/api/src';

if (fs.existsSync(apiSrc)) {
  const files = fs.readdirSync(apiSrc);
  for (const file of files) {
    fs.renameSync(path.join(apiSrc, file), path.join(dest, file));
  }
  fs.rmdirSync(apiSrc);
}
