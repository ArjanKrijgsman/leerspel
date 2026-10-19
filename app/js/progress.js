// Voortgang, stickers, instellingen en speeltijd. Alles staat lokaal op het apparaat.
const KEY = 'leerspel.v1';

// Een niveau omhoog na 8 opdrachten met minstens 80% in een keer goed,
// een niveau omlaag bij minder dan 50% over de laatste 6.
const WINDOW = 8;
const UP = 0.8;
const DOWN = 0.5;
export const MAX_LEVEL = 3;

const fresh = () => ({ version: 1, stickers: {}, skills: {}, settings: { voice: true }, play: {} });
let data = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...fresh(), ...JSON.parse(raw) };
  } catch (e) { /* geen opslag beschikbaar */ }
  return fresh();
}

function save() {
  try { localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* geen opslag beschikbaar */ }
}

export function skill(id) {
  if (!data.skills[id]) data.skills[id] = { level: 1, recent: [], attempts: 0, firstTry: 0, last: null };
  return data.skills[id];
}

export const allSkills = () => data.skills;

/** Legt een opdracht vast. Geeft +1 of -1 terug als het niveau verandert, anders 0. */
export function record(id, firstTry) {
  const s = skill(id);
  s.attempts++;
  if (firstTry) s.firstTry++;
  s.last = new Date().toISOString();
  s.recent.push(firstTry ? 1 : 0);
  if (s.recent.length > WINDOW) s.recent.shift();
  const n = s.recent.length;
  const ratio = s.recent.reduce((a, b) => a + b, 0) / n;
  let change = 0;
  if (n >= WINDOW && ratio >= UP && s.level < MAX_LEVEL) { s.level++; s.recent = []; change = 1; }
  else if (n >= 6 && ratio < DOWN && s.level > 1) { s.level--; s.recent = []; change = -1; }
  save();
  return change;
}

export function addSticker(kind) {
  data.stickers[kind] = (data.stickers[kind] || 0) + 1;
  save();
}
export const stickers = () => data.stickers;
export const totalStickers = () => Object.values(data.stickers).reduce((a, b) => a + b, 0);

export const settings = () => data.settings;
export function setSetting(key, value) { data.settings[key] = value; save(); }

const dayKey = (d = new Date()) => d.toLocaleDateString('sv-SE'); // JJJJ-MM-DD in lokale tijd
export function addPlayTime(seconds) {
  const k = dayKey();
  data.play[k] = (data.play[k] || 0) + seconds;
  save();
}
export function playSeconds(days) {
  let total = 0;
  for (let i = 0; i < days; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    total += data.play[dayKey(d)] || 0;
  }
  return total;
}

export const exportJson = () => JSON.stringify(data, null, 2);
export function importJson(text) {
  const d = JSON.parse(text);
  if (!d || typeof d !== 'object' || !d.skills || !d.stickers) throw new Error('Dit bestand is geen back-up van het leerspel.');
  data = { ...fresh(), ...d };
  save();
}
export function reset() { data = fresh(); save(); }
