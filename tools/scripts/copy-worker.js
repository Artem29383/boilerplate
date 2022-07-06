const fs = require('fs-extra');
const path = require('path');

fs.ensureDirSync('public');

const isDEV = process.env.NODE_ENV === 'development';

fs.copySync(
  path.resolve(process.cwd(), 'tools/sw/pwa'),
  path.resolve(process.cwd(), isDEV ? 'public' : 'build/static/js')
);
