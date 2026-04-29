/**
 * build.js — Legge tutti i file Markdown in content/ e genera data.json
 * Eseguire con:  node build.js
 * Netlify lo eseguirà automaticamente ad ogni deploy (vedi netlify.toml)
 */

const fs   = require('fs');
const path = require('path');

/* ── YAML FRONTMATTER PARSER ──────────────────────────────────────────────
   Supporta:
     - stringhe con o senza virgolette
     - numeri (interi e decimali)
     - array semplici:  [val1, val2]  oppure  []
     - valori null/vuoti
──────────────────────────────────────────────────────────────────────── */
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return {};
  const obj = {};
  for (const line of m[1].split(/\r?\n/)) {
    const ci = line.indexOf(':');
    if (ci < 0) continue;
    const k = line.slice(0, ci).trim();
    if (!k) continue;
    let v = line.slice(ci + 1).trim();

    if (!v) { obj[k] = null; continue; }

    // Array  [a, b, c]
    if (v.startsWith('[') && v.endsWith(']')) {
      const inner = v.slice(1, -1).trim();
      obj[k] = inner
        ? inner.split(',').map(s => s.trim().replace(/^["']|["']$/g, ''))
        : [];
      continue;
    }

    // Rimuovi virgolette
    v = v.replace(/^["'](.*)["']$/, '$1');

    // Numero
    if (v !== '' && !isNaN(Number(v))) {
      obj[k] = Number(v);
    } else {
      obj[k] = v;
    }
  }
  return obj;
}

/* ── LEGGI UNA COLLEZIONE ─────────────────────────────────────────────── */
function readCollection(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.md'))
    .map(f => parseFrontmatter(fs.readFileSync(path.join(dir, f), 'utf8')))
    .filter(o => o.nome)
    .sort((a, b) => (a.ordine ?? 999) - (b.ordine ?? 999));
}

/* ── GENERA data.json ─────────────────────────────────────────────────── */
const data = {
  birre:   readCollection('content/birre'),
  piatti:  readCollection('content/piatti'),
  bevande: readCollection('content/bevande'),
  vini:    readCollection('content/vini'),
};

fs.writeFileSync('data.json', JSON.stringify(data, null, 2), 'utf8');

console.log(
  `✓ data.json generato: ` +
  `${data.birre.length} birre, ` +
  `${data.piatti.length} piatti, ` +
  `${data.bevande.length} bevande, ` +
  `${data.vini.length} vini`
);
