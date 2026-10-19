// Minigame "Tel de dieren": tik de figuren aan om te tellen en kies het goede getal.
const RANGE = { 1: [1, 5], 2: [3, 8], 3: [5, 10] };
const SLOTS = [];
for (const top of [4, 50]) for (const left of [3, 22, 41, 60, 79]) SLOTS.push([left, top]);

const shuffle = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

export default function tellen(ctx) {
  let t = null;

  function round() {
    const [lo, hi] = RANGE[ctx.level()];
    let n;
    do { n = lo + Math.floor(Math.random() * (hi - lo + 1)); } while (t && n === t.n && hi > lo);
    const pos = shuffle(SLOTS).slice(0, n).map(([x, y]) => [x + Math.random() * 4 - 2, y + Math.random() * 6 - 3]);
    const others = shuffle([n - 2, n - 1, n + 1, n + 2].filter((x) => x >= 1 && x <= 10)).slice(0, 2);
    t = { n, pos, nums: [], count: 0, opts: [n, ...others].sort((a, b) => a - b), wrong: [], done: false };
    ctx.setMsg('Hoeveel ' + ctx.world.meer + ' zie je? Tik ze aan en tel mee.');
  }
  round();

  return {
    stage() {
      const w = ctx.world;
      const items = t.pos.map((p, i) =>
        '<button class="item" data-g="count" data-i="' + i + '" style="left:' + p[0].toFixed(1) + '%;top:' + p[1].toFixed(1) + '%" aria-label="' + w.een + '">' +
        w.art + '<span class="num">' + (t.nums[i] || '') + '</span></button>').join('');
      const answers = t.done
        ? '<button class="k-btn wide" data-g="again">Nog een keer</button>'
        : t.opts.map((o) => '<button class="k-btn num-btn' + (t.wrong.includes(o) ? ' nope' : '') + '" data-g="answer" data-n="' + o + '">' + o + '</button>').join('');
      return '<div class="field">' + items + '</div><div class="answers">' + answers + '</div>';
    },

    click(el) {
      const act = el.dataset.g;
      if (act === 'again') { round(); return {}; }
      if (act === 'count') {
        if (t.done) return { noRender: true };
        const i = +el.dataset.i;
        if (!t.nums[i]) {
          t.count++;
          t.nums[i] = t.count;
          el.querySelector('.num').textContent = t.count;
          ctx.say(String(t.count));
        }
        el.classList.remove('hop'); void el.offsetWidth; el.classList.add('hop');
        return { noRender: true };
      }
      if (act === 'answer') {
        if (t.done) return { noRender: true };
        const k = +el.dataset.n;
        if (k === t.n) {
          t.done = true;
          const change = ctx.record(t.wrong.length === 0);
          ctx.reward();
          ctx.setMsg('Goed zo! Het zijn er ' + t.n + '.' + (change > 0 ? ' Knap! Nu wordt het een beetje moeilijker.' : ''));
          return { burst: el.getBoundingClientRect() };
        }
        if (!t.wrong.includes(k)) t.wrong.push(k);
        ctx.setMsg(t.count < t.n
          ? 'Bijna! Tik ze een voor een aan en tel hardop mee.'
          : 'Bijna! Welk getal zei je bij de laatste?');
        return {};
      }
      return { noRender: true };
    }
  };
}
