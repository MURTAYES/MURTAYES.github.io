const fs = require('fs');

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/stats.css', 'utf8');
const js = fs.readFileSync('js/stats.js', 'utf8');

function assert(condition, message) {
  if (!condition) {
    console.error('FAIL:', message);
    process.exit(1);
  }
}

// 1. HTML checks
assert(html.includes('aria-labelledby="stats-title"'), 'Missing aria-labelledby="stats-title"');
assert(html.includes('h-[260svh]'), 'Missing h-[260svh] class in index.html');
assert(html.includes('clip-path: inset(30% 35%)'), 'Missing clip-path in index.html');
assert(html.includes('transform: scale(1.25)'), 'Missing scale in index.html');
assert(html.includes('fjordhus-waterfront.webp'), 'Missing fjordhus-waterfront.webp in index.html');
assert(html.includes('id="stats-title"'), 'Missing id="stats-title" in index.html');
assert(html.includes('m:grid-cols-12'), 'Missing m:grid-cols-12 in index.html');
assert(html.includes('Buildings completed'), 'Missing Buildings completed in index.html');
assert(html.includes('Square metres designed'), 'Missing Square metres designed in index.html');

// 2. CSS checks
assert(css.includes('.h-\\[260svh\\]'), 'Missing h-[260svh] in css/stats.css');
assert(css.includes('.m\\:grid-cols-12'), 'Missing m:grid-cols-12 in css/stats.css');
assert(css.includes('.text-paper\\/70'), 'Missing text-paper/70 in css/stats.css');
assert(css.includes('.bg-paper\\/30'), 'Missing bg-paper/30 in css/stats.css');
assert(css.includes('.tabular-nums'), 'Missing tabular-nums in css/stats.css');

// 3. Image existence
assert(fs.existsSync('assets/images/fjordhus-waterfront.webp'), 'Missing fjordhus-waterfront.webp file');

console.log('✓ All stats design checks passed successfully!');
