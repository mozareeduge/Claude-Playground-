'use strict';
// Data integrity validator for The Black Bird ontology.
const fs = require('fs');
const path = require('path');

const htmlPath = path.resolve(__dirname, '../index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

const match = html.match(/^const DATA = (\{[\s\S]*?\});$/m);
if (!match) { console.error('FAIL: DATA block not found'); process.exit(1); }
const DATA = JSON.parse(match[1]);

let errors = [];
function fail(msg) { errors.push(msg); }

const nodeIds = new Set(DATA.nodes.map(n => n.id));

// 1. No active ordered RNO/MNO/RefO/RelO IDs remain
const orderedPattern = /^(RNO|MNO|RefO|RelO)\.\d/;
for (const id of nodeIds) {
  if (orderedPattern.test(id)) fail(`Ordered ID still present: ${id}`);
}

// 2. Node IDs unique
const seen = new Set();
for (const n of DATA.nodes) {
  if (seen.has(n.id)) fail(`Duplicate node ID: ${n.id}`);
  seen.add(n.id);
}

// 3. texts keys point to existing nodes
for (const k of Object.keys(DATA.texts)) {
  if (!nodeIds.has(k)) fail(`texts key missing from nodes: ${k}`);
}

// 4. refs entries in texts point to existing RefO nodes
for (const [k, v] of Object.entries(DATA.texts)) {
  for (const ref of (v.refs || [])) {
    if (!nodeIds.has(ref)) fail(`texts[${k}].refs references missing node: ${ref}`);
    const node = DATA.nodes.find(n => n.id === ref);
    if (node && node.type !== 'RefO') fail(`texts[${k}].refs entry is not RefO: ${ref}`);
  }
}

// 5. objects entries point to existing nodes
for (const [k, v] of Object.entries(DATA.texts)) {
  for (const obj of (v.objects || [])) {
    if (!nodeIds.has(obj)) fail(`texts[${k}].objects references missing node: ${obj}`);
  }
}

// 6. Inline .fl[data-id] references in bodies point to existing nodes
const dataIdRe = /data-id="([^"]+)"/g;
for (const [k, v] of Object.entries(DATA.texts)) {
  let m;
  dataIdRe.lastIndex = 0;
  while ((m = dataIdRe.exec(v.body || '')) !== null) {
    if (!nodeIds.has(m[1])) fail(`texts[${k}] inline data-id references missing node: ${m[1]}`);
  }
}

// 7. NameO attached entries point to existing nodes
for (const [k, v] of Object.entries(DATA.nameos || {})) {
  for (const att of (v.attached || [])) {
    if (!nodeIds.has(att)) fail(`nameos[${k}].attached references missing node: ${att}`);
  }
}

// 8. relation keys point to existing RelO nodes
for (const k of Object.keys(DATA.relations || {})) {
  if (!nodeIds.has(k)) fail(`relations key missing from nodes: ${k}`);
  const node = DATA.nodes.find(n => n.id === k);
  if (node && node.type !== 'RelO') fail(`relations key is not RelO: ${k}`);
}

// 9. relation participants point to existing nodes
for (const [k, participants] of Object.entries(DATA.relations || {})) {
  for (const p of participants) {
    if (!nodeIds.has(p)) fail(`relations[${k}] participant missing node: ${p}`);
  }
}

// 10. Every RelO node has matching relation entry
for (const n of DATA.nodes) {
  if (n.type === 'RelO' && !DATA.relations[n.id]) fail(`RelO node has no relations entry: ${n.id}`);
}

// 11. RelO labels equal opaque IDs
for (const n of DATA.nodes) {
  if (n.type === 'RelO') {
    if (n.label !== n.id) fail(`RelO label !== id: ${n.id} (label: ${n.label})`);
  }
}

// 12. RelO shortLabels start with rel·
for (const n of DATA.nodes) {
  if (n.type === 'RelO') {
    if (!n.shortLabel || !n.shortLabel.startsWith('rel·')) {
      fail(`RelO shortLabel does not start with rel·: ${n.id} (shortLabel: ${n.shortLabel})`);
    }
  }
}

// 13. FO.ALLAH exists and is connected through RelO.R4CB4A8D8
if (!nodeIds.has('FO.ALLAH')) fail('FO.ALLAH is missing');
const rel4cb4 = DATA.relations['RelO.R4CB4A8D8'];
if (!rel4cb4 || !rel4cb4.includes('FO.ALLAH')) fail('FO.ALLAH is not in RelO.R4CB4A8D8 participants');

// 14. FO.FORENSIC_PATHOLOGY connected through RelO.R847178B0 and RelO.R2D2CBF08
const relR847 = DATA.relations['RelO.R847178B0'];
if (!relR847 || !relR847.includes('FO.FORENSIC_PATHOLOGY')) fail('FO.FORENSIC_PATHOLOGY not in RelO.R847178B0');
const relR2D2 = DATA.relations['RelO.R2D2CBF08'];
if (!relR2D2 || !relR2D2.includes('FO.FORENSIC_PATHOLOGY')) fail('FO.FORENSIC_PATHOLOGY not in RelO.R2D2CBF08');

// 15. FO.GOD exists
if (!nodeIds.has('FO.GOD')) fail('FO.GOD is missing');

// 16. RelO.R9C3F1A62 exists and contains FO.GOD
if (!nodeIds.has('RelO.R9C3F1A62')) fail('RelO.R9C3F1A62 is missing');
const rel9C3F = DATA.relations['RelO.R9C3F1A62'];
if (!rel9C3F || !rel9C3F.includes('FO.GOD')) fail('FO.GOD is not in RelO.R9C3F1A62 participants');

// 17. RelO.RB6E74D1A exists and contains FO.GOD
if (!nodeIds.has('RelO.RB6E74D1A')) fail('RelO.RB6E74D1A is missing');
const relB6E7 = DATA.relations['RelO.RB6E74D1A'];
if (!relB6E7 || !relB6E7.includes('FO.GOD')) fail('FO.GOD is not in RelO.RB6E74D1A participants');

// Report
if (errors.length === 0) {
  console.log('PASS: all data integrity checks passed (' + nodeIds.size + ' nodes)');
  process.exit(0);
} else {
  console.error('FAIL: ' + errors.length + ' error(s):');
  for (const e of errors) console.error('  ' + e);
  process.exit(1);
}
