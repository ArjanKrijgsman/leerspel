// Alle tekeningen als SVG. Elke tekening wordt twee keer getekend: eerst als dikke donkere
// omlijning (ol), daarop de kleuren (fl). Zo krijgt alles dezelfde vrolijk-platte lijn.
const L = (s) => '<svg viewBox="0 0 100 100" class="art" aria-hidden="true"><g class="ol">' + s + '</g><g class="fl">' + s + '</g></svg>';

const STAR_POINTS = '50,10 61.2,36.6 89.9,39 68.1,57.9 74.7,86 50,71 25.3,86 31.9,57.9 10.1,39 38.8,36.6';

export const SHEEP = L(
  '<rect class="dk" x="30" y="62" width="9" height="24" rx="4"/><rect class="dk" x="59" y="62" width="9" height="24" rx="4"/>' +
  '<circle class="wo" cx="32" cy="52" r="16"/><circle class="wo" cx="48" cy="42" r="19"/><circle class="wo" cx="64" cy="50" r="17"/>' +
  '<circle class="wo" cx="46" cy="62" r="17"/><circle class="wo" cx="26" cy="62" r="11"/><circle class="wo" cx="68" cy="62" r="12"/>' +
  '<ellipse class="dk" cx="80" cy="46" rx="12" ry="14"/><ellipse class="dk" cx="72" cy="36" rx="8" ry="4" transform="rotate(-25 72 36)"/>' +
  '<circle class="wh" cx="84" cy="43" r="4"/><circle class="ey" cx="85" cy="43" r="2"/>');

export const STAR = L(
  '<polygon class="ye" points="' + STAR_POINTS + '"/>' +
  '<circle class="pk" cx="37" cy="56" r="4"/><circle class="pk" cx="63" cy="56" r="4"/>' +
  '<circle class="ey" cx="43" cy="48" r="3.4"/><circle class="ey" cx="57" cy="48" r="3.4"/><path class="ln" d="M44 57 Q50 63 56 57"/>');

export const FISH = L(
  '<polygon class="pk" points="6,28 30,50 6,72"/><path class="pk" d="M46 30 Q56 12 70 30 Z"/>' +
  '<ellipse class="or" cx="55" cy="50" rx="34" ry="23"/><path class="ln" d="M44 34 Q38 50 44 66"/>' +
  '<circle class="wh" cx="74" cy="45" r="7"/><circle class="ey" cx="76" cy="45" r="3.5"/><path class="ln" d="M86 57 Q82 60 78 57"/>');

export const MOON = L(
  '<path class="ye" d="M60 10 A40 40 0 1 0 90 70 A32 32 0 1 1 60 10 Z"/><circle class="pk" cx="40" cy="66" r="4"/>' +
  '<path class="ln" d="M33 54 Q38 58 43 54"/><path class="ln" d="M38 72 Q44 76 50 71"/>');

export const TREE = L(
  '<rect class="br" x="42" y="56" width="16" height="36" rx="3"/><circle class="gr" cx="50" cy="36" r="25"/>' +
  '<circle class="gr" cx="30" cy="52" r="16"/><circle class="gr" cx="70" cy="52" r="16"/>' +
  '<circle class="pk" cx="40" cy="30" r="4"/><circle class="pk" cx="62" cy="44" r="4"/>');

export const SUN = L(
  [0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
    const r = (a * Math.PI) / 180;
    return '<circle class="or" cx="' + (50 + Math.cos(r) * 37).toFixed(1) + '" cy="' + (50 + Math.sin(r) * 37).toFixed(1) + '" r="7"/>';
  }).join('') +
  '<circle class="ye" cx="50" cy="50" r="25"/><circle class="ey" cx="42" cy="46" r="3.2"/><circle class="ey" cx="58" cy="46" r="3.2"/>' +
  '<path class="ln" d="M42 57 Q50 64 58 57"/>');

export const SOCK = L(
  '<path class="pk" d="M36 8 H64 V56 Q64 66 74 70 L84 74 Q94 80 88 90 Q83 97 70 94 L42 86 Q30 82 32 70 L36 58 Z"/>' +
  '<rect class="wh" x="36" y="8" width="28" height="12"/><rect class="ye" x="36" y="30" width="28" height="7"/>' +
  '<rect class="ye" x="36" y="44" width="28" height="7"/>');

export const CHICKEN = L(
  '<rect class="ye" x="40" y="80" width="5" height="14"/><rect class="ye" x="56" y="80" width="5" height="14"/>' +
  '<circle class="pk" cx="66" cy="18" r="5"/><circle class="pk" cx="74" cy="17" r="5"/>' +
  '<ellipse class="wo" cx="48" cy="62" rx="30" ry="24"/><circle class="wo" cx="70" cy="34" r="15"/>' +
  '<polygon class="ye" points="83,31 95,36 83,41"/><ellipse class="pk" cx="80" cy="46" rx="3.5" ry="5"/>' +
  '<circle class="ey" cx="74" cy="31" r="2.6"/><path class="ln" d="M34 58 Q44 72 56 60"/>');

export const OWL = L(
  '<polygon class="ow" points="20,34 26,8 42,26"/><polygon class="ow" points="80,34 74,8 58,26"/>' +
  '<ellipse class="ow" cx="50" cy="58" rx="33" ry="36"/><ellipse class="lt" cx="50" cy="68" rx="20" ry="22"/>' +
  '<circle class="wh" cx="37" cy="42" r="12"/><circle class="wh" cx="63" cy="42" r="12"/>' +
  '<circle class="ey" cx="39" cy="43" r="5.5"/><circle class="ey" cx="61" cy="43" r="5.5"/><polygon class="ye" points="45,52 55,52 50,61"/>' +
  '<ellipse class="ye" cx="40" cy="94" rx="7" ry="4"/><ellipse class="ye" cx="60" cy="94" rx="7" ry="4"/>');

export const STICKER = L('<polygon class="ye" points="' + STAR_POINTS + '"/>');

const icon = (d, extra = '') => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' + d + extra + '</svg>';
export const ICON_SPEAKER = icon('<path d="M4 9v6h4l5 4V5L8 9z" fill="currentColor"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/>');
export const ICON_BACK = icon('<path d="M15 5l-7 7 7 7"/>');
export const ICON_LOCK = icon('<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>');
