const fs = require('fs');
const path = require('path');

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
const css = fs.readFileSync('css/contact.css', 'utf8');
const js = fs.readFileSync('js/contact.js', 'utf8');

// CONT-01: Two-column asymmetric layout & markup in index.html
test('CONT-01: Two-column asymmetric layout container', () => {
  if (!html.includes('id="contact"') || !html.includes('class="home-contacto js-home-contacto"')) {
    throw new Error('Missing #contact or home-contacto in index.html');
  }
  if (!html.includes('home-contacto__stage') || !html.includes('home-contacto__content')) {
    throw new Error('Missing two-column layout elements in index.html');
  }
  if (!css.includes('grid-template-columns: 1.15fr 0.85fr')) {
    throw new Error('Missing 1.15fr 0.85fr grid columns in css/contact.css');
  }
});

// CONT-02: Left interactive workspace stage & dual-layer spotlight dot grid
test('CONT-02: Dual-layer spotlight dot grid with CSS custom properties', () => {
  if (!html.includes('home-contacto__puntos')) {
    throw new Error('Missing .home-contacto__puntos in index.html');
  }
  if (!css.includes('--dot-lit-x') || !css.includes('--dot-lit-y')) {
    throw new Error('Missing --dot-lit-x or --dot-lit-y custom properties in css/contact.css');
  }
  if (!js.includes('--dot-lit-x') || !js.includes('--dot-lit-y')) {
    throw new Error('Missing spotlight CSS property updates in js/contact.js');
  }
});

// CONT-03: Floating "Aa" typography specimen badge tilted at -8deg
test('CONT-03: Floating "Aa" typography specimen badge', () => {
  if (!html.includes('contacto-badge-aa') || !html.includes('badge-aa__letter')) {
    throw new Error('Missing .contacto-badge-aa in index.html');
  }
  if (!css.includes('-8deg')) {
    throw new Error('Missing -8deg tilt on .contacto-badge-aa in css/contact.css');
  }
});

// CONT-04: 3 staggered visual cards
test('CONT-04: 3 Staggered visual cards (metrics, laptop, desk portrait)', () => {
  if (!html.includes('contacto-card--metrics') || !html.includes('SYSTEM BENCHMARKS')) {
    throw new Error('Missing metrics panel card in index.html');
  }
  if (!html.includes('contacto-card--laptop') || !html.includes('terminal.sh')) {
    throw new Error('Missing wireframe laptop code card in index.html');
  }
  if (!html.includes('contacto-card--desk') || !html.includes('hero.png')) {
    throw new Error('Missing desk workspace portrait card in index.html');
  }
});

// CONT-05: Floating chat dialog window & 5 tool app bubbles
test('CONT-05: Floating chat dialog window and 5 tool app bubbles', () => {
  if (!html.includes('contacto-card--chat') || !html.includes('chat-bubble--incoming') || !html.includes('chat-bubble--outgoing')) {
    throw new Error('Missing chat dialog window in index.html');
  }
  const toolIcons = ['figma.svg', 'notion.svg', 'claude-code.svg', 'chrome.svg', 'javascript.svg'];
  toolIcons.forEach(icon => {
    if (!html.includes(icon)) {
      throw new Error(`Missing tool icon ${icon} in index.html`);
    }
  });
});

// CONT-06: Autonomous "Cliente" SVG cursor gliding along Lissajous paths
test('CONT-06: Autonomous "Cliente" SVG cursor and Lissajous controller', () => {
  if (!html.includes('contacto-cliente-cursor') || !html.includes('js-cliente-cursor') || !html.includes('Cliente')) {
    throw new Error('Missing Cliente cursor markup in index.html');
  }
  if (!js.includes('Math.sin') || !js.includes('requestAnimationFrame') || !js.includes('isHovered')) {
    throw new Error('Missing Lissajous or hover override in js/contact.js');
  }
});

// CONT-07: Right column headline with expanding dotted baseline leaders & primary CTA
test('CONT-07: Editorial headline with dotted baseline leaders and Hablemos CTA', () => {
  if (!html.includes('home-contacto__titulo-puntos')) {
    throw new Error('Missing home-contacto__titulo-puntos in index.html');
  }
  if (!css.includes('home-contacto__titulo-puntos')) {
    throw new Error('Missing home-contacto__titulo-puntos styling in css/contact.css');
  }
  if (!html.includes('home-contacto__btn-primary') || !html.includes("Hablemos")) {
    throw new Error('Missing Hablemos CTA button in index.html');
  }
  if (!html.includes('samnun@murtayes.com')) {
    throw new Error('Missing email link in index.html');
  }
});

// Verification of script and style linkages
test('Linkages: css/contact.css and js/contact.js linked in index.html', () => {
  if (!html.includes('href="css/contact.css"')) {
    throw new Error('Missing css/contact.css link in index.html');
  }
  if (!html.includes('src="js/contact.js"')) {
    throw new Error('Missing js/contact.js script in index.html');
  }
});

console.log('\n--- ALL PHASE 7 VERIFICATION CHECKS PASSED (100%) ---');
