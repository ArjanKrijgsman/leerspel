// Minigame "Klankenvangst": welk plaatje begint met deze klank?
import { MOON, FISH, TREE, SUN, SOCK, CHICKEN, ICON_SPEAKER } from '../art.js';

const WORDS = [
  { woord: 'maan', klank: 'mmm', letter: 'm', art: MOON },
  { woord: 'vis', klank: 'vvv', letter: 'v', art: FISH },
  { woord: 'boom', klank: 'buh', letter: 'b', art: TREE },
  { woord: 'zon', klank: 'zzz', letter: 'z', art: SUN },
  { woord: 'sok', klank: 'sss', letter: 's', art: SOCK },
  { woord: 'kip', klank: 'kuh', letter: 'k', art: CHICKEN }
];
const CHOICES = { 1: 2, 2: 3, 3: 4 };

const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export default function klanken(ctx) {
  let k = null;

  function round() {
    const pool = shuffle(WORDS.filter((w) => !k || w.woord !== k.doel.woord));
    const doel = pool[0];
    const opts = shuffle([doel, ...shuffle(WORDS.filter((w) => w !== doel)).slice(0, CHOICES[ctx.level()] - 1)]);
    k = { doel, opts, wrong: [], done: false };
    ctx.setMsg('Welk plaatje begint met ' + doel.klank + '?');
  }
  round();

  return {
    stage() {
      const pics = k.opts.map((o) =>
        '<button class="pic surface' + (k.wrong.includes(o.woord) ? ' nope' : '') + (k.done && o === k.doel ? ' yes' : '') +
        '" data-g="pick" data-w="' + o.woord + '">' + o.art + o.woord + '</button>').join('');
      return '<div class="klank">' +
        '<button class="letter surface" data-g="hear" aria-label="Luister naar de klank">' + k.doel.letter + '<span>' + ICON_SPEAKER + 'luister</span></button>' +
        '<div class="pics" style="--n:' + k.opts.length + '">' + pics + '</div></div>' +
        (k.done ? '<div class="answers"><button class="k-btn wide" data-g="again">Volgende</button></div>' : '');
    },

    click(el) {
      const act = el.dataset.g;
      if (act === 'again') { round(); return {}; }
      if (act === 'hear') { ctx.say(k.doel.klank); return { noRender: true }; }
      if (act === 'pick') {
        if (k.done) return { noRender: true };
        const w = el.dataset.w;
        if (w === k.doel.woord) {
          k.done = true;
          const change = ctx.record(k.wrong.length === 0);
          ctx.reward();
          ctx.setMsg('Ja! ' + w.charAt(0).toUpperCase() + w.slice(1) + ' begint met ' + k.doel.klank + '.' + (change > 0 ? ' Knap! Nu komen er meer plaatjes.' : ''));
          return { burst: el.getBoundingClientRect() };
        }
        if (!k.wrong.includes(w)) k.wrong.push(w);
        ctx.setMsg('Dat is een ' + w + '. Luister nog eens: ' + k.doel.klank + '.');
        return {};
      }
      return { noRender: true };
    }
  };
}
