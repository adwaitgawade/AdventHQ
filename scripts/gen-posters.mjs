// Generates placeholder poster frames for the work grid + showreel.
// Dark cinematic gradient + grain + title text. Run: `node scripts/gen-posters.mjs`.
// TODO: replace generated posters with real AdventHQ stills.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../public/posters");
mkdirSync(OUT, { recursive: true });

// id, title, client, accent-ish hue pair (dark, cinematic)
const items = [
  ["aurora-running", "Aurora — Run Free", "Aurora Athletics", "#10243a", "#0a0a0b"],
  ["nyx-titles", "NYX — Title Sequence", "NYX Studios", "#241032", "#0a0a0b"],
  ["flux-ui", "Flux — Product Film", "Flux Labs", "#0c2e2a", "#0a0a0b"],
  ["volt-hyper", "Volt — Hyper Cut", "Volt Energy", "#33270c", "#0a0a0b"],
  ["monolith-3d", "Monolith — Brand Film", "Monolith", "#1a1a1d", "#070708"],
  ["pulse-ugc", "Pulse — Creator Series", "Pulse App", "#321026", "#0a0a0b"],
  ["halo-ad", "Halo — Spring Drop", "Halo Beauty", "#2e1622", "#0a0a0b"],
  ["drift-ugc", "Drift — Unboxed", "Drift Audio", "#102a32", "#0a0a0b"],
  ["atlas-marketing", "Atlas — Series A Film", "Atlas Cloud", "#13203a", "#0a0a0b"],
  ["nova-hyper", "Nova — Speed Reel", "Nova Motors", "#2a1010", "#0a0a0b"],
  ["ember-ad", "Ember — Holiday", "Ember Home", "#331a0c", "#0a0a0b"],
  ["prism-3d", "Prism — Logo System", "Prism", "#1c1033", "#0a0a0b"],
  ["remedy-hyper", "Remedy — Hyper Reel", "Remedy Drinks", "#2a0c1c", "#0a0a0b"],
  ["showreel", "AdventHQ — Showreel 2025", "Motion Design Studio", "#11131a", "#060607"],
];

const W = 1600;
const H = 1000;

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const svg = (id, title, client, c1, c2) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="g" cx="32%" cy="30%" r="95%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="100%" stop-color="${c2}"/>
    </radialGradient>
    <filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>
    <linearGradient id="scrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="40%" stop-color="#000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000" stop-opacity="0.7"/>
    </linearGradient>
  </defs>
  <!-- Placeholder still: gradient + grain + scrim only. The grid tile overlays
       title/client itself, so we intentionally bake no text into the poster.
       TODO: replace with a real AdventHQ still frame. -->
  <rect width="${W}" height="${H}" fill="url(#g)"/>
  <rect width="${W}" height="${H}" filter="url(#n)" opacity="0.08"/>
  <ellipse cx="${W * 0.32}" cy="${H * 0.3}" rx="${W * 0.5}" ry="${
  H * 0.5
}" fill="#fff" opacity="0.03"/>
  <rect width="${W}" height="${H}" fill="url(#scrim)"/>
</svg>
`;

for (const [id, title, client, c1, c2] of items) {
  writeFileSync(resolve(OUT, `${id}.svg`), svg(id, title, client, c1, c2));
}
console.log(`Generated ${items.length} posters in public/posters`);
