const fs = require('fs');

function test(name, fn) {
  try {
    fn();
    console.log(`✓ ${name}`);
  } catch (err) {
    console.error(`✗ ${name}: ${err.message}`);
    process.exit(1);
  }
}

const html = fs.readFileSync('index.html', 'utf8');
const css = fs.readFileSync('css/footer.css', 'utf8');
const js = fs.readFileSync('js/footer.js', 'utf8');

// FOOT-01: Full-width container with subtle 1px dashed architectural blueprint divider
test('FOOT-01: Full-width container with 1px dashed divider', () => {
  if (!html.includes('class="site-colophon"') || !html.includes('site-colophon__container')) {
    throw new Error('Missing .site-colophon markup in index.html');
  }
  if (!css.includes('.site-colophon') || !css.includes('dashed')) {
    throw new Error('Missing .site-colophon with dashed border-top in css/footer.css');
  }
});

// FOOT-02: Single-line typographic editorial colophon
test('FOOT-02: Single-line typographic editorial colophon in Plus Jakarta Sans', () => {
  if (!html.includes('colophon-brand') || !html.includes('SAMNUN MURTAYES') || !html.includes('CREATIVE ENGINEER')) {
    throw new Error('Missing editorial colophon typography in index.html');
  }
  if (!css.includes('var(--font-primary, \'Plus Jakarta Sans\', sans-serif)')) {
    throw new Error('Missing Plus Jakarta Sans font specification in css/footer.css');
  }
  if (!css.includes('display: flex') || !css.includes('justify-content: space-between')) {
    throw new Error('Missing flex layout in css/footer.css');
  }
});

// FOOT-03: Dynamic current year updated automatically via JavaScript
test('FOOT-03: Dynamic current year script and markup element', () => {
  if (!html.includes('id="footer-year"')) {
    throw new Error('Missing #footer-year element in index.html');
  }
  if (!js.includes('footer-year') || !js.includes('getFullYear()')) {
    throw new Error('Missing getFullYear logic targeting #footer-year in js/footer.js');
  }
});

// FOOT-04: Clean address/location and navigation/service links with hover transitions
test('FOOT-04: Location, live clock, social links, and back-to-top button', () => {
  if (!html.includes('colophon-location') || !html.includes('DHAKA, BD')) {
    throw new Error('Missing location in index.html');
  }
  if (!html.includes('id="footer-live-time"')) {
    throw new Error('Missing #footer-live-time in index.html');
  }
  if (!html.includes('id="footer-back-top"') || !html.includes('colophon-top-btn')) {
    throw new Error('Missing back-to-top button in index.html');
  }
  if (!html.includes('MURTAYES') || !html.includes('samnun@murtayes.com')) {
    throw new Error('Missing clean links in index.html');
  }
  if (!css.includes('.colophon-link:hover') || !css.includes('.colophon-top-btn:hover')) {
    throw new Error('Missing link hover transitions in css/footer.css');
  }
});

console.log('\n--- ALL PHASE 8 VERIFICATION CHECKS PASSED (100%) ---');
