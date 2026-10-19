// Voorleesstem via de ingebouwde tekst-naar-spraak van het apparaat (Nederlands als dat er is).
// Later te vervangen door eigen opnames.
let enabled = true;
let nlVoice = null;

function pickVoice() {
  try {
    const voices = speechSynthesis.getVoices();
    nlVoice = voices.find((v) => /^nl[-_]NL/i.test(v.lang)) || voices.find((v) => /^nl/i.test(v.lang)) || null;
  } catch (e) { nlVoice = null; }
}

if ('speechSynthesis' in window) {
  pickVoice();
  speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
}

export function setVoice(on) {
  enabled = on;
  if (!on && 'speechSynthesis' in window) speechSynthesis.cancel();
}

export function say(text) {
  if (!enabled || !text || !('speechSynthesis' in window)) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'nl-NL';
    u.rate = 0.9;
    u.pitch = 1.15;
    if (nlVoice) u.voice = nlVoice;
    speechSynthesis.speak(u);
  } catch (e) { /* geen stem beschikbaar */ }
}
