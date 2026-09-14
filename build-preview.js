/* Build a self-contained preview.html (inlined CSS/JS/favicon) for sandboxed preview.
   Self-verifying: refuses to emit output if the embedded script is stale.
   Usage: node scripts/build-preview.js  — then register the printed file in Preview. */
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');

const js = read('scripts/main.js');
const css = read('styles/main.css');
const favicon = read('assets/favicon.svg');
let html = read('index.html');

// Sanity: main.js must contain BOTH helpers, exactly once each
const count = (hay, needle) => hay.split(needle).length - 1;
if (count(js, 'const $$') !== 1 || count(js, 'const $ =') !== 1) {
  console.error('FATAL: scripts/main.js is stale/corrupted — helpers missing or duplicated.');
  console.error('  const $$ count:', count(js, 'const $$'), '| const $ count:', count(js, 'const $ ='));
  process.exit(1);
}

const favUri = 'data:image/svg+xml,' + encodeURIComponent(favicon);
// NOTE: replacement must be a function — '$$' etc. in a string replacement are escape sequences.
html = html.replace('<link rel="stylesheet" href="styles/main.css" />', () => '<style>\n' + css + '\n</style>');
html = html.replace(/href="assets\/favicon\.svg"/g, () => 'href="' + favUri + '"');
html = html.replace('<script src="scripts/main.js" defer></script>', () => '<script>\n' + js + '\n</script>');
html = html.replace(/href="privacy\.html"/g, 'href="#contact"').replace(/href="terms\.html"/g, 'href="#contact"');

// Verify the embedding took and the embedded copy is the fresh one
if (count(html, 'const $$') !== 1 || !html.includes('<style>')) {
  console.error('FATAL: inlining failed verification.');
  process.exit(1);
}

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const outName = `preview-${stamp}.html`;
fs.writeFileSync(path.join(root, outName), html);

// Read-back verification
const back = fs.readFileSync(path.join(root, outName), 'utf8');
if (count(back, 'const $$') !== 1) {
  console.error('FATAL: read-back verification failed for', outName);
  process.exit(1);
}
console.log('OK ->', outName, back.length, 'bytes (verified fresh)');
