import { SHEEP, STAR, FISH, OWL, STICKER, ICON_SPEAKER, ICON_BACK, ICON_LOCK } from './art.js';
import * as P from './progress.js';
import { say, setVoice } from './speech.js';
import tellen from './games/tellen.js';
import klanken from './games/klanken.js';

const WORLDS = {
  farm: { naam: 'Boerderij', een: 'schaapje', meer: 'schaapjes', art: SHEEP },
  space: { naam: 'Ruimte', een: 'ster', meer: 'sterren', art: STAR },
  sea: { naam: 'Onder water', een: 'visje', meer: 'visjes', art: FISH }
};
const GAMES = {
  tellen: { naam: 'Tellen', big: '1 2 3', sub: (w) => 'Hoeveel ' + w.meer + '?', make: tellen, levels: ['1 t/m 5', '3 t/m 8', '5 t/m 10'] },
  klanken: { naam: 'Klanken', big: 'm v b', sub: () => 'Waar begint het mee?', make: klanken, levels: ['2 plaatjes', '3 plaatjes', '4 plaatjes'] }
};

const screen = document.getElementById('screen');
let route = { screen: 'home', world: null, game: null };
let game = null;
let msg = '';
let speakPending = false;
let confirmReset = false;

setVoice(P.settings().voice !== false);

const ctx = {
  get world() { return WORLDS[route.world]; },
  level: () => P.skill(route.game).level,
  record: (firstTry) => P.record(route.game, firstTry),
  reward: () => P.addSticker(route.world),
  setMsg(text) { msg = text; speakPending = true; },
  say
};

function go(next) {
  route = { ...route, ...next };
  confirmReset = false;
  if (route.screen === 'home') { route.world = null; ctx.setMsg('Hoi! Ik ben Olli. Waar gaan we vandaag naartoe?'); }
  if (route.screen === 'world') ctx.setMsg('Wat gaan we doen?');
  if (route.screen === 'stickers') ctx.setMsg(P.totalStickers() ? 'Kijk eens wat je al verzameld hebt!' : 'Speel een spelletje, dan krijg je stickers.');
  if (route.screen === 'game') game = GAMES[route.game].make(ctx);
  if (route.screen === 'ouders') { msg = ''; speakPending = false; }
  render();
}

function back() {
  if (route.screen === 'game') go({ screen: 'world' });
  else if (route.screen === 'stickers' && route.world) go({ screen: 'world' });
  else go({ screen: 'home' });
}

// ---------- schermen ----------
function bar(title) {
  const backBtn = route.screen === 'home' ? '' : '<button class="k-btn ghost" data-act="back" aria-label="Terug">' + ICON_BACK + '</button>';
  const where = title ? '<span class="where">' + title + '</span>' : '';
  const lock = route.screen === 'home'
    ? '<button class="k-btn ghost small lock" data-hold="ouders" aria-label="Ouderhoek: houd 2 seconden ingedrukt"><span class="fill"></span>' + ICON_LOCK + '</button>'
    : '';
  const repeat = route.screen === 'ouders' ? '' : '<button class="k-btn ghost" data-act="repeat" aria-label="Zeg het nog eens">' + ICON_SPEAKER + '</button>';
  const count = route.screen === 'ouders' ? '' :
    '<button class="k-btn ghost stickers" data-act="stickers" aria-label="Stickerboek, ' + P.totalStickers() + ' stickers">' + STICKER + P.totalStickers() + '</button>';
  return '<div class="bar">' + backBtn + where + '<span class="grow"></span>' + lock + repeat + count + '</div>';
}

const talk = () => '<div class="talk"><div class="owl">' + OWL + '</div><p class="bubble surface" aria-live="polite">' + msg + '</p></div>';

function levelStars(id) {
  const lvl = P.skill(id).level;
  return '<span class="levelstars" aria-label="Niveau ' + lvl + '">' +
    [1, 2, 3].map((i) => '<span class="' + (i <= lvl ? '' : 'off') + '">' + STICKER + '</span>').join('') + '</span>';
}

function homeView() {
  return bar('') + talk() + '<div class="stage"><div class="cards">' +
    Object.entries(WORLDS).map(([k, w]) => '<button class="card surface" data-act="world" data-world="' + k + '">' + w.art + w.naam + '</button>').join('') +
    '</div></div>';
}

function worldView() {
  const w = WORLDS[route.world];
  return bar(w.naam) + talk() + '<div class="stage"><div class="cards">' +
    Object.entries(GAMES).map(([id, g]) =>
      '<button class="card surface" data-act="game" data-game="' + id + '"><span class="big">' + g.big + '</span>' + g.naam +
      '<small>' + g.sub(w) + '</small>' + levelStars(id) + '</button>').join('') +
    '</div></div>';
}

function stickersView() {
  const s = P.stickers();
  return bar('Stickerboek') + talk() + '<div class="stage"><div class="book surface">' +
    Object.entries(WORLDS).map(([k, w]) =>
      '<div class="slot' + (s[k] ? '' : ' empty') + '">' + w.art + '<span>' + (s[k] || 0) + ' &times;</span></div>').join('') +
    '</div></div>';
}

function oudersView() {
  const skills = P.allSkills();
  const rows = Object.entries(GAMES).map(([id, g]) => {
    const s = skills[id];
    if (!s) return '<tr><td>' + g.naam + '</td><td>1 (' + g.levels[0] + ')</td><td>0</td><td>&ndash;</td><td>nog niet gespeeld</td></tr>';
    const pct = s.attempts ? Math.round((s.firstTry / s.attempts) * 100) + '%' : '&ndash;';
    const last = s.last ? new Date(s.last).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'short' }) : '&ndash;';
    return '<tr><td>' + g.naam + '</td><td>' + s.level + ' (' + g.levels[s.level - 1] + ')</td><td>' + s.attempts + '</td><td>' + pct + '</td><td>' + last + '</td></tr>';
  }).join('');
  const min = (sec) => Math.round(sec / 60) + ' min';
  const resetRow = confirmReset
    ? '<p><strong>Weet je het zeker?</strong> Alle voortgang en stickers op dit apparaat worden gewist.</p>' +
      '<div class="row"><button class="k-btn small danger" data-act="reset-yes">Ja, alles wissen</button><button class="k-btn ghost small" data-act="reset-no">Toch niet</button></div>'
    : '<button class="k-btn ghost small" data-act="reset">Voortgang wissen</button>';
  return bar('Ouderhoek') + '<div class="panel surface">' +
    '<h2>Ouderhoek</h2><p class="muted">Hier zie je wat hij oefent. Het spel past het niveau zelf aan: na 8 opdrachten met minstens 80% in een keer goed gaat het een niveau omhoog, bij minder dan 50% een niveau omlaag.</p>' +
    '<h3>Voortgang</h3><div class="tablewrap"><table><thead><tr><th>Spel</th><th>Niveau</th><th>Opdrachten</th><th>In een keer goed</th><th>Laatst gespeeld</th></tr></thead><tbody>' + rows + '</tbody></table></div>' +
    '<h3>Speeltijd</h3><p>Vandaag ' + min(P.playSeconds(1)) + ', de afgelopen 7 dagen ' + min(P.playSeconds(7)) + '.</p>' +
    '<h3>Instellingen</h3><label class="check"><input type="checkbox" id="opt-voice"' + (P.settings().voice !== false ? ' checked' : '') + '> Olli leest de opdrachten voor</label>' +
    '<h3>Back-up</h3><p>De voortgang staat alleen op dit apparaat. Bewaar af en toe een back-up, bijvoorbeeld voordat je de browsergegevens wist.</p>' +
    '<div class="row"><button class="k-btn small" data-act="export">Back-up opslaan</button>' +
    '<label class="k-btn ghost small" for="import-file">Back-up terugzetten</label><input type="file" id="import-file" accept="application/json,.json" hidden></div>' +
    '<p class="note" id="backup-note" aria-live="polite"></p>' +
    '<h3>Opnieuw beginnen</h3>' + resetRow +
    '</div>';
}

function render() {
  screen.dataset.world = route.screen === 'ouders' ? 'ouders' : (route.world || 'home');
  let html;
  if (route.screen === 'home') html = homeView();
  else if (route.screen === 'world') html = worldView();
  else if (route.screen === 'stickers') html = stickersView();
  else if (route.screen === 'ouders') html = oudersView();
  else html = bar(WORLDS[route.world].naam) + talk() + '<div class="stage">' + game.stage() + '</div>';
  screen.innerHTML = html;
  if (speakPending) { speakPending = false; say(msg); }
}

// ---------- feestje ----------
function burst(rect) {
  const cols = ['--ye', '--pk', '--gr', '--ow', '--or'];
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    const a = (i / 16) * Math.PI * 2;
    s.className = 'spark';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.background = 'var(' + cols[i % cols.length] + ')';
    s.style.setProperty('--dx', Math.cos(a) * (90 + Math.random() * 60) + 'px');
    s.style.setProperty('--dy', Math.sin(a) * (90 + Math.random() * 60) + 'px');
    if (i % 2) s.style.borderRadius = '50%';
    document.body.appendChild(s);
    setTimeout(() => s.remove(), 950);
  }
}

// ---------- invoer ----------
screen.addEventListener('click', (e) => {
  const g = e.target.closest('[data-g]');
  if (g && game && route.screen === 'game') {
    const res = game.click(g) || {};
    if (!res.noRender) render();
    if (res.burst) burst(res.burst);
    return;
  }
  const b = e.target.closest('[data-act]');
  if (!b) return;
  switch (b.dataset.act) {
    case 'back': back(); break;
    case 'repeat': say(msg); break;
    case 'world': go({ screen: 'world', world: b.dataset.world }); break;
    case 'game': go({ screen: 'game', game: b.dataset.game }); break;
    case 'stickers': go({ screen: 'stickers' }); break;
    case 'export': exportBackup(); break;
    case 'reset': confirmReset = true; render(); break;
    case 'reset-no': confirmReset = false; render(); break;
    case 'reset-yes': P.reset(); setVoice(true); confirmReset = false; render(); break;
  }
});

screen.addEventListener('change', (e) => {
  if (e.target.id === 'opt-voice') {
    P.setSetting('voice', e.target.checked);
    setVoice(e.target.checked);
  }
  if (e.target.id === 'import-file' && e.target.files[0]) {
    e.target.files[0].text().then((text) => {
      P.importJson(text);
      render();
      setNote('Back-up teruggezet.');
    }).catch((err) => setNote(err.message || 'Dit bestand kon niet worden gelezen.'));
  }
});

function setNote(text) { const n = document.getElementById('backup-note'); if (n) n.textContent = text; }

function exportBackup() {
  const blob = new Blob([P.exportJson()], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leerspel-backup-' + new Date().toLocaleDateString('sv-SE') + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  setNote('Back-up opgeslagen in je downloads.');
}

// Ouderhoek: 2 seconden ingedrukt houden, zodat hij er niet per ongeluk in komt.
let holdTimer = null;
screen.addEventListener('pointerdown', (e) => {
  const h = e.target.closest('[data-hold]');
  if (!h) return;
  h.classList.add('holding');
  holdTimer = setTimeout(() => { holdTimer = null; go({ screen: 'ouders' }); }, 2000);
});
const cancelHold = (e) => {
  // pointerleave komt ook van onderdelen binnen de knop; alleen het verlaten van de knop zelf telt.
  if (e.type === 'pointerleave' && !e.target.matches?.('[data-hold]')) return;
  const h = e.target.closest?.('[data-hold]');
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
    if (h) { h.classList.remove('holding'); if (e.type === 'pointerup') { ctx.setMsg('Dit knopje is voor papa en mama.'); render(); } }
  }
};
['pointerup', 'pointerleave', 'pointercancel'].forEach((t) => screen.addEventListener(t, cancelHold, true));

// Speeltijd bijhouden zolang het spel zichtbaar is.
setInterval(() => {
  if (document.visibilityState === 'visible' && route.screen !== 'ouders') P.addPlayTime(15);
}, 15000);

// Offline werken en opslag zo veel mogelijk bewaren.
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
navigator.storage?.persist?.().catch(() => {});

go({ screen: 'home' });
