const fs = require('fs-extra');
const path = require('path');

fs.ensureDirSync('public');

fs.copySync(
  path.resolve(process.cwd(), 'tools/sw/pwa'),
  path.resolve(process.cwd(), 'public')
);
