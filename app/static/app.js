'use strict';
/* Wrenchbook front end: plain JS, hash routing, no build step. */

// ------------------------------------------------------------------ icons
const ICONS = {
  wrench: '<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>',
  home: '<path d="M3 21V8l9-5 9 5v13"/><path d="M7 21v-8h10v8"/><path d="M7 17h10"/>',
  clipboard: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',
  book: '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
  search: '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  plus: '<path d="M5 12h14"/><path d="M12 5v14"/>',
  edit: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/>',
  trash: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
  x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  check: '<path d="M20 6 9 17l-5-5"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/>',
  schedule: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/>',
  gauge: '<path d="m12 14 4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/>',
  dollar: '<path d="M12 2v20"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  user: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  file: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
  image: '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.09-3.09a2 2 0 0 0-2.82 0L6 21"/>',
  upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/>',
  download: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/>',
  copy: '<rect x="8" y="8" width="14" height="14" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  printer: '<path d="M6 9V2h12v7"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>',
  up: '<path d="m18 15-6-6-6 6"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  alert: '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  clock: '<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
  drop: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  nut: '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><circle cx="12" cy="12" r="3.5"/>',
  tire: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  bulb: '<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',
  box: '<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>',
  belt: '<circle cx="6" cy="12" r="3"/><circle cx="18" cy="12" r="4"/><path d="M6 9 18 8"/><path d="m6 15 12 1"/>',
  battery: '<rect x="3" y="7" width="18" height="12" rx="2"/><path d="M7 4v3M17 4v3"/><path d="M6.5 13h3M8 11.5v3M14.5 13h3"/>',
  note: '<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z"/><path d="M15 3v6h6"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2m-7.07-17.07 1.41 1.41m11.32 11.32 1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32 1.41-1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  archive: '<rect x="2" y="3" width="20" height="5" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',
  info: '<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  sparkle: '<path d="M12 3l1.9 5.8L20 10.7l-6.1 1.9L12 18.5l-1.9-5.9L4 10.7l6.1-1.9z"/><path d="M19 3v4M17 5h4M5 17v4M3 19h4"/>',
  checklist: '<path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8M13 12h8M13 18h8"/>',
  // vehicles & equipment
  car: '<path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/>',
  suv: '<path d="m21 8-2 2-1.5-3.7A2 2 0 0 0 15.646 5H8.4a2 2 0 0 0-1.903 1.257L5 10 3 8"/><path d="M7 14h.01"/><path d="M17 14h.01"/><rect width="18" height="8" x="3" y="10" rx="2"/><path d="M5 18v2"/><path d="M19 18v2"/>',
  van: '<path d="M3 17V7a2 2 0 0 1 2-2h10l5 5v6a1 1 0 0 1-1 1h-1"/><path d="M3 17a1 1 0 0 0 1 1h1"/><path d="M9 18h6"/><circle cx="7" cy="18" r="2"/><circle cx="17" cy="18" r="2"/><path d="M3 11h17"/><path d="M10 5v6"/>',
  truck: '<path d="M4 16H2v-5h9V6h6l3.5 4.5H21a1 1 0 0 1 1 1V16h-2"/><path d="M15 16H9"/><path d="M13 6.5V10.5h6"/><circle cx="6.5" cy="16.5" r="2"/><circle cx="17.5" cy="16.5" r="2"/>',
  moto: '<circle cx="5" cy="16" r="3"/><circle cx="19" cy="16" r="3"/><path d="M5 16h4l3-5h4l3 5"/><path d="M13 7h3l2 4"/><path d="M8 11h4"/>',
  atv: '<circle cx="6" cy="16" r="3.5"/><circle cx="18" cy="16" r="3.5"/><path d="M9.5 16h5"/><path d="M3 12h18l-2-4h-4l-1 2H9L8 8"/>',
  mower: '<path d="m4 6 5.5 7"/><path d="M2 5h4"/><rect x="8" y="12" width="13" height="5" rx="2"/><circle cx="10.5" cy="19" r="2"/><circle cx="18.5" cy="19" r="2"/><path d="M13 12v-2h4v2"/>',
  snow: '<path d="m3 4 5 8"/><path d="M8 12h7a6 6 0 0 1 6 6v1H8z"/><path d="M14 12V7l3-2"/><circle cx="11" cy="21" r="1.2"/><path d="M11 15.5h6"/>',
  gen: '<rect x="2" y="7" width="20" height="12" rx="2"/><path d="M6 7V4h12v3"/><path d="m13 10-3 3h4l-3 3"/><path d="M5 19v2M19 19v2"/>',
  can: '<path d="M8 3h4"/><path d="M10 3v3"/><path d="M5 8a2 2 0 0 1 2-2h8l4 4v10a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2z"/><path d="m9 12 6 6M15 12l-6 6"/>',
  trailer: '<rect x="2" y="6" width="15" height="9" rx="1"/><path d="M17 13h5"/><circle cx="9" cy="17.5" r="2.5"/>',
  boat: '<path d="M2 20c2 1 4 1 6 0s4-1 6 0 4 1 6 0"/><path d="M3 15h18l-2 4H5z"/><path d="M12 15V3l6 9h-6"/>',
};
const KIND_ICON = { car: 'car', suv: 'suv', van: 'van', truck: 'truck', motorcycle: 'moto', atv: 'atv', mower: 'mower', snowblower: 'snow',
  generator: 'gen', small_engine: 'can', trailer: 'trailer', boat: 'boat', other: 'box' };
const KIND_CLASS = { car: 'k-vehicle', suv: 'k-vehicle', van: 'k-vehicle', truck: 'k-truck', motorcycle: 'k-moto', atv: 'k-moto', mower: 'k-equipment',
  small_engine: 'k-equipment', snowblower: 'k-snow', generator: 'k-power', boat: 'k-water', trailer: 'k-other', other: 'k-other' };
const SECTION_ICON = { parts: 'box', fluids: 'drop', fasteners: 'nut', tires: 'tire', bulbs: 'bulb', belts: 'belt', electrical: 'battery', custom: 'note' };
const UNIT_SHORT = { mi: 'mi', km: 'km', hr: 'hrs', none: '' };

// ------------------------------------------------------------------ html helpers
class Raw { constructor(s) { this.s = s; } toString() { return this.s; } }
const raw = s => new Raw(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const val = v => v instanceof Raw ? v.s : Array.isArray(v) ? v.map(val).join('') : (v == null || v === false) ? '' : esc(v);
const html = (strs, ...vals) => raw(strs.reduce((o, s, i) => o + s + (i < vals.length ? val(vals[i]) : ''), ''));
const icon = (name, cls = '') => raw(`<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true">${ICONS[name] || ICONS.box}</svg>`);
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const main = () => $('#main');

function hl(text, q) {
  const t = esc(text ?? '');
  if (!q) return raw(t);
  const re = new RegExp(esc(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
  return raw(t.replace(re, m => `<mark>${m}</mark>`));
}

// ------------------------------------------------------------------ formatting
const pad = n => String(n).padStart(2, '0');
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`; };
const parseDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const fmtDate = (s, o = { month: 'short', day: 'numeric', year: 'numeric' }) => s ? parseDate(s).toLocaleDateString(undefined, o) : '';
const fmtNum = (n, dec = 1) => n == null || n === '' ? '' : Number(n).toLocaleString(undefined, { maximumFractionDigits: dec });
const money = n => n == null || n === '' ? '' : Number(n).toLocaleString(undefined, { style: 'currency', currency: 'USD' });
const fmtReading = (v, u) => v == null || u === 'none' ? '' : `${fmtNum(v, u === 'hr' ? 1 : 0)} ${UNIT_SHORT[u] || ''}`.trim();
const readingLabel = u => u === 'hr' ? 'Hour meter' : u === 'none' ? '' : 'Odometer';
const fmtSize = b => b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(0)} KB` : `${(b / 1048576).toFixed(1)} MB`;
const plural = (n, w) => `${n} ${w}${n === 1 ? '' : (w.endsWith('y') ? 'ies' : 's')}`.replace(/yies$/, 'ies');
const monthsText = m => m % 12 === 0 ? (m === 12 ? 'year' : `${m / 12} years`) : (m === 1 ? 'month' : `${m} months`);

function everyText(t, unit) {
  const parts = [];
  if (t.every_dist && unit !== 'none') parts.push(`${fmtNum(t.every_dist, 1)} ${UNIT_SHORT[unit]}`);
  if (t.every_months) parts.push(monthsText(t.every_months));
  return parts.length ? 'Every ' + parts.join(' or ') : '—';
}
function daysText(d) {
  const a = Math.abs(d);
  const s = a < 45 ? `${a} day${a === 1 ? '' : 's'}` : a < 540 ? `${Math.round(a / 30.4)} months` : `${(a / 365).toFixed(1)} years`;
  return d < 0 ? `${s} overdue` : d === 0 ? 'today' : `in ${s}`;
}
function dueText(t, unit) {
  if (t.status === 'never') return raw('<span class="faint">Log it once to start tracking</span>');
  const bits = [];
  if (t.due_reading != null && unit !== 'none') {
    let s = `at ${fmtReading(t.due_reading, unit)}`;
    if (t.remaining != null) s += t.remaining <= 0 ? ` (${fmtReading(-t.remaining, unit)} over)` : ` (${fmtReading(t.remaining, unit)} to go)`;
    bits.push(s);
  }
  if (t.due_date) bits.push(`${fmtDate(t.due_date)} · ${daysText(t.days_left)}`);
  return bits.join(' or ') || '—';
}
function dueFraction(t) {
  let f = 0;
  if (t.remaining != null && t.every_dist) f = Math.max(f, 1 - t.remaining / t.every_dist);
  if (t.days_left != null && t.every_months) f = Math.max(f, 1 - t.days_left / (t.every_months * 30.44));
  return Math.min(1, Math.max(0.03, f));
}
const STATUS_LABEL = { overdue: 'Overdue', soon: 'Due soon', ok: 'OK', never: 'No record' };
const pill = s => html`<span class="pill ${s}">${STATUS_LABEL[s]}</span>`;

// ------------------------------------------------------------------ state & api
const S = { meta: null, assets: [], asset: null, editing: {}, logIndex: {}, logsAll: null, guides: null };

async function api(path, { method = 'GET', body, rawBody, type } = {}) {
  const o = { method, headers: {} };
  if (rawBody !== undefined) { o.body = rawBody; o.headers['Content-Type'] = type || 'application/octet-stream'; }
  else if (body !== undefined) { o.body = JSON.stringify(body); o.headers['Content-Type'] = 'application/json'; }
  const r = await fetch(path, o);
  if (!r.ok) {
    let msg = `${r.status} ${r.statusText}`;
    try { const j = await r.json(); if (j.detail) msg = typeof j.detail === 'string' ? j.detail : JSON.stringify(j.detail); } catch (e) { /* not json */ }
    throw new Error(msg);
  }
  return r.json();
}
const GET = p => api(p);
const POST = (p, b) => api(p, { method: 'POST', body: b ?? {} });
const PUT = (p, b) => api(p, { method: 'PUT', body: b });
const DEL = p => api(p, { method: 'DELETE' });
const uploadFile = (file, params = {}) => {
  const q = new URLSearchParams({ name: file.name });
  for (const [k, v] of Object.entries(params)) if (v != null && v !== '') q.set(k, v);
  return api(`/api/files?${q}`, { method: 'POST', rawBody: file, type: file.type || 'application/octet-stream' });
};

const kindMeta = k => S.meta.kinds.find(x => x.key === k) || S.meta.kinds.find(x => x.key === 'other');
const kindLabel = k => kindMeta(k).label;
const isVehicle = k => kindMeta(k).group === 'vehicle';

function avatar(a, cls = '') {
  return html`<span class="avatar ${KIND_CLASS[a.kind || a.asset_kind] || 'k-other'} ${cls}">${a.photo_url ? html`<img src="${a.photo_url}" alt="">` : icon(KIND_ICON[a.kind || a.asset_kind] || 'box')}</span>`;
}

// ------------------------------------------------------------------ ui primitives
function toast(msg, err = false) {
  const el = document.createElement('div');
  el.className = 'toast' + (err ? ' err' : '');
  el.innerHTML = html`${icon(err ? 'alert' : 'check')}${msg}`.s;
  $('#toasts').append(el);
  setTimeout(() => el.remove(), err ? 5000 : 2200);
}
const fail = e => { console.error(e); toast(e.message || String(e), true); };

let modalStack = [];
function modal({ title, body, foot = '', cls = '' }) {
  const bg = document.createElement('div');
  bg.className = 'modal-bg';
  bg.innerHTML = html`<div class="modal ${cls}" role="dialog" aria-modal="true">
    <div class="modal-head"><h2>${title}</h2><button class="btn ghost icon" data-close title="Close">${icon('x')}</button></div>
    <div class="modal-body">${body}</div>${foot ? html`<div class="modal-foot">${foot}</div>` : ''}</div>`.s;
  let downOnBg = false;
  bg.addEventListener('mousedown', e => { downOnBg = e.target === bg; });
  bg.addEventListener('click', e => { if ((e.target === bg && downOnBg) || e.target.closest('[data-close]')) close(); });
  const close = () => { bg.remove(); modalStack = modalStack.filter(m => m !== bg); };
  document.body.append(bg);
  modalStack.push(bg);
  setTimeout(() => { const f = $('[autofocus]', bg) || $('input:not([type=checkbox]):not([type=file]), textarea, select', bg); if (f && window.innerWidth > 860) f.focus(); }, 30);
  return { el: bg, close };
}
function confirmBox(message, okLabel = 'Delete', danger = true) {
  return new Promise(resolve => {
    const m = modal({
      title: 'Are you sure?', cls: 'narrow', body: html`<p style="margin:0">${message}</p>`,
      foot: html`<div class="r"><button class="btn" data-close>Cancel</button><button class="btn ${danger ? 'danger' : 'primary'}" data-ok>${okLabel}</button></div>`,
    });
    let done = false;
    $('[data-ok]', m.el).onclick = () => { done = true; m.close(); resolve(true); };
    const obs = new MutationObserver(() => { if (!m.el.isConnected) { obs.disconnect(); if (!done) resolve(false); } });
    obs.observe(document.body, { childList: true });
  });
}
async function copyText(t) {
  try { await navigator.clipboard.writeText(t); }
  catch (e) {
    const ta = document.createElement('textarea');
    ta.value = t; ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.append(ta); ta.select(); document.execCommand('copy'); ta.remove();
  }
  toast(`Copied ${t.length > 40 ? 'to clipboard' : t}`);
}
function pickFiles({ multiple = true, accept = '' } = {}) {
  return new Promise(resolve => {
    const inp = document.createElement('input');
    inp.type = 'file'; inp.multiple = multiple; if (accept) inp.accept = accept;
    inp.onchange = () => resolve([...inp.files]);
    inp.click();
  });
}
function formData(form) {
  const o = {};
  for (const el of form.elements) {
    if (!el.name) continue;
    if (el.type === 'checkbox') { if (el.dataset.multi) { (o[el.name] ||= []); if (el.checked) o[el.name].push(el.value); } else o[el.name] = el.checked; }
    else o[el.name] = el.value;
  }
  return o;
}

// ------------------------------------------------------------------ router
function route() {
  const h = location.hash.slice(1) || '/';
  const [path, qs] = h.split('?');
  return { parts: path.split('/').filter(Boolean), q: new URLSearchParams(qs || '') };
}
let lastPath = null;
async function render() {
  const { parts, q } = route();
  const path = parts.slice(0, 2).join('/');
  if (path !== lastPath) { window.scrollTo(0, 0); modalStack.slice().forEach(m => m.remove()); modalStack = []; $('.lightbox')?.remove(); if (parts[0] !== 'asset') S.asset = null; S.editing = {}; }
  lastPath = path;
  const nav = parts[0] === 'log' ? 'log' : parts[0] === 'guides' || parts[0] === 'guide' ? 'guides' : parts[0] === 'search' ? 'search' : parts.length ? '' : 'garage';
  $$('[data-nav]').forEach(a => a.classList.toggle('active', a.dataset.nav === nav));
  try {
    if (!parts.length) await pageGarage();
    else if (parts[0] === 'asset') await pageAsset(+parts[1], parts[2] || 'specs');
    else if (parts[0] === 'log') await pageLog();
    else if (parts[0] === 'guides') await pageGuides();
    else if (parts[0] === 'guide' && parts[1] === 'new') await pageGuideEdit(null, q.get('asset'));
    else if (parts[0] === 'guide' && parts[2] === 'edit') await pageGuideEdit(+parts[1]);
    else if (parts[0] === 'guide') await pageGuide(+parts[1]);
    else if (parts[0] === 'search') await pageSearch(q.get('q') || '');
    else main().innerHTML = html`<div class="page"><div class="empty"><h3>Page not found</h3><p><a class="btn" href="#/">Back to the garage</a></p></div></div>`.s;
  } catch (e) {
    console.error(e);
    main().innerHTML = html`<div class="page"><div class="card empty">${icon('alert')}<h3>Something went wrong</h3><p>${e.message}</p><a class="btn" href="#/">Back to the garage</a></div></div>`.s;
  }
  loadSidebar();
}
async function refresh() { S.asset = null; S.logsAll = null; S.guides = null; await render(); }

async function loadSidebar() {
  try { S.assets = await GET('/api/assets'); } catch (e) { return; }
  const { parts } = route();
  const cur = parts[0] === 'asset' ? +parts[1] : null;
  const active = S.assets.filter(a => !a.archived);
  $('#side-assets').innerHTML = html`${active.map(a => {
    const st = a.overdue ? 'overdue' : a.soon ? 'soon' : '';
    return html`<a class="nav-asset ${cur === a.id ? 'active' : ''}" href="#/asset/${a.id}">${icon(KIND_ICON[a.kind])}<span>${a.name}</span>${st ? html`<span class="dot ${st}" title="${a.overdue ? a.overdue + ' overdue' : a.soon + ' due soon'}"></span>` : ''}</a>`;
  })}<a class="nav-asset" href="#" data-act="asset-new" style="color:var(--side-muted)">${icon('plus')}<span>Add new</span></a>`.s;
  const due = active.reduce((n, a) => n + a.overdue, 0);
  for (const id of ['#nav-due', '#nav-due-m']) { const el = $(id); el.textContent = due; el.classList.toggle('hidden', !due); }
}

// ------------------------------------------------------------------ garage (dashboard)
async function pageGarage() {
  const d = await GET('/api/dashboard');
  const active = d.assets.filter(a => !a.archived);
  const archived = d.assets.filter(a => a.archived);
  const overdue = d.attention.filter(t => t.status === 'overdue').length;
  const soon = d.attention.length - overdue;
  d.recent.forEach(l => { S.logIndex[l.id] = l; });
  const stat = (c, ic, v, l) => html`<div class="card stat"><div class="stat-icon ${c}">${icon(ic)}</div><div><div class="v">${v}</div><div class="l">${l}</div></div></div>`;
  main().innerHTML = html`<div class="page">
    <div class="page-head">
      <div><h1>Garage</h1><div class="sub">${active.length ? `${active.length} vehicle${active.length === 1 ? '' : 's'} & machines` : 'Everything with an engine, in one place'}</div></div>
      <div class="actions">
        ${active.length ? html`<button class="btn" data-act="log-new">${icon('clipboard')} Log service</button>` : ''}
        <button class="btn primary" data-act="asset-new">${icon('plus')} Add vehicle or equipment</button>
      </div>
    </div>
    ${active.length ? html`
    <div class="stats">
      ${stat('a', 'wrench', active.length, 'In the garage')}
      ${stat(overdue ? 'r' : 'g', overdue ? 'alert' : 'check', overdue, overdue === 1 ? 'Overdue item' : 'Overdue items')}
      ${stat('y', 'clock', soon, 'Coming up soon')}
      ${stat('b', 'dollar', money(d.spend_year), `Spent in ${d.year} · ${d.jobs_year} job${d.jobs_year === 1 ? '' : 's'}`)}
    </div>` : ''}
    ${d.attention.length ? html`
      <div class="section-title"><h2>Needs attention</h2></div>
      <div class="card list">${d.attention.map(t => html`
        <div class="row">
          <a href="#/asset/${t.asset_id}/schedule">${avatar({ kind: t.asset_kind })}</a>
          <a class="grow" href="#/asset/${t.asset_id}/schedule"><div class="t">${t.name}</div><div class="s">${t.asset_name} · ${dueText(t, t.usage_unit)}</div></a>
          ${pill(t.status)}
          <button class="btn sm" data-act="log-task" data-asset="${t.asset_id}" data-task="${t.id}">${icon('check')}<span class="hide-sm">Log it</span></button>
        </div>`)}</div>` : ''}
    <div class="section-title"><h2>Vehicles & equipment</h2></div>
    <div class="fleet">
      ${active.map(assetCard)}
      <div class="card asset-card add" data-act="asset-new">${icon('plus')}<div style="font-weight:600;margin-top:6px">Add vehicle or equipment</div><div class="faint" style="font-size:13px">Car, truck, mower, snowblower…</div></div>
    </div>
    ${d.recent.length ? html`
      <div class="section-title"><h2>Recent work</h2><div class="actions"><a class="btn sm ghost" href="#/log">View all</a></div></div>
      <div class="card list">${d.recent.map(l => html`
        <div class="row click" data-act="log-edit" data-id="${l.id}">
          <div class="grow"><div class="t">${l.title}</div><div class="s">${l.asset_name} · ${fmtDate(l.date)}${l.reading != null ? ' · ' + fmtReading(l.reading, l.usage_unit) : ''}</div></div>
          ${l.category ? html`<span class="pill cat hide-sm">${l.category}</span>` : ''}
          <span class="cost">${money(l.cost)}</span>
        </div>`)}</div>` : ''}
    ${archived.length ? html`
      <div class="section-title"><h2 class="muted">Archived</h2></div>
      <div class="fleet">${archived.map(assetCard)}</div>` : ''}
  </div>`.s;
}
function assetCard(a) {
  const st = a.overdue ? html`<span class="pill overdue">${a.overdue} overdue</span>` : a.soon ? html`<span class="pill soon">${a.soon} due soon</span>`
    : a.task_count && a.never < a.task_count ? html`<span class="pill ok">${icon('check')} Up to date</span>` : '';
  return html`<a class="card asset-card ${a.archived ? 'archived-card' : ''}" href="#/asset/${a.id}">
    <div class="cover ${KIND_CLASS[a.kind]}">${a.photo_url ? html`<img src="${a.photo_url}" alt="" loading="lazy">` : icon(KIND_ICON[a.kind])}<span class="badge-float">${st}</span></div>
    <div class="info">
      <div class="name">${a.name}</div>
      <div class="meta">${a.title || kindLabel(a.kind)}</div>
      <div class="foot">${a.usage_unit !== 'none' ? html`${icon('gauge')}<span>${fmtReading(a.current_reading, a.usage_unit) || '—'}</span>` : html`${icon('clipboard')}<span>${plural(a.log_count, 'entry')}</span>`}
        <span class="r">${a.last_service ? `Last: ${fmtDate(a.last_service.date, { month: 'short', year: 'numeric' })}` : 'No service yet'}</span></div>
    </div></a>`;
}

// ------------------------------------------------------------------ asset page
async function pageAsset(id, tab) {
  if (!S.asset || S.asset.id !== id) S.asset = await GET(`/api/assets/${id}`);
  const a = S.asset;
  a.logs.forEach(l => { S.logIndex[l.id] = l; });
  document.title = `${a.name} · Wrenchbook`;
  const tabs = [
    ['specs', 'Spec sheet', 'list', a.sections.length],
    ['log', 'Service log', 'clipboard', a.logs.length],
    ['schedule', 'Schedule', 'schedule', a.overdue || a.tasks.length, a.overdue ? 'bad' : ''],
    ['guides', 'Guides', 'book', a.guides.length],
    ['files', 'Files', 'image', a.files.length],
  ];
  const facts = [];
  if (a.vin) facts.push(html`<div class="fact"><span class="l">${isVehicle(a.kind) ? 'VIN' : 'Serial'}</span><span class="v mono">${a.vin}<button class="btn ghost sm icon" data-act="copy" data-v="${a.vin}" title="Copy">${icon('copy')}</button></span></div>`);
  if (a.plate) facts.push(html`<div class="fact"><span class="l">Plate</span><span class="v mono">${a.plate}</span></div>`);
  if (a.color) facts.push(html`<div class="fact"><span class="l">Color</span><span class="v">${a.color}</span></div>`);
  if (a.location) facts.push(html`<div class="fact"><span class="l">Kept at</span><span class="v">${a.location}</span></div>`);
  if (a.purchase_date) facts.push(html`<div class="fact"><span class="l">Owned since</span><span class="v">${fmtDate(a.purchase_date, { month: 'short', year: 'numeric' })}</span></div>`);
  main().innerHTML = html`<div class="page">
    <div class="card hero">
      <div class="hero-img ${KIND_CLASS[a.kind]}" data-act="photo-pick" title="Change photo">${a.photo_url ? html`<img src="${a.photo_url}" alt="">` : icon(KIND_ICON[a.kind])}<div class="change">${a.photo_url ? 'Change' : 'Add'} photo</div></div>
      <div class="hero-main">
        <h1>${a.name}${a.archived ? html` <span class="pill plain">Archived</span>` : ''}</h1>
        <div class="sub">${[a.title, a.engine].filter(Boolean).join(' · ') || kindLabel(a.kind)}</div>
        ${facts.length ? html`<div class="facts">${facts}</div>` : ''}
      </div>
      <div class="hero-side">
        ${a.usage_unit !== 'none' ? html`<div class="reading-box" data-act="reading" title="Update reading"><div class="l">${readingLabel(a.usage_unit)}</div><div class="v">${fmtReading(a.current_reading, a.usage_unit) || '—'}</div><div class="l">${a.current_reading == null ? 'Tap to set' : 'Tap to update'}</div></div>` : ''}
        <div style="display:flex;gap:6px">
          <button class="btn primary" data-act="log-new">${icon('plus')} Log service</button>
          <button class="btn icon" data-act="asset-edit" title="Edit details">${icon('edit')}</button>
          <button class="btn icon" data-act="print" title="Print spec sheet">${icon('printer')}</button>
        </div>
      </div>
    </div>
    <nav class="tabs">${tabs.map(([k, l, ic, n, c]) => html`<a href="#/asset/${a.id}/${k}" class="${tab === k ? 'on' : ''}">${icon(ic)}${l}${n ? html`<span class="n ${c || ''}">${n}</span>` : ''}</a>`)}</nav>
    <div id="tab">${({ specs: tabSpecs, log: tabLog, schedule: tabSchedule, guides: tabGuides, files: tabFiles }[tab] || tabSpecs)(a)}</div>
  </div>`.s;
}

// ---- spec sheet
function tabSpecs(a) {
  return html`
    ${a.notes ? html`<div class="callout">${icon('info')}<div class="md">${raw(a.notes_html)}</div></div>` : ''}
    ${a.sections.length ? html`
      <div class="toolbar no-print"><span class="muted tip" style="font-size:13px">${icon('copy')}Tap any value to copy it, handy at the parts counter.</span>
        <div style="margin-left:auto;display:flex;gap:8px"><button class="btn" data-act="ai-fill">${icon('sparkle')} Fill with AI</button><button class="btn" data-act="section-add">${icon('plus')} Add section</button></div></div>
      <div class="specs">${a.sections.map(sectionCard)}</div>`
    : html`<div class="card empty">${icon('list')}<h3>No spec sheet yet</h3><p>Record fluids, part numbers, socket sizes, tire sizes and bulbs: everything you look up when you're elbow-deep in the job.</p>
        <div style="display:flex;gap:8px;justify-content:center"><button class="btn" data-act="section-add">${icon('plus')} Add a section</button><button class="btn" data-act="apply-template" data-what="sections">Use the ${kindLabel(a.kind).toLowerCase()} template</button><button class="btn primary" data-act="ai-fill">${icon('sparkle')} Fill with AI</button></div></div>`}`;
}
function sectionCard(s) {
  const ed = S.editing[s.id];
  if (ed) return sectionEditor(s, ed);
  return html`<div class="card spec-card" data-sid="${s.id}">
    <div class="card-head"><div class="spec-icon ${s.template}">${icon(SECTION_ICON[s.template] || 'note')}</div><h3>${s.title}</h3>
      <div class="actions no-print">
        <button class="btn ghost sm icon" data-act="section-move" data-dir="up" title="Move up">${icon('up')}</button>
        <button class="btn ghost sm icon" data-act="section-move" data-dir="down" title="Move down">${icon('down')}</button>
        <button class="btn ghost sm icon" data-act="section-edit" title="Edit">${icon('edit')}</button>
      </div></div>
    ${s.rows.length ? html`<table class="spec">
      ${s.columns.length > 2 ? html`<thead><tr>${s.columns.map(c => html`<th>${c}</th>`)}</tr></thead>` : ''}
      <tbody>${s.rows.map(r => html`<tr>${r.map((c, i) => i === 0 ? html`<td>${c}</td>`
        : c ? html`<td class="copy" data-act="copy" data-v="${c}">${c}</td>` : html`<td class="blank">—</td>`)}</tr>`)}</tbody></table>`
      : html`<div class="card-body muted">Nothing here yet. <a href="#" data-act="section-edit" style="color:var(--accent-text)">Add some rows</a></div>`}
    ${s.note ? html`<div class="spec-note">${s.note}</div>` : ''}
  </div>`;
}
function sectionEditor(s, ed) {
  const nc = ed.columns.length;
  return html`<div class="card spec-card editing" data-sid="${s.id}">
    <div class="card-head"><div class="spec-icon ${s.template}">${icon(SECTION_ICON[s.template] || 'note')}</div>
      <input class="input" data-sedit="title" value="${ed.title}" placeholder="Section title" style="font-weight:650"></div>
    <div class="card-body"><div class="table-wrap"><table class="sheet-edit">
      <thead><tr>${ed.columns.map((c, ci) => html`<th><div style="display:flex;gap:2px"><input data-sedit="col" data-c="${ci}" value="${c}" placeholder="Column">${nc > 1 ? html`<button class="btn ghost sm icon" data-act="scol-del" data-c="${ci}" title="Remove column">${icon('x')}</button>` : ''}</div></th>`)}
        <th class="ops"><button class="btn ghost sm" data-act="scol-add" title="Add column">${icon('plus')}col</button></th></tr></thead>
      <tbody>${ed.rows.map((r, ri) => html`<tr>${r.map((v, ci) => html`<td><input data-sedit="cell" data-r="${ri}" data-c="${ci}" value="${v}"></td>`)}
        <td class="ops"><button class="btn ghost sm icon" data-act="srow-move" data-r="${ri}" data-dir="up" title="Move up">${icon('up')}</button><button class="btn ghost sm icon" data-act="srow-move" data-r="${ri}" data-dir="down" title="Move down">${icon('down')}</button><button class="btn ghost sm icon" data-act="srow-del" data-r="${ri}" title="Remove row">${icon('trash')}</button></td></tr>`)}</tbody>
    </table></div>
    <label class="field" style="margin-top:10px"><span>Note (optional)</span><input data-sedit="note" value="${ed.note}" placeholder="e.g. Use OEM filters only"></label>
    </div>
    <div class="edit-foot">
      <button class="btn sm" data-act="srow-add">${icon('plus')} Add row</button>
      <div class="r"><button class="btn sm danger" data-act="section-del">${icon('trash')} Delete</button><button class="btn sm" data-act="section-cancel">Cancel</button><button class="btn sm primary" data-act="section-save">${icon('check')} Save</button></div>
    </div></div>`;
}
function rerenderSection(sid, focusSel) {
  const s = S.asset.sections.find(x => x.id === sid);
  const card = $(`.spec-card[data-sid="${sid}"]`);
  if (!s || !card) return;
  card.outerHTML = sectionCard(s).s;
  if (focusSel) { const f = $(`.spec-card[data-sid="${sid}"] ${focusSel}`); if (f) f.focus(); }
}

// ---- service log
function tabLog(a) {
  if (!a.logs.length) return html`<div class="card empty">${icon('clipboard')}<h3>No service history yet</h3><p>Log oil changes, brake jobs, repairs: what was done, at what mileage, with which parts and what it cost.</p><button class="btn primary" data-act="log-new">${icon('plus')} Log the first entry</button></div>`;
  const total = a.logs.reduce((s, l) => s + (l.cost || 0), 0);
  const years = {};
  a.logs.forEach(l => (years[l.date.slice(0, 4)] ||= []).push(l));
  return html`
    <div class="toolbar"><div class="totals" style="margin-left:0"><span><b>${a.logs.length}</b> ${a.logs.length === 1 ? 'entry' : 'entries'}</span><span><b>${money(total)}</b> all time</span></div>
      <div style="margin-left:auto"><button class="btn primary" data-act="log-new">${icon('plus')} Log service</button></div></div>
    ${Object.keys(years).sort().reverse().map(y => html`
      <div class="year-head"><h3>${y}</h3><span class="muted">${plural(years[y].length, 'entry')} · ${money(years[y].reduce((s, l) => s + (l.cost || 0), 0))}</span></div>
      <div class="timeline">${years[y].map(l => entryCard(l, a.usage_unit))}</div>`)}`;
}
function entryCard(l, unit, assetName) {
  const d = parseDate(l.date);
  const imgs = (l.files || []).filter(f => f.is_image), docs = (l.files || []).filter(f => !f.is_image);
  return html`<div class="card entry">
    <div class="entry-date"><div class="m">${d.toLocaleDateString(undefined, { month: 'short' })}</div><div class="d">${d.getDate()}</div><div class="y">${d.getFullYear()}</div></div>
    <div class="entry-body">
      <div class="entry-top">
        <div style="min-width:0"><h4>${l.title}</h4>
          <div class="entry-meta">
            ${l.category ? html`<span class="pill cat">${l.category}</span>` : ''}
            ${assetName ? html`<span>${icon('car')}${assetName}</span>` : ''}
            ${l.reading != null && unit !== 'none' ? html`<span>${icon('gauge')}${fmtReading(l.reading, unit)}</span>` : ''}
            ${l.performed_by ? html`<span>${icon('user')}${l.performed_by}</span>` : ''}
          </div></div>
        <div class="r">${l.cost != null ? html`<span class="cost">${money(l.cost)}</span>` : ''}<button class="btn ghost sm icon" data-act="log-edit" data-id="${l.id}" title="Edit">${icon('edit')}</button></div>
      </div>
      ${l.parts.length ? html`<div class="parts-mini">${l.parts.map(p => html`<div><span>${p.name || '—'}</span><span class="mono muted">${p.number}</span><span class="q">${p.qty ? '×' + p.qty : ''}</span><span>${money(p.cost)}</span></div>`)}</div>` : ''}
      ${l.notes ? html`<div class="md" style="margin-top:10px">${raw(l.notes_html)}</div>` : ''}
      ${imgs.length || docs.length ? html`<div class="thumbs">${imgs.map(f => html`<button class="thumb" data-act="lightbox" data-src="${f.url}" title="${f.name}"><img src="${f.url}" alt="" loading="lazy"></button>`)}${docs.map(f => html`<a class="thumb file" href="${f.url}" target="_blank" title="${f.name}">${icon('file')}<span>${f.name}</span></a>`)}</div>` : ''}
    </div></div>`;
}

// ---- schedule
function tabSchedule(a) {
  const kt = kindMeta(a.kind).tasks;
  if (!a.tasks.length) return html`<div class="card empty">${icon('schedule')}<h3>No service intervals yet</h3><p>Set intervals like "oil every 5,000 mi or 6 months" and Wrenchbook will tell you when each one is due, based on your service log.</p>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap"><button class="btn" data-act="task-new">${icon('plus')} Add interval</button>${kt.length ? html`<button class="btn primary" data-act="apply-template" data-what="tasks">Use ${kindLabel(a.kind).toLowerCase()} suggestions</button>` : ''}</div></div>`;
  const order = { overdue: 0, soon: 1, never: 2, ok: 3 };
  const tasks = [...a.tasks].sort((x, y) => order[x.status] - order[y.status]);
  return html`
    <div class="toolbar"><span class="muted" style="font-size:13px">Each interval is due at whichever limit comes first. Logging an entry against a task resets it.</span>
      <div style="margin-left:auto"><button class="btn" data-act="task-new">${icon('plus')} Add interval</button></div></div>
    <div class="card"><div class="table-wrap"><table class="data">
      <thead><tr><th>Task</th><th class="hide-sm">Interval</th><th>Last done</th><th>Next due</th><th></th></tr></thead>
      <tbody>${tasks.map(t => html`<tr>
        <td><div class="task-name">${t.name}</div><div class="task-sub">${t.category ? html`<span>${t.category}</span>` : ''}${t.guide_id ? html`<a href="#/guide/${t.guide_id}">${icon('book')}How-to</a>` : ''}</div></td>
        <td class="hide-sm nowrap">${everyText(t, a.usage_unit)}</td>
        <td class="nowrap">${t.last ? html`${fmtDate(t.last.date)}${t.last.reading != null && a.usage_unit !== 'none' ? html`<div class="task-sub">${fmtReading(t.last.reading, a.usage_unit)}</div>` : ''}` : html`<span class="faint">Never logged</span>`}</td>
        <td>${pill(t.status)}<div class="task-sub" style="margin-top:3px">${dueText(t, a.usage_unit)}</div>${t.status !== 'never' ? html`<div class="progress ${t.status}"><div style="width:${Math.round(dueFraction(t) * 100)}%"></div></div>` : ''}</td>
        <td class="nowrap" style="text-align:right"><button class="btn sm" data-act="log-task" data-asset="${a.id}" data-task="${t.id}">${icon('check')}<span class="hide-sm">Log it</span></button> <button class="btn ghost sm icon" data-act="task-edit" data-id="${t.id}" title="Edit">${icon('edit')}</button></td>
      </tr>`)}</tbody></table></div></div>`;
}

// ---- guides
function guideCard(g) {
  return html`<a class="card guide-card" href="#/guide/${g.id}">
    <h3>${icon('book')}<span>${g.title}</span></h3>
    ${g.summary ? html`<p>${g.summary}</p>` : ''}
    <div class="tags">
      ${g.difficulty ? html`<span class="pill plain">${g.difficulty}</span>` : ''}
      ${g.duration ? html`<span class="pill plain">${icon('clock')}${g.duration}</span>` : ''}
      ${g.assets.length ? g.assets.map(a => html`<span class="pill cat">${a.name}</span>`) : html`<span class="pill plain">General</span>`}
    </div></a>`;
}
function tabGuides(a) {
  const head = html`<div class="toolbar"><span class="muted" style="font-size:13px">Step-by-step how-tos for this ${isVehicle(a.kind) ? 'vehicle' : 'machine'}, plus general guides.</span>
    <div style="margin-left:auto"><a class="btn primary" href="#/guide/new?asset=${a.id}">${icon('plus')} New guide</a></div></div>`;
  if (!a.guides.length) return html`<div class="card empty">${icon('book')}<h3>No guides yet</h3><p>Write down how you did the job: steps, torque specs, gotchas, photos, so next time it takes half as long.</p><a class="btn primary" href="#/guide/new?asset=${a.id}">${icon('plus')} Write a guide</a></div>`;
  return html`${head}<div class="guides">${a.guides.map(guideCard)}</div>`;
}

// ---- files
function tabFiles(a) {
  return html`
    <div class="drop" data-act="file-pick">${icon('upload')}<div style="font-weight:600;margin-top:4px">Drop photos, receipts or manuals here</div><div style="font-size:13px">or click to choose files</div></div>
    ${a.files.length ? html`<div class="files">${a.files.map(f => fileTile(f, a))}</div>` : ''}`;
}
function fileTile(f, a) {
  const log = f.log_id && a.logs.find(l => l.id === f.log_id);
  return html`<div class="card file-tile">
    <div class="prev" ${f.is_image ? raw(`data-act="lightbox" data-src="${esc(f.url)}" style="cursor:zoom-in"`) : ''}>${f.is_image ? html`<img src="${f.url}" alt="" loading="lazy">` : html`<a href="${f.url}" target="_blank" style="display:grid;place-items:center;width:100%;height:100%">${icon('file')}</a>`}</div>
    <div class="fi"><div class="fn" title="${f.name}">${f.caption || f.name}</div><div class="faint">${log ? `Service: ${log.title}` : fmtSize(f.size)}${a.photo_id === f.id ? ' · Cover photo' : ''}</div></div>
    <div class="fo">
      ${f.is_image && a.photo_id !== f.id ? html`<button class="btn ghost sm icon" data-act="file-cover" data-id="${f.id}" title="Use as cover photo">${icon('image')}</button>` : ''}
      <button class="btn ghost sm icon" data-act="file-caption" data-id="${f.id}" title="Rename / caption">${icon('edit')}</button>
      <a class="btn ghost sm icon" href="${f.url}?download=1" title="Download">${icon('download')}</a>
      <button class="btn ghost sm icon" data-act="file-del" data-id="${f.id}" title="Delete" style="margin-left:auto">${icon('trash')}</button>
    </div></div>`;
}
async function uploadAssetFiles(files) {
  if (!files.length) return;
  const a = S.asset;
  try {
    for (const f of files) await uploadFile(f, { asset_id: a.id });
    toast(`Uploaded ${files.length} file${files.length === 1 ? '' : 's'}`);
  } catch (e) { fail(e); }
  await refresh();
}

// ------------------------------------------------------------------ asset form
function openAssetForm(a = null) {
  const isNew = !a;
  a = a || { kind: 'car', usage_unit: 'mi' };
  let kind = a.kind;
  let unitTouched = !isNew;
  const kinds = S.meta.kinds;
  const f = (name, label, attrs = '', c = 'c2') => html`<label class="field ${c}"><span>${label}</span><input name="${name}" value="${a[name] ?? ''}" ${raw(attrs)}></label>`;
  const m = modal({
    title: isNew ? 'Add vehicle or equipment' : `Edit ${a.name}`, cls: 'wide',
    body: html`<form id="asset-form" autocomplete="off">
      <div class="sub-head" style="margin-top:4px">What is it?</div>
      <div class="kind-grid">${kinds.map(k => html`<button type="button" class="kind-opt ${k.key === kind ? 'on' : ''}" data-kind="${k.key}">${icon(KIND_ICON[k.key])}${k.label}</button>`)}</div>
      <div class="sub-head">Details</div>
      <div class="grid-form">
        <div class="field c3"><span id="vin-label">${isVehicle(kind) ? 'VIN' : 'Model / serial number'}</span>
          <div style="display:flex;gap:6px"><input name="vin" value="${a.vin ?? ''}" class="mono" style="text-transform:uppercase" placeholder="${isVehicle(kind) ? '17 characters' : ''}">
          <button type="button" class="btn ${isNew ? 'primary' : ''} ${isVehicle(kind) ? '' : 'hidden'}" id="vin-decode" title="Look up year, make, model and engine from NHTSA">${icon('search')} Decode</button></div></div>
        ${f('name', 'Name *', 'required placeholder="e.g. Odyssey, Toro mower"', 'c3')}
        <div class="c6 hidden" id="vin-info"></div>
        ${f('year', 'Year', 'inputmode="numeric" placeholder="2024"', '')}
        ${f('make', 'Make', 'placeholder="Honda"')}
        ${f('model', 'Model', 'placeholder="Odyssey"')}
        ${f('color', 'Color', '', '')}
        ${f('trim', 'Trim / model number', 'placeholder="Touring"')}
        ${f('engine', 'Engine', 'placeholder="3.5L V6 J35Y7"', 'c4')}
        ${f('plate', 'License plate')}
        <label class="field c2"><span>Track usage by</span><select name="usage_unit">${Object.entries(S.meta.units).map(([k, l]) => html`<option value="${k}" ${a.usage_unit === k ? 'selected' : ''}>${l}</option>`)}</select></label>
        ${f('purchase_reading', 'Reading when acquired', 'inputmode="decimal"')}
        ${f('purchase_date', 'Acquired on', 'type="date"')}
        ${f('purchase_price', 'Purchase price', 'inputmode="decimal" placeholder="$"')}
        ${f('location', 'Kept at', 'placeholder="Garage, shed…"')}
        <label class="field c6"><span>Notes</span><textarea name="notes" rows="3" placeholder="Shown at the top of the spec sheet, e.g. 'Use only OEM filters.' Markdown works.">${a.notes ?? ''}</textarea></label>
        ${isNew ? html`<label class="check c6"><input type="checkbox" name="template" checked><span>Start with the <b id="tpl-kind">${kindLabel(kind).toLowerCase()}</b> template: spec sheet sections and suggested service intervals you can edit</span></label>` : ''}
      </div></form>`,
    foot: html`${!isNew ? html`<button class="btn danger" data-act-local="delete">${icon('trash')} Delete</button><button class="btn" data-act-local="archive">${icon('archive')} ${a.archived ? 'Unarchive' : 'Archive'}</button>` : ''}
      <div class="r"><button class="btn" data-close>Cancel</button><button class="btn primary" data-act-local="save">${icon('check')} ${isNew ? 'Add' : 'Save'}</button></div>`,
  });
  const form = $('#asset-form', m.el);
  $('[name=usage_unit]', form).onchange = () => { unitTouched = true; };
  $$('.kind-opt', m.el).forEach(b => b.onclick = () => {
    kind = b.dataset.kind;
    $$('.kind-opt', m.el).forEach(x => x.classList.toggle('on', x === b));
    $('#vin-label', m.el).textContent = isVehicle(kind) ? 'VIN' : 'Model / serial number';
    $('#vin-decode', m.el).classList.toggle('hidden', !isVehicle(kind));
    if (!unitTouched) $('[name=usage_unit]', form).value = kindMeta(kind).unit;
    const t = $('#tpl-kind', m.el); if (t) t.textContent = kindLabel(kind).toLowerCase();
  });
  const decode = async () => {
    const vin = form.vin.value.trim();
    if (!vin) return toast('Enter a VIN first', true);
    const btn = $('#vin-decode', m.el); btn.disabled = true;
    try {
      const r = await GET(`/api/vin/${encodeURIComponent(vin)}`);
      form.vin.value = r.vin;
      for (const [k, v] of Object.entries(r.fields)) if (v) form[k].value = v;
      if (!form.name.value.trim()) form.name.value = r.fields.model || r.fields.make;
      if (isNew && r.kind !== kind) $(`.kind-opt[data-kind="${r.kind}"]`, m.el)?.click();
      const info = $('#vin-info', m.el);
      info.innerHTML = html`<div class="callout" style="margin:0">${icon(r.warning ? 'alert' : 'check')}<div>
        <b>${[r.fields.year, r.fields.make, r.fields.model, r.fields.trim].filter(Boolean).join(' ')}</b>
        <div class="muted" style="font-size:13px">${Object.entries(r.details).map(([k, v]) => `${k}: ${v}`).join(' · ')}</div>
        ${r.warning ? html`<div style="font-size:12.5px;color:var(--warn)">NHTSA: ${r.warning}</div>` : ''}</div></div>`.s;
      info.classList.remove('hidden');
    } catch (e) { fail(e); }
    btn.disabled = false;
  };
  $('#vin-decode', m.el).onclick = decode;
  form.vin.addEventListener('keydown', e => { if (e.key === 'Enter' && isVehicle(kind)) { e.preventDefault(); decode(); } });
  const save = async () => {
    if (!form.reportValidity()) return;
    const data = { ...formData(form), kind };
    data.vin = (data.vin || '').toUpperCase();
    try {
      if (isNew) { const r = await POST('/api/assets', data); m.close(); toast('Added'); location.hash = `#/asset/${r.id}`; }
      else { await PUT(`/api/assets/${a.id}`, data); m.close(); toast('Saved'); await refresh(); }
    } catch (e) { fail(e); }
  };
  form.onsubmit = e => { e.preventDefault(); save(); };
  $('[data-act-local=save]', m.el).onclick = save;
  if (!isNew) {
    $('[data-act-local=archive]', m.el).onclick = async () => { await PUT(`/api/assets/${a.id}`, { archived: !a.archived }).catch(fail); m.close(); await refresh(); };
    $('[data-act-local=delete]', m.el).onclick = async () => {
      if (!await confirmBox(html`Delete <b>${a.name}</b> and its entire spec sheet, service history, schedule and files? This can't be undone. Archiving keeps the history instead.`)) return;
      try { await DEL(`/api/assets/${a.id}`); m.close(); toast('Deleted'); location.hash = '#/'; } catch (e) { fail(e); }
    };
  }
}

function openReading(a) {
  const manual = a.readings || [];
  const m = modal({
    title: `Update ${readingLabel(a.usage_unit).toLowerCase()}`, cls: 'narrow',
    body: html`<form id="rd-form"><div class="grid-form">
      <label class="field c3"><span>${readingLabel(a.usage_unit)} (${UNIT_SHORT[a.usage_unit]})</span><input name="value" inputmode="decimal" required autofocus placeholder="${a.current_reading != null ? fmtNum(a.current_reading) : ''}"></label>
      <label class="field c3"><span>Date</span><input type="date" name="date" value="${todayISO()}"></label></div>
      <p class="faint" style="font-size:12.5px;margin:12px 0 0">Readings on service entries count too. The highest one is used as the current reading.</p>
      ${manual.length ? html`<div class="sub-head">History</div><div class="card list">${manual.map(r => html`<div class="row"><div class="grow">${fmtReading(r.value, a.usage_unit)}</div><span class="muted">${fmtDate(r.date)}</span><button type="button" class="btn ghost sm icon" data-rdel="${r.id}" title="Remove">${icon('trash')}</button></div>`)}</div>` : ''}
    </form>`,
    foot: html`<div class="r"><button class="btn" data-close>Cancel</button><button class="btn primary" id="rd-save">${icon('check')} Save</button></div>`,
  });
  const form = $('#rd-form', m.el);
  const save = async () => {
    if (!form.reportValidity()) return;
    try { await POST(`/api/assets/${a.id}/readings`, formData(form)); m.close(); toast('Reading updated'); await refresh(); } catch (e) { fail(e); }
  };
  form.onsubmit = e => { e.preventDefault(); save(); };
  $('#rd-save', m.el).onclick = save;
  $$('[data-rdel]', m.el).forEach(b => b.onclick = async () => { await DEL(`/api/readings/${b.dataset.rdel}`).catch(fail); m.close(); await refresh(); });
}

// ------------------------------------------------------------------ log form
async function pickAsset(title) {
  if (!S.assets.length) S.assets = await GET('/api/assets');
  const list = S.assets.filter(a => !a.archived);
  return new Promise(resolve => {
    const m = modal({
      title, cls: 'narrow',
      body: html`<div class="card list">${list.map(a => html`<div class="row click" data-pick="${a.id}">${avatar(a)}<div class="grow"><div class="t">${a.name}</div><div class="s">${a.title || kindLabel(a.kind)}</div></div>${icon('down', '')}</div>`)}</div>`,
    });
    $$('[data-pick]', m.el).forEach(r => r.onclick = () => { m.close(); resolve(+r.dataset.pick); });
  });
}

async function openLogForm({ asset = null, assetId = null, log = null, taskId = null } = {}) {
  try {
    if (!asset && !assetId && log) assetId = log.asset_id;
    if (!asset && !assetId) { assetId = await pickAsset('Log service for…'); if (!assetId) return; }
    if (!asset) asset = S.asset && S.asset.id === assetId ? S.asset : await GET(`/api/assets/${assetId}`);
  } catch (e) { return fail(e); }
  const a = asset, isNew = !log, unit = a.usage_unit;
  const task = taskId ? a.tasks.find(t => t.id === taskId) : null;
  log = log || { date: todayISO(), title: task ? task.name : '', category: task ? task.category : '', parts: [], task_ids: task ? [task.id] : [], files: [] };
  let parts = log.parts.map(p => ({ ...p }));
  const removedFiles = new Set();
  let newFiles = [];
  // Part names and numbers from the spec sheet, for autocomplete
  const known = [];
  a.sections.filter(s => s.template === 'parts' || s.template === 'belts' || /part/i.test(s.columns.join(' '))).forEach(s => {
    const ni = s.columns.findIndex(c => /number|part ?#|part$/i.test(c) && !/^part$/i.test(c));
    s.rows.forEach(r => known.push({ name: r[0], number: ni > 0 ? r[ni] : (r[1] || '') }));
  });
  const cats = S.meta.categories;
  const m = modal({
    title: isNew ? `Log service · ${a.name}` : `Edit entry · ${a.name}`, cls: 'wide',
    body: html`<form id="log-form" autocomplete="off">
      <div class="grid-form">
        <label class="field c2"><span>Date *</span><input type="date" name="date" value="${log.date}" required></label>
        ${unit !== 'none' ? html`<label class="field c2"><span>${readingLabel(unit)} (${UNIT_SHORT[unit]})</span><input name="reading" inputmode="decimal" value="${log.reading ?? ''}" placeholder="${a.current_reading != null ? 'Last: ' + fmtNum(a.current_reading) : ''}"></label>` : html`<div class="c2"></div>`}
        <label class="field c2"><span>Category</span><input name="category" list="cat-list" value="${log.category}" placeholder="Oil change, Brakes…"></label>
        <label class="field c4"><span>What was done *</span><input name="title" value="${log.title}" placeholder="e.g. Front pads & rotors" ${raw(isNew && !task ? 'autofocus' : '')}></label>
        <label class="field c2"><span>Performed by</span><input name="performed_by" list="by-list" value="${log.performed_by ?? ''}" placeholder="DIY or shop name"></label>
        <label class="field c2"><span>Total cost</span><input name="cost" inputmode="decimal" value="${log.cost ?? ''}" placeholder="Sum of parts if blank"></label>
      </div>
      <datalist id="cat-list">${cats.map(c => html`<option value="${c}">`)}</datalist>
      <datalist id="by-list"><option value="DIY"></datalist>
      <datalist id="part-list">${known.map(p => html`<option value="${p.name}">${p.number}</option>`)}</datalist>
      ${a.tasks.length ? html`<div class="sub-head">${icon('schedule')} Completes scheduled maintenance</div>
        <div class="chips-wrap">${a.tasks.map(t => html`<label class="chip-check"><input type="checkbox" name="task_ids" data-multi="1" value="${t.id}" data-cat="${t.category}" ${log.task_ids.includes(t.id) ? 'checked' : ''}>${t.name}</label>`)}</div>` : ''}
      <div class="sub-head">${icon('box')} Parts used <button type="button" class="btn sm" id="part-add" style="margin-left:auto">${icon('plus')} Add part</button></div>
      <div id="parts-box"></div>
      <div class="sub-head">${icon('note')} Notes</div>
      <label class="field"><textarea name="notes" rows="4" placeholder="Anything worth remembering: torque used, what you found, what to watch next time. Markdown works.">${log.notes ?? ''}</textarea></label>
      <div class="sub-head">${icon('image')} Photos & receipts <button type="button" class="btn sm" id="file-add" style="margin-left:auto">${icon('upload')} Attach</button></div>
      <div class="thumbs" id="log-files"></div>
    </form>`,
    foot: html`${!isNew ? html`<button class="btn danger" id="log-del">${icon('trash')} Delete</button>` : ''}
      <div class="r"><button class="btn" data-close>Cancel</button><button class="btn primary" id="log-save">${icon('check')} ${isNew ? 'Save entry' : 'Save changes'}</button></div>`,
  });
  const form = $('#log-form', m.el);
  const box = $('#parts-box', m.el);
  const drawParts = () => {
    box.innerHTML = parts.length ? html`<div class="parts-edit">
      <span class="h">Part</span><span class="h">Part number</span><span class="h q">Qty</span><span class="h c">Cost</span><span></span>
      ${parts.map((p, i) => html`<input class="input" list="part-list" data-p="${i}" data-f="name" value="${p.name}" placeholder="Oil filter">
        <input class="input mono" data-p="${i}" data-f="number" value="${p.number}" placeholder="15400-PLM-A02">
        <input class="input" data-p="${i}" data-f="qty" value="${p.qty}" placeholder="1" inputmode="decimal">
        <input class="input" data-p="${i}" data-f="cost" value="${p.cost ?? ''}" placeholder="$" inputmode="decimal">
        <button type="button" class="btn ghost icon" data-prm="${i}" title="Remove">${icon('x')}</button>`)}</div>`.s
      : html`<div class="faint" style="font-size:13px">No parts recorded. Part numbers from the spec sheet autocomplete here.</div>`.s;
  };
  box.addEventListener('input', e => {
    const t = e.target; if (!t.dataset.f) return;
    const p = parts[+t.dataset.p]; p[t.dataset.f] = t.value;
    if (t.dataset.f === 'name') {
      const k = known.find(k => k.name.toLowerCase() === t.value.toLowerCase());
      const numEl = $(`[data-p="${t.dataset.p}"][data-f=number]`, box);
      if (k && k.number && !numEl.value) { numEl.value = p.number = k.number; }
    }
  });
  box.addEventListener('click', e => { const b = e.target.closest('[data-prm]'); if (b) { parts.splice(+b.dataset.prm, 1); drawParts(); } });
  $('#part-add', m.el).onclick = () => { parts.push({ name: '', number: '', qty: '1', cost: '' }); drawParts(); $$('[data-f=name]', box).pop().focus(); };
  drawParts();

  const filesBox = $('#log-files', m.el);
  const drawFiles = () => {
    const existing = (log.files || []).filter(f => !removedFiles.has(f.id));
    filesBox.innerHTML = html`${existing.map(f => html`<div class="thumb ${f.is_image ? '' : 'file'}" style="position:relative">${f.is_image ? html`<img src="${f.url}" alt="">` : html`${icon('file')}<span>${f.name}</span>`}<button type="button" class="btn sm icon" data-frm="${f.id}" style="position:absolute;top:3px;right:3px;padding:2px" title="Remove">${icon('x')}</button></div>`)}
      ${newFiles.map((f, i) => html`<div class="thumb file" style="position:relative">${icon(f.type.startsWith('image/') ? 'image' : 'file')}<span>${f.name}</span><button type="button" class="btn sm icon" data-nrm="${i}" style="position:absolute;top:3px;right:3px;padding:2px" title="Remove">${icon('x')}</button></div>`)}
      ${!existing.length && !newFiles.length ? html`<span class="faint" style="font-size:13px">Snap a photo of the receipt or the worn part.</span>` : ''}`.s;
  };
  filesBox.addEventListener('click', e => {
    const r = e.target.closest('[data-frm]'); if (r) { removedFiles.add(+r.dataset.frm); drawFiles(); }
    const n = e.target.closest('[data-nrm]'); if (n) { newFiles.splice(+n.dataset.nrm, 1); drawFiles(); }
  });
  $('#file-add', m.el).onclick = async () => { newFiles = newFiles.concat(await pickFiles({ accept: 'image/*,application/pdf,*/*' })); drawFiles(); };
  drawFiles();

  // Picking a category ticks the scheduled tasks in that category
  $('[name=category]', form).addEventListener('change', e => {
    $$('[name=task_ids]', form).forEach(c => { if (c.dataset.cat && c.dataset.cat.toLowerCase() === e.target.value.toLowerCase()) c.checked = true; });
  });

  const save = async () => {
    if (!form.reportValidity()) return;
    const d = formData(form);
    d.parts = parts;
    d.task_ids = (d.task_ids || []).map(Number);
    if (!d.title.trim() && !d.category.trim()) return toast('Say what was done', true);
    if (!d.cost && parts.some(p => p.cost)) d.cost = parts.reduce((s, p) => s + (parseFloat(String(p.cost).replace(/[$,]/g, '')) || 0) * (parseFloat(p.qty) || 1), 0).toFixed(2);
    const btn = $('#log-save', m.el); btn.disabled = true;
    try {
      const id = isNew ? (await POST(`/api/assets/${a.id}/logs`, d)).id : (await PUT(`/api/logs/${log.id}`, d), log.id);
      for (const fid of removedFiles) await DEL(`/api/files/${fid}`);
      for (const f of newFiles) await uploadFile(f, { log_id: id });
      m.close(); toast(isNew ? 'Entry logged' : 'Entry saved'); await refresh();
    } catch (e) { btn.disabled = false; fail(e); }
  };
  form.onsubmit = e => { e.preventDefault(); save(); };
  $('#log-save', m.el).onclick = save;
  if (!isNew) $('#log-del', m.el).onclick = async () => {
    if (!await confirmBox(html`Delete <b>${log.title}</b> from ${fmtDate(log.date)}? Its attachments are deleted too.`)) return;
    try { await DEL(`/api/logs/${log.id}`); m.close(); toast('Deleted'); await refresh(); } catch (e) { fail(e); }
  };
}

// ------------------------------------------------------------------ AI fill (copy prompt -> paste JSON)
function parseLlmJson(text) {
  const t = text.trim();
  const a = t.indexOf('{'), b = t.lastIndexOf('}');
  if (a < 0 || b <= a) throw new Error("Couldn't find a JSON object in the reply");
  try { return JSON.parse(t.slice(a, b + 1)); }
  catch (e) { throw new Error(`The reply isn't valid JSON: ${e.message}`); }
}
function importSummary(r) {
  const items = [];
  if (r.asset_fields.length) items.push(`Details: ${r.asset_fields.join(', ')}`);
  if (r.sections_new.length) items.push(`New sections: ${r.sections_new.join(', ')}`);
  if (r.sections_updated.length) items.push(`Updated sections: ${r.sections_updated.join(', ')}`);
  if (r.rows_added || r.rows_updated) items.push(`Spec rows: ${r.rows_added} added, ${r.rows_updated} filled in`);
  if (r.tasks_added || r.tasks_updated) items.push(`Schedule: ${plural(r.tasks_added, 'interval')} added, ${r.tasks_updated} updated`);
  return html`${items.length ? html`<ul style="margin:6px 0 0;padding-left:20px">${items.map(i => html`<li>${i}</li>`)}</ul>` : html`<div class="muted">Nothing new: everything in the reply is already on file.</div>`}
    ${r.skipped.length ? html`<div style="font-size:12.5px;color:var(--warn);margin-top:6px">Skipped: ${r.skipped.join('; ')}</div>` : ''}`;
}
async function openAiFill(a) {
  let prompt;
  try { prompt = await (await fetch(`/api/assets/${a.id}/prompt`)).text(); } catch (e) { return fail(e); }
  const m = modal({
    title: `Fill ${a.name} with AI`, cls: 'wide',
    body: html`<p class="muted" style="margin:0 0 4px">Use ChatGPT, Claude, Gemini or whatever you like; turn on web search if it has it. Wrenchbook doesn't need an API key for this.</p>
      <div class="sub-head">1 · Copy this prompt into your AI <button type="button" class="btn sm primary" id="ai-copy" style="margin-left:auto">${icon('copy')} Copy prompt</button></div>
      <label class="field"><textarea readonly rows="7" class="mono" style="font-size:12.5px">${prompt}</textarea></label>
      <div class="sub-head">2 · Paste its reply here</div>
      <label class="field"><textarea id="ai-reply" rows="8" class="mono" style="font-size:12.5px" placeholder='{ "sections": [ ... ], "tasks": [ ... ] }'></textarea></label>
      <label class="check" style="margin-top:10px"><input type="checkbox" id="ai-over"><span>Replace values I already have (otherwise only blanks are filled in)</span></label>
      <div id="ai-preview" style="margin-top:12px"></div>
      <p class="faint" style="font-size:12.5px;margin:14px 0 0">Using an AI agent that can make web requests? Point it at <a href="/llms.txt" target="_blank" class="mono" style="color:var(--accent-text)">${location.origin}/llms.txt</a>. It can update this entry (id ${a.id}) or add new ones directly.</p>`,
    foot: html`<div class="r"><button class="btn" data-close>Cancel</button><button class="btn" id="ai-check">${icon('search')} Preview changes</button><button class="btn primary" id="ai-import">${icon('check')} Import</button></div>`,
  });
  $('#ai-copy', m.el).onclick = () => copyText(prompt);
  const run = async dry => {
    let data;
    try { data = parseLlmJson($('#ai-reply', m.el).value); } catch (e) { return fail(e); }
    data.overwrite = $('#ai-over', m.el).checked;
    try {
      const r = await POST(`/api/assets/${a.id}/import${dry ? '?dry_run=true' : ''}`, data);
      if (dry) { $('#ai-preview', m.el).innerHTML = html`<div class="callout" style="margin:0">${icon('info')}<div><b>This import would change:</b>${importSummary(r)}</div></div>`.s; return; }
      m.close(); toast('Imported'); await refresh();
    } catch (e) { fail(e); }
  };
  $('#ai-check', m.el).onclick = () => run(true);
  $('#ai-import', m.el).onclick = () => run(false);
}

// ------------------------------------------------------------------ task form
async function openTaskForm(a, t = null) {
  const isNew = !t;
  t = t || { name: '', category: '', every_dist: '', every_months: '', notes: '', guide_id: null };
  let guides = [];
  try { guides = await GET('/api/guides'); } catch (e) { /* optional */ }
  guides = guides.filter(g => !g.assets.length || g.assets.some(x => x.id === a.id));
  const have = new Set(a.tasks.map(x => x.name.toLowerCase()));
  const sugg = isNew ? kindMeta(a.kind).tasks.filter(s => !have.has(s.name.toLowerCase())) : [];
  const unit = a.usage_unit;
  const m = modal({
    title: isNew ? 'Add service interval' : 'Edit service interval',
    body: html`<form id="task-form" autocomplete="off">
      ${sugg.length ? html`<div class="sub-head" style="margin-top:0">Suggestions for a ${kindLabel(a.kind).toLowerCase()}</div>
        <div class="suggest">${sugg.map((s, i) => html`<button type="button" data-sg="${i}"><b>${s.name}</b><span class="muted">${everyText(s, unit)}</span></button>`)}</div>
        <div class="sub-head">Or set your own</div>` : ''}
      <div class="grid-form">
        <label class="field c4"><span>Task *</span><input name="name" value="${t.name}" required placeholder="Oil & filter change"></label>
        <label class="field c2"><span>Category</span><input name="category" list="cat-list2" value="${t.category}"></label>
        ${unit !== 'none' ? html`<label class="field c3"><span>Every … ${UNIT_SHORT[unit]}</span><input name="every_dist" inputmode="decimal" value="${t.every_dist ?? ''}" placeholder="${unit === 'hr' ? '50' : '5000'}"></label>` : ''}
        <label class="field c3"><span>Every … months</span><input name="every_months" inputmode="numeric" value="${t.every_months ?? ''}" placeholder="6"></label>
        <label class="field c6"><span>How-to guide</span><select name="guide_id"><option value="">None</option>${guides.map(g => html`<option value="${g.id}" ${t.guide_id === g.id ? 'selected' : ''}>${g.title}</option>`)}</select></label>
        <label class="field c6"><span>Notes</span><input name="notes" value="${t.notes}" placeholder="e.g. 0W-20 full synthetic, 5.7 qt with filter"></label>
      </div>
      <datalist id="cat-list2">${S.meta.categories.map(c => html`<option value="${c}">`)}</datalist>
      <p class="faint" style="font-size:12.5px;margin:12px 0 0">Fill in either limit or both; it's due at whichever comes first.</p>
    </form>`,
    foot: html`${!isNew ? html`<button class="btn danger" id="task-del">${icon('trash')} Delete</button>` : ''}<div class="r"><button class="btn" data-close>Cancel</button><button class="btn primary" id="task-save">${icon('check')} Save</button></div>`,
  });
  const form = $('#task-form', m.el);
  $$('[data-sg]', m.el).forEach(b => b.onclick = () => {
    const s = sugg[+b.dataset.sg];
    form.name.value = s.name; form.category.value = s.category;
    if (form.every_dist) form.every_dist.value = s.every_dist ?? '';
    form.every_months.value = s.every_months ?? '';
  });
  const save = async () => {
    if (!form.reportValidity()) return;
    try {
      if (isNew) await POST(`/api/assets/${a.id}/tasks`, formData(form)); else await PUT(`/api/tasks/${t.id}`, formData(form));
      m.close(); toast('Saved'); await refresh();
    } catch (e) { fail(e); }
  };
  form.onsubmit = e => { e.preventDefault(); save(); };
  $('#task-save', m.el).onclick = save;
  if (!isNew) $('#task-del', m.el).onclick = async () => {
    if (!await confirmBox(html`Delete the <b>${t.name}</b> interval? Service entries stay in the log.`)) return;
    await DEL(`/api/tasks/${t.id}`).catch(fail); m.close(); await refresh();
  };
}

// ------------------------------------------------------------------ global service log
async function pageLog() {
  document.title = 'Service log · Wrenchbook';
  if (!S.logsAll) S.logsAll = await GET('/api/logs');
  if (!S.assets.length) S.assets = await GET('/api/assets');
  const { logs, years } = S.logsAll;
  logs.forEach(l => { S.logIndex[l.id] = l; });
  const f = S.logFilter ||= { asset: '', category: '', year: '', q: '' };
  const cats = [...new Set(logs.map(l => l.category).filter(Boolean))].sort();
  main().innerHTML = html`<div class="page">
    <div class="page-head"><div><h1>Service log</h1><div class="sub">Every job on every machine</div></div>
      <div class="actions"><button class="btn primary" data-act="log-new">${icon('plus')} Log service</button></div></div>
    <div class="toolbar">
      <input class="input grow" type="search" id="lf-q" placeholder="Search work, parts, notes, shop…" value="${f.q}">
      <select class="input" id="lf-asset"><option value="">All vehicles & equipment</option>${S.assets.map(a => html`<option value="${a.id}" ${String(a.id) === f.asset ? 'selected' : ''}>${a.name}</option>`)}</select>
      <select class="input" id="lf-cat"><option value="">All categories</option>${cats.map(c => html`<option ${c === f.category ? 'selected' : ''}>${c}</option>`)}</select>
      <select class="input" id="lf-year"><option value="">All years</option>${years.map(y => html`<option ${y === f.year ? 'selected' : ''}>${y}</option>`)}</select>
    </div>
    <div id="log-results"></div></div>`.s;
  const draw = () => {
    const q = f.q.toLowerCase();
    const rows = logs.filter(l => (!f.asset || String(l.asset_id) === f.asset) && (!f.category || l.category === f.category) && (!f.year || l.date.startsWith(f.year))
      && (!q || [l.title, l.notes, l.performed_by, l.category, l.asset_name, ...l.parts.flatMap(p => [p.name, p.number])].join(' ').toLowerCase().includes(q)));
    const total = rows.reduce((s, l) => s + (l.cost || 0), 0);
    $('#log-results').innerHTML = (rows.length ? html`
      <div class="toolbar"><div class="totals" style="margin-left:0"><span><b>${rows.length}</b> ${rows.length === 1 ? 'entry' : 'entries'}</span><span><b>${money(total)}</b> total</span></div></div>
      <div class="card"><div class="table-wrap"><table class="data">
        <thead><tr><th>Date</th><th>Vehicle / equipment</th><th>Work</th><th class="hide-sm">Category</th><th class="num hide-sm">Reading</th><th class="num">Cost</th></tr></thead>
        <tbody>${rows.map(l => html`<tr class="click" data-act="log-edit" data-id="${l.id}">
          <td class="nowrap">${fmtDate(l.date)}</td>
          <td><div style="display:flex;align-items:center;gap:9px">${avatar({ kind: l.asset_kind }, '')}<a href="#/asset/${l.asset_id}/log" style="font-weight:600">${hl(l.asset_name, f.q)}</a></div></td>
          <td><div style="font-weight:600">${hl(l.title, f.q)}</div>${l.parts.length ? html`<div class="task-sub">${l.parts.map(p => p.name || p.number).join(', ')}</div>` : ''}</td>
          <td class="hide-sm">${l.category ? html`<span class="pill cat">${l.category}</span>` : ''}</td>
          <td class="num hide-sm">${fmtReading(l.reading, l.usage_unit)}</td>
          <td class="num cost">${money(l.cost)}</td></tr>`)}</tbody></table></div></div>`
      : html`<div class="card empty">${icon('clipboard')}<h3>${logs.length ? 'No matching entries' : 'Nothing logged yet'}</h3><p>${logs.length ? 'Try a different filter.' : 'Log your first oil change, brake job or repair.'}</p></div>`).s;
  };
  $('#lf-q').oninput = e => { f.q = e.target.value; draw(); };
  $('#lf-asset').onchange = e => { f.asset = e.target.value; draw(); };
  $('#lf-cat').onchange = e => { f.category = e.target.value; draw(); };
  $('#lf-year').onchange = e => { f.year = e.target.value; draw(); };
  draw();
}

// ------------------------------------------------------------------ guides
async function pageGuides() {
  document.title = 'Guides · Wrenchbook';
  if (!S.guides) S.guides = await GET('/api/guides');
  const gs = S.guides;
  main().innerHTML = html`<div class="page">
    <div class="page-head"><div><h1>Guides</h1><div class="sub">Your own repair manual: how-tos, procedures and checklists</div></div>
      <div class="actions"><a class="btn primary" href="#/guide/new">${icon('plus')} New guide</a></div></div>
    ${gs.length ? html`<div class="toolbar"><input class="input grow" type="search" id="g-q" placeholder="Filter guides…"></div><div class="guides" id="g-list"></div>`
      : html`<div class="card empty">${icon('book')}<h3>No guides yet</h3><p>Write up procedures like "Odyssey oil change", "Snowblower shear pin swap" or "Winterizing the mower" with steps, specs and photos.</p><a class="btn primary" href="#/guide/new">${icon('plus')} Write your first guide</a></div>`}
  </div>`.s;
  if (!gs.length) return;
  const draw = q => {
    q = q.toLowerCase();
    const list = gs.filter(g => !q || [g.title, g.summary, ...g.assets.map(a => a.name)].join(' ').toLowerCase().includes(q));
    $('#g-list').innerHTML = (list.length ? html`${list.map(guideCard)}` : html`<div class="muted">No matches.</div>`).s;
  };
  $('#g-q').oninput = e => draw(e.target.value);
  draw('');
}

const lines = s => (s || '').split('\n').map(x => x.replace(/^[-*•]\s*/, '').trim()).filter(Boolean);

async function pageGuide(id) {
  const g = await GET(`/api/guides/${id}`);
  document.title = `${g.title} · Wrenchbook`;
  const docs = g.files.filter(f => !f.is_image || !g.body.includes(f.url));
  main().innerHTML = html`<div class="page">
    <div class="page-head">
      <div><div class="sub" style="margin:0 0 4px"><a href="#/guides" class="muted">${icon('book', '')} Guides</a></div><h1>${g.title}</h1>${g.summary ? html`<div class="sub">${g.summary}</div>` : ''}</div>
      <div class="actions"><button class="btn icon" data-act="print-page" title="Print">${icon('printer')}</button><a class="btn primary" href="#/guide/${g.id}/edit">${icon('edit')} Edit</a></div>
    </div>
    <div class="guide-layout">
      <article class="card guide-doc md">${g.body ? raw(g.body_html) : html`<p class="muted">This guide is empty. <a href="#/guide/${g.id}/edit">Write it</a>.</p>`}</article>
      <aside class="guide-aside">
        <div class="card"><div class="card-head"><h3>At a glance</h3></div><div class="card-body" style="display:flex;flex-direction:column;gap:10px">
          ${g.difficulty ? html`<div class="fact"><span class="l">Difficulty</span><span class="v">${g.difficulty}</span></div>` : ''}
          ${g.duration ? html`<div class="fact"><span class="l">Time</span><span class="v">${g.duration}</span></div>` : ''}
          <div class="fact"><span class="l">Applies to</span><span class="v" style="flex-wrap:wrap">${g.assets.length ? g.assets.map(a => html`<a class="pill cat" href="#/asset/${a.id}">${a.name}</a>`) : 'Everything (general)'}</span></div>
          ${g.tasks.length ? html`<div class="fact"><span class="l">Linked to schedule</span><span class="v" style="flex-direction:column;align-items:flex-start;font-weight:500">${g.tasks.map(t => html`<a href="#/asset/${t.asset_id}/schedule">${t.asset_name}: ${t.name}</a>`)}</span></div>` : ''}
        </div></div>
        ${lines(g.tools).length ? html`<div class="card"><div class="card-head"><h3>${icon('wrench')} Tools</h3></div><ul class="aside-list">${lines(g.tools).map(x => html`<li>${x}</li>`)}</ul></div>` : ''}
        ${lines(g.parts).length ? html`<div class="card"><div class="card-head"><h3>${icon('box')} Parts & supplies</h3></div><ul class="aside-list">${lines(g.parts).map(x => html`<li>${x}</li>`)}</ul></div>` : ''}
        ${docs.length ? html`<div class="card"><div class="card-head"><h3>${icon('file')} Attachments</h3></div><div class="list">${docs.map(f => html`<a class="row" href="${f.url}" target="_blank">${icon(f.is_image ? 'image' : 'file')}<span class="grow t">${f.caption || f.name}</span></a>`)}</div></div>` : ''}
      </aside>
    </div></div>`.s;
}

const GUIDE_TEMPLATE = `## Before you start
> Safety first: let the engine cool, chock the wheels, disconnect the spark plug wire on small engines.

## Steps
1.
2.
3.

## Specs & notes
- Torque:
- `;

async function pageGuideEdit(id, assetId) {
  if (!S.assets.length) S.assets = await GET('/api/assets');
  const g = id ? await GET(`/api/guides/${id}`) : { title: '', summary: '', body: GUIDE_TEMPLATE, tools: '', parts: '', difficulty: '', duration: '', asset_ids: assetId ? [+assetId] : [] };
  document.title = `${id ? 'Edit' : 'New'} guide · Wrenchbook`;
  main().innerHTML = html`<div class="page">
    <div class="page-head"><div><h1>${id ? 'Edit guide' : 'New guide'}</h1></div>
      <div class="actions"><a class="btn" href="${id ? `#/guide/${id}` : 'javascript:history.back()'}">Cancel</a><button class="btn primary" id="g-save">${icon('check')} Save guide</button></div></div>
    <form id="g-form" class="guide-layout" autocomplete="off" onsubmit="return false">
      <div class="card" style="padding:18px;display:flex;flex-direction:column;gap:14px">
        <label class="field"><span>Title *</span><input name="title" value="${g.title}" required placeholder="e.g. Odyssey oil & filter change" autofocus style="font-size:16px;font-weight:600"></label>
        <label class="field"><span>Summary</span><input name="summary" value="${g.summary}" placeholder="One line on what this covers"></label>
        <div class="field"><span>Instructions</span>
          <div class="editor-tools">
            <button type="button" class="btn sm" id="g-img">${icon('image')} Insert photo</button>
            <button type="button" class="btn sm" data-ins="steps">${icon('list')} Steps</button>
            <button type="button" class="btn sm" data-ins="check">${icon('checklist')} Checklist</button>
            <button type="button" class="btn sm" data-ins="warn">${icon('alert')} Warning</button>
            <button type="button" class="btn sm" data-ins="table">${icon('nut')} Torque table</button>
            <div class="seg"><button type="button" class="on" data-mode="write">Write</button><button type="button" data-mode="preview">Preview</button></div>
          </div>
          <textarea class="tall" name="body" id="g-body">${g.body}</textarea>
          <div class="preview-box md hidden" id="g-prev"></div>
          <small>Markdown: <code>## Heading</code>, <code>1. step</code>, <code>- [ ] checklist</code>, <code>&gt; warning</code>, <code>**bold**</code>, tables.</small>
        </div>
      </div>
      <div class="guide-aside">
        <div class="card"><div class="card-head"><h3>Details</h3></div><div class="card-body" style="display:flex;flex-direction:column;gap:12px">
          <label class="field"><span>Difficulty</span><select name="difficulty">${['', 'Easy', 'Moderate', 'Hard', 'Shop job'].map(d => html`<option value="${d}" ${g.difficulty === d ? 'selected' : ''}>${d || '—'}</option>`)}</select></label>
          <label class="field"><span>Time</span><input name="duration" value="${g.duration}" placeholder="45 min"></label>
        </div></div>
        <div class="card"><div class="card-head"><h3>Applies to</h3></div><div class="card-body">
          <div class="chips-wrap">${S.assets.map(a => html`<label class="chip-check"><input type="checkbox" name="asset_ids" data-multi="1" value="${a.id}" ${g.asset_ids.includes(a.id) ? 'checked' : ''}>${a.name}</label>`)}</div>
          <small class="faint" style="display:block;margin-top:8px">Leave all unticked for a general guide that shows on every vehicle.</small>
        </div></div>
        <div class="card"><div class="card-head"><h3>Tools & parts</h3></div><div class="card-body" style="display:flex;flex-direction:column;gap:12px">
          <label class="field"><span>Tools needed (one per line)</span><textarea name="tools" rows="4" placeholder="17mm socket&#10;Oil filter wrench&#10;Drain pan">${g.tools}</textarea></label>
          <label class="field"><span>Parts & supplies (one per line)</span><textarea name="parts" rows="4" placeholder="Oil filter 15400-PLM-A02&#10;5.7 qt 0W-20">${g.parts}</textarea></label>
        </div></div>
        ${id ? html`<button type="button" class="btn danger" id="g-del">${icon('trash')} Delete guide</button>` : ''}
      </div>
    </form></div>`.s;
  const form = $('#g-form'), ta = $('#g-body'), prev = $('#g-prev');
  const insert = text => {
    const s = ta.selectionStart, e = ta.selectionEnd;
    const before = ta.value.slice(0, s), pre = before && !before.endsWith('\n') ? '\n\n' : '';
    ta.setRangeText(pre + text, s, e, 'end'); ta.focus();
  };
  const SNIPS = {
    steps: '1. \n2. \n3. \n',
    check: '- [ ] \n- [ ] \n- [ ] \n',
    warn: '> **Warning:** \n',
    table: '| Fastener | Torque |\n| --- | --- |\n| Drain plug | 29 lb-ft |\n| Lug nuts | 94 lb-ft |\n',
  };
  $$('[data-ins]').forEach(b => b.onclick = () => insert(SNIPS[b.dataset.ins]));
  $('#g-img').onclick = async () => {
    const files = await pickFiles({ accept: 'image/*' });
    for (const f of files) {
      try { const r = await uploadFile(f, { guide_id: id || '' }); insert(`![${f.name.replace(/\.[^.]+$/, '')}](${r.url})\n`); }
      catch (e) { fail(e); }
    }
  };
  $$('[data-mode]').forEach(b => b.onclick = async () => {
    $$('[data-mode]').forEach(x => x.classList.toggle('on', x === b));
    const p = b.dataset.mode === 'preview';
    if (p) { prev.innerHTML = (await POST('/api/render', { text: ta.value })).html; prev.style.minHeight = ta.offsetHeight + 'px'; }
    ta.classList.toggle('hidden', p); prev.classList.toggle('hidden', !p);
  });
  $('#g-save').onclick = async () => {
    if (!form.reportValidity()) return;
    const d = formData(form);
    d.asset_ids = (d.asset_ids || []).map(Number);
    try {
      const gid = id ? (await PUT(`/api/guides/${id}`, d), id) : (await POST('/api/guides', d)).id;
      S.guides = null; toast('Guide saved'); location.hash = `#/guide/${gid}`;
    } catch (e) { fail(e); }
  };
  if (id) $('#g-del').onclick = async () => {
    if (!await confirmBox(html`Delete the guide <b>${g.title}</b>?`)) return;
    try { await DEL(`/api/guides/${id}`); S.guides = null; toast('Deleted'); location.hash = '#/guides'; } catch (e) { fail(e); }
  };
}

// ------------------------------------------------------------------ search
async function pageSearch(q) {
  document.title = 'Search · Wrenchbook';
  main().innerHTML = html`<div class="page">
    <div class="page-head"><div><h1>Search</h1><div class="sub">Part numbers, fluids, bulbs, VINs, past jobs, guides</div></div></div>
    <form id="s-form" class="toolbar"><input class="input grow" type="search" name="q" value="${q}" placeholder="e.g. 15400-PLM-A02, 7443, 0W-20, brakes" autofocus style="font-size:16px;padding:11px 14px"></form>
    <div id="s-res">${q ? html`<div class="loading">Searching…</div>` : ''}</div></div>`.s;
  $('#s-form').onsubmit = e => { e.preventDefault(); location.hash = `#/search?q=${encodeURIComponent(e.target.q.value.trim())}`; };
  if (!q) return;
  const r = await GET(`/api/search?q=${encodeURIComponent(q)}`);
  r.logs.forEach(l => { S.logIndex[l.id] = l; });
  const n = r.assets.length + r.specs.length + r.logs.length + r.guides.length;
  $('#s-res').innerHTML = (n ? html`
    ${r.specs.length ? html`<div class="result-group"><h3>Spec sheets</h3><div class="specs">${r.specs.map(s => html`<div class="card spec-card">
      <div class="card-head"><a href="#/asset/${s.asset_id}" style="font-weight:700">${s.asset_name}</a><span class="muted">›</span><span>${s.title}</span></div>
      <table class="spec">${s.columns.length > 2 ? html`<thead><tr>${s.columns.map(c => html`<th>${c}</th>`)}</tr></thead>` : ''}<tbody>${s.rows.map(row => html`<tr>${row.map((c, i) => i ? html`<td class="${c ? 'copy' : 'blank'}" data-act="${c ? 'copy' : ''}" data-v="${c}">${c ? hl(c, q) : '—'}</td>` : html`<td>${hl(c, q)}</td>`)}</tr>`)}</tbody></table></div>`)}</div></div>` : ''}
    ${r.assets.length ? html`<div class="result-group"><h3>Vehicles & equipment</h3><div class="card list">${r.assets.map(a => html`<a class="row" href="#/asset/${a.id}">${avatar(a)}<div class="grow"><div class="t">${hl(a.name, q)}</div><div class="s">${hl(a.title, q)}${a.vin ? html` · <span class="mono">${hl(a.vin, q)}</span>` : ''}${a.plate ? html` · ${hl(a.plate, q)}` : ''}</div></div></a>`)}</div></div>` : ''}
    ${r.logs.length ? html`<div class="result-group"><h3>Service log</h3><div class="card list">${r.logs.map(l => html`<div class="row click" data-act="log-edit" data-id="${l.id}"><div class="grow"><div class="t">${hl(l.title, q)}</div><div class="s">${l.asset_name} · ${fmtDate(l.date)}${l.parts.length ? html` · ${hl(l.parts.map(p => [p.name, p.number].filter(Boolean).join(' ')).join(', '), q)}` : ''}</div></div>${l.category ? html`<span class="pill cat hide-sm">${l.category}</span>` : ''}<span class="cost">${money(l.cost)}</span></div>`)}</div></div>` : ''}
    ${r.guides.length ? html`<div class="result-group"><h3>Guides</h3><div class="guides">${r.guides.map(guideCard)}</div></div>` : ''}`
    : html`<div class="card empty">${icon('search')}<h3>Nothing found for “${q}”</h3><p>Search covers spec sheets, VINs and plates, service entries and parts, and guides.</p></div>`).s;
}

// ------------------------------------------------------------------ actions (delegated)
const sid = el => +el.closest('[data-sid]').dataset.sid;
const ACT = {
  'asset-new': () => openAssetForm(),
  'asset-edit': () => openAssetForm(S.asset),
  'reading': () => openReading(S.asset),
  'log-new': () => openLogForm(S.asset ? { asset: S.asset } : {}),
  'log-task': el => openLogForm({ assetId: +el.dataset.asset, taskId: +el.dataset.task }),
  'log-edit': el => { const l = S.logIndex[+el.dataset.id]; if (l) openLogForm({ assetId: l.asset_id, log: l }); },
  'task-new': () => openTaskForm(S.asset),
  'task-edit': el => openTaskForm(S.asset, S.asset.tasks.find(t => t.id === +el.dataset.id)),
  'copy': el => el.dataset.v && copyText(el.dataset.v),
  'lightbox': el => {
    const lb = document.createElement('div'); lb.className = 'lightbox';
    lb.innerHTML = html`<img src="${el.dataset.src}" alt="">`.s; lb.onclick = () => lb.remove(); document.body.append(lb);
  },
  'print': async () => {
    const { parts } = route();
    if (parts[2] && parts[2] !== 'specs') { location.hash = `#/asset/${S.asset.id}/specs`; await new Promise(r => setTimeout(r, 300)); }
    window.print();
  },
  'print-page': () => window.print(),
  'theme': () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const next = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('wb-theme', next); } catch (e) { /* private mode */ }
  },
  'ai-fill': () => openAiFill(S.asset),
  'apply-template': async el => {
    const what = el.dataset.what;
    await POST(`/api/assets/${S.asset.id}/template`, { sections: what === 'sections', tasks: what === 'tasks' }).catch(fail);
    await refresh();
  },
  // spec sections
  'section-add': () => {
    const m = modal({
      title: 'Add a spec sheet section',
      body: html`<div class="tpl-grid">${S.meta.templates.map(t => html`<button class="tpl" data-tpl="${t.key}"><div class="spec-icon ${t.key}">${icon(SECTION_ICON[t.key])}</div><div><div style="font-weight:650">${t.key === 'custom' ? 'Custom section' : t.title}</div><div class="d">${t.columns.join(' · ')}</div></div></button>`)}</div>`,
    });
    $$('[data-tpl]', m.el).forEach(b => b.onclick = async () => {
      try {
        const r = await POST(`/api/assets/${S.asset.id}/sections`, { template: b.dataset.tpl });
        m.close(); S.asset = await GET(`/api/assets/${S.asset.id}`);
        const s = S.asset.sections.find(x => x.id === r.id);
        S.editing[r.id] = { title: s.title, columns: [...s.columns], rows: [s.columns.map(() => '')], note: '' };
        await render();
        const card = $(`.spec-card[data-sid="${r.id}"]`); if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); $('[data-sedit=cell]', card)?.focus(); }
      } catch (e) { fail(e); }
    });
  },
  'section-edit': el => {
    const s = S.asset.sections.find(x => x.id === sid(el));
    S.editing[s.id] = { title: s.title, columns: [...s.columns], rows: s.rows.length ? s.rows.map(r => [...r]) : [s.columns.map(() => '')], note: s.note || '' };
    rerenderSection(s.id, '[data-sedit=cell]');
  },
  'section-cancel': el => { delete S.editing[sid(el)]; rerenderSection(sid(el)); },
  'section-save': async el => {
    const id = sid(el), ed = S.editing[id];
    try {
      await PUT(`/api/sections/${id}`, ed);
      delete S.editing[id];
      const fresh = await GET(`/api/assets/${S.asset.id}`);
      fresh.sections.forEach(s => { if (!S.editing[s.id]) Object.assign(S.asset.sections.find(x => x.id === s.id) || {}, s); });
      rerenderSection(id); toast('Saved');
    } catch (e) { fail(e); }
  },
  'section-del': async el => {
    const id = sid(el), s = S.asset.sections.find(x => x.id === id);
    if (!await confirmBox(html`Delete the <b>${s.title}</b> section?`)) return;
    await DEL(`/api/sections/${id}`).catch(fail); delete S.editing[id]; await refresh();
  },
  'section-move': async el => { await POST(`/api/sections/${sid(el)}/move`, { dir: el.dataset.dir }).catch(fail); await refresh(); },
  'srow-add': el => { const id = sid(el), ed = S.editing[id]; ed.rows.push(ed.columns.map(() => '')); rerenderSection(id, `tbody tr:last-child input`); },
  'srow-del': el => { const id = sid(el); S.editing[id].rows.splice(+el.dataset.r, 1); rerenderSection(id); },
  'srow-move': el => {
    const id = sid(el), rows = S.editing[id].rows, i = +el.dataset.r, j = el.dataset.dir === 'up' ? i - 1 : i + 1;
    if (j < 0 || j >= rows.length) return;
    [rows[i], rows[j]] = [rows[j], rows[i]]; rerenderSection(id);
  },
  'scol-add': el => { const id = sid(el), ed = S.editing[id]; ed.columns.push(''); ed.rows.forEach(r => r.push('')); rerenderSection(id, 'thead th:nth-last-child(2) input'); },
  'scol-del': el => { const id = sid(el), ed = S.editing[id], c = +el.dataset.c; ed.columns.splice(c, 1); ed.rows.forEach(r => r.splice(c, 1)); rerenderSection(id); },
  // files
  'photo-pick': async () => {
    const [f] = await pickFiles({ multiple: false, accept: 'image/*' });
    if (!f) return;
    try { const r = await uploadFile(f, { asset_id: S.asset.id, caption: 'Cover photo' }); await PUT(`/api/assets/${S.asset.id}`, { photo_id: r.id }); toast('Photo updated'); await refresh(); } catch (e) { fail(e); }
  },
  'file-pick': async () => uploadAssetFiles(await pickFiles()),
  'file-cover': async el => { await PUT(`/api/assets/${S.asset.id}`, { photo_id: +el.dataset.id }).catch(fail); toast('Cover photo set'); await refresh(); },
  'file-caption': el => {
    const f = S.asset.files.find(x => x.id === +el.dataset.id);
    const m = modal({
      title: 'Caption', cls: 'narrow', body: html`<form id="cap-f"><label class="field"><span>Caption</span><input name="caption" value="${f.caption || f.name}" autofocus></label></form>`,
      foot: html`<div class="r"><button class="btn" data-close>Cancel</button><button class="btn primary" id="cap-s">Save</button></div>`,
    });
    const save = async () => { await PUT(`/api/files/${f.id}`, { caption: $('#cap-f', m.el).caption.value }).catch(fail); m.close(); await refresh(); };
    $('#cap-f', m.el).onsubmit = e => { e.preventDefault(); save(); };
    $('#cap-s', m.el).onclick = save;
  },
  'file-del': async el => {
    const f = S.asset.files.find(x => x.id === +el.dataset.id);
    if (!await confirmBox(html`Delete <b>${f.caption || f.name}</b>?`)) return;
    await DEL(`/api/files/${f.id}`).catch(fail); await refresh();
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]');
  if (!el || !el.dataset.act || !ACT[el.dataset.act]) return;
  e.preventDefault();
  Promise.resolve(ACT[el.dataset.act](el, e)).catch(fail);
});
document.addEventListener('input', e => {
  const t = e.target, k = t.dataset.sedit;
  if (!k) return;
  const ed = S.editing[sid(t)];
  if (k === 'title') ed.title = t.value;
  else if (k === 'note') ed.note = t.value;
  else if (k === 'col') ed.columns[+t.dataset.c] = t.value;
  else if (k === 'cell') ed.rows[+t.dataset.r][+t.dataset.c] = t.value;
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && modalStack.length) { modalStack[modalStack.length - 1].querySelector('[data-close]')?.click(); return; }
  if (e.key === 'Escape' && $('.lightbox')) { $('.lightbox').remove(); return; }
  // Enter in a spec cell adds a new row below
  if (e.key === 'Enter' && e.target.dataset?.sedit === 'cell') {
    e.preventDefault();
    const id = sid(e.target), r = +e.target.dataset.r, ed = S.editing[id];
    ed.rows.splice(r + 1, 0, ed.columns.map(() => ''));
    rerenderSection(id, `input[data-r="${r + 1}"][data-c="0"]`);
    return;
  }
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !modalStack.length) {
    e.preventDefault(); const s = $('#side-search input'); if (s.offsetParent) s.focus(); else location.hash = '#/search';
  }
});
// drag & drop onto the files drop zone
document.addEventListener('dragover', e => { const d = e.target.closest?.('.drop'); if (d) { e.preventDefault(); d.classList.add('over'); } });
document.addEventListener('dragleave', e => { const d = e.target.closest?.('.drop'); if (d) d.classList.remove('over'); });
document.addEventListener('drop', e => { const d = e.target.closest?.('.drop'); if (d) { e.preventDefault(); d.classList.remove('over'); uploadAssetFiles([...e.dataTransfer.files]); } });

$('#side-search').onsubmit = e => { e.preventDefault(); const q = e.target.q.value.trim(); if (q) location.hash = `#/search?q=${encodeURIComponent(q)}`; e.target.q.blur(); };

// ------------------------------------------------------------------ boot
(async () => {
  $$('[data-icon]').forEach(el => { el.outerHTML = icon(el.dataset.icon).s; });
  $('#brand-mark').innerHTML = $('#brand-mark-m').innerHTML = icon('wrench').s;
  $('#search-icon').outerHTML = icon('search').s;
  try { S.meta = await GET('/api/meta'); } catch (e) { main().innerHTML = html`<div class="page"><div class="card empty">${icon('alert')}<h3>Can't reach the server</h3><p>${e.message}</p></div></div>`.s; return; }
  window.addEventListener('hashchange', render);
  render();
})();
