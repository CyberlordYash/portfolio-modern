/* ══════════════════════════════════════════════════════════════════
   SOLAR THEME — the palette is a function of the wall clock.

   Instead of flipping dark↔light on a timer, the site's ground colour
   travels a 24-hour ramp: black at 3am, warm at sunrise, pure white at
   noon, gold at 6pm, indigo at dusk, black again by midnight.

   Two decisions carry the whole design:

   1. Each stop authors an ink/paper PAIR, and every other token is
      derived from that pair. There is no independent ink ramp that can
      drift into its own ground — contrast is structural, not checked.

   2. Polarity is an EVENT, not a fade. A naive lerp from black→white
      spends the middle of dawn at mid-grey, and mid-grey ink on
      mid-grey paper is unreadable however pretty the tint. So each stop
      carries both an `inkLight` (for use over a dark ground) and an
      `inkDark`, and the renderer picks by the ground's own luminance.
      Ink swaps once, exactly as paper crosses 50% — which is also
      exactly when the `dark` class flips, so the binary `dark:`
      utilities throughout the tree change at the same instant instead
      of fighting a half-graded ground.

   The two crossover segments are additionally eased away from their
   centre (see EASE_FAST), so the ground races through the unusable
   mid-tones and lingers on the colours worth looking at. That is what
   makes it read as a sunrise rather than as a slow dissolve.
══════════════════════════════════════════════════════════════════ */

export type RGB = [number, number, number];

export type SolarStop = {
  /** Hour of day (0–24, fractional) this stop lands on. Must ascend. */
  h: number;
  /** Phase label — exposed as `data-phase` and shown on the dial. */
  name: string;
  /** The ground. */
  paper: RGB;
  /** Foreground when this stop's ground is dark. */
  inkLight: RGB;
  /** Foreground when this stop's ground is light. */
  inkDark: RGB;
  /**
   * Ease the segment that STARTS at this stop away from its midpoint, so
   * the ground crosses the unreadable mid-tones quickly. Only the two
   * polarity crossovers — dawn and dusk — set this.
   */
  fast?: boolean;
};

/* The ramp. Hours are local wall-clock and deliberately fixed rather
   than computed from latitude: the site asks for no location permission,
   and a portfolio does not need real astronomy — it needs a sky that
   agrees with the viewer's own window to within an hour. */
export const SOLAR_STOPS: SolarStop[] = [
  {
    h: 0.0,
    name: "DEEP NIGHT",
    paper: [0, 0, 0],
    inkLight: [255, 255, 255],
    inkDark: [0, 0, 0],
  },
  {
    h: 3.5,
    name: "LATE NIGHT",
    paper: [5, 5, 11],
    inkLight: [244, 244, 250],
    inkDark: [8, 8, 12],
  },
  {
    h: 5.6,
    name: "FIRST LIGHT",
    paper: [16, 16, 32],
    inkLight: [238, 234, 245],
    inkDark: [20, 18, 28],
    fast: true,
  },
  {
    h: 6.7,
    name: "SUNRISE",
    paper: [222, 199, 178],
    inkLight: [255, 250, 244],
    inkDark: [36, 26, 18],
  },
  {
    h: 8.2,
    name: "MORNING",
    paper: [247, 244, 240],
    inkLight: [255, 255, 255],
    inkDark: [22, 22, 26],
  },
  {
    h: 12.0,
    name: "NOON",
    paper: [255, 255, 255],
    inkLight: [255, 255, 255],
    inkDark: [0, 0, 0],
  },
  {
    h: 16.0,
    name: "AFTERNOON",
    paper: [251, 247, 242],
    inkLight: [255, 255, 255],
    inkDark: [20, 16, 12],
  },
  {
    h: 18.4,
    name: "GOLDEN HOUR",
    paper: [235, 208, 180],
    inkLight: [255, 252, 246],
    inkDark: [42, 29, 16],
    fast: true,
  },
  {
    h: 19.5,
    name: "DUSK",
    paper: [36, 26, 44],
    inkLight: [240, 232, 246],
    inkDark: [30, 22, 36],
  },
  {
    h: 21.6,
    name: "NIGHTFALL",
    paper: [10, 10, 18],
    inkLight: [246, 246, 250],
    inkDark: [12, 12, 18],
  },
];

/* ── maths ───────────────────────────────────────────────────────── */

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const mix = (a: RGB, b: RGB, t: number): RGB => [
  Math.round(lerp(a[0], b[0], t)),
  Math.round(lerp(a[1], b[1], t)),
  Math.round(lerp(a[2], b[2], t)),
];

/** Rec.709 luma on the encoded values — close enough to rank grounds. */
export const luma = (c: RGB) =>
  (0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]) / 255;

/**
 * Pushes t AWAY from 0.5. An exponent below 1 flattens both ends and
 * steepens the centre, so a crossover segment dwells on the sunrise
 * colour and sprints through the mid-grey nobody can read on.
 */
const EASE_FAST = (t: number) => {
  const p = 2 * t - 1;
  return 0.5 + 0.5 * Math.sign(p) * Math.pow(Math.abs(p), 0.42);
};

/**
 * The band of ground luminances no palette may occupy.
 *
 * A mid-grey ground is not a styling problem, it is an arithmetic one:
 * against luma 0.5 the best possible ink — pure white or pure black —
 * tops out near 4.6:1, so every `text-ink/70` on the page falls under
 * AA no matter which side the crossover picks. The ramp has to pass
 * from black to white, but it does not have to *linger* there, and it
 * does not have to stand on the worst rung.
 *
 * So a ground computed inside this band is pushed to the nearer edge —
 * toward black below the midpoint, toward white above it. Hue keeps
 * moving underneath, which turns the twenty-odd minutes of dawn into a
 * constant-lightness sweep from indigo to amber, and leaves exactly one
 * jump: 0.34 → 0.72, at the same instant the ink swaps and the `dark`
 * class flips. One event, not three staggered ones.
 */
const READABLE_BAND: [number, number] = [0.34, 0.72];
const BAND_MID = (READABLE_BAND[0] + READABLE_BAND[1]) / 2;

/* luma() is linear in the encoded channels, so the mix factor that lands
   a colour on a target luminance is exact — no search needed. Mixing
   toward black preserves the hue's channel ratios; toward white it
   desaturates, which is what a brightening sky does anyway. */
const pushBelow = (c: RGB, target: number): RGB => {
  const l = luma(c);
  return l <= target ? c : mix(c, [0, 0, 0], 1 - target / l);
};
const pushAbove = (c: RGB, target: number): RGB => {
  const l = luma(c);
  return l >= target ? c : mix(c, [255, 255, 255], (target - l) / (1 - l));
};

/** Locate the segment containing `hour`, and return its stops + eased t. */
function segment(hour: number) {
  const n = SOLAR_STOPS.length;
  let i = n - 1;
  for (let k = 0; k < n; k++) {
    const end = k === n - 1 ? 24 : SOLAR_STOPS[k + 1].h;
    if (hour >= SOLAR_STOPS[k].h && hour < end) {
      i = k;
      break;
    }
  }
  const a = SOLAR_STOPS[i];
  const b = SOLAR_STOPS[(i + 1) % n];
  // The final segment wraps midnight, so its end is 24 rather than b.h (0).
  const span = (i === n - 1 ? 24 : b.h) - a.h;
  const raw = span > 0 ? (hour - a.h) / span : 0;
  return { a, b, t: a.fast ? EASE_FAST(raw) : raw };
}

/* ── the palette ─────────────────────────────────────────────────── */

export type SolarTheme = {
  ink: RGB;
  paper: RGB;
  isDark: boolean;
  /** 0 at a pure white ground, 1 at pure black. */
  darkness: number;
  /** Phase label of the nearer stop. */
  phase: string;
  /** Fraction of the day elapsed, for the dial. */
  dayFraction: number;
  /** CSS custom properties to write onto `documentElement`. */
  vars: Record<string, string>;
};

const rgbStr = (c: RGB) => `${c[0]} ${c[1]} ${c[2]}`;
const rgba = (c: RGB, a: number) => `rgba(${c[0]}, ${c[1]}, ${c[2]}, ${a})`;

export function solarTheme(date: Date = new Date()): SolarTheme {
  const hour =
    date.getHours() + date.getMinutes() / 60 + date.getSeconds() / 3600;
  const { a, b, t } = segment(hour);

  const raw = mix(a.paper, b.paper, t);
  const isDark = luma(raw) < BAND_MID;
  const paper = isDark
    ? pushBelow(raw, READABLE_BAND[0])
    : pushAbove(raw, READABLE_BAND[1]);
  /* The swap, not a fade: ink is whichever partner suits the ground we
     actually landed on. Both candidates are themselves interpolated, so
     the chosen ink still carries the segment's hue. */
  const ink = isDark
    ? mix(a.inkLight, b.inkLight, t)
    : mix(a.inkDark, b.inkDark, t);

  const darkness = 1 - luma(paper);

  /* Everything below is derived. A new token belongs here and only
     here — there is no second table to keep in step. */
  const vars: Record<string, string> = {
    "--ink-rgb": rgbStr(ink),
    "--paper-rgb": rgbStr(paper),

    // Elevation ladder: the ground, stepped toward the ink.
    "--surface-0": `rgb(${paper.join(", ")})`,
    "--surface-1": `rgb(${mix(paper, ink, 0.035).join(", ")})`,
    "--surface-2": `rgb(${mix(paper, ink, 0.07).join(", ")})`,
    "--surface-3": `rgb(${mix(paper, ink, 0.12).join(", ")})`,

    "--line": rgba(ink, 0.11),
    "--line-strong": rgba(ink, 0.22),
    "--accent": `rgb(${mix(ink, paper, 0.22).join(", ")})`,

    "--hud-rgb": rgbStr(mix(ink, paper, 0.15)),
    "--hud-dim-rgb": rgbStr(mix(ink, paper, 0.38)),

    /* A dark ground needs less panel fill than a light one: white text
       over the WebGL ribbon separates on its own, black text does not.
       Graded rather than switched, so the twilight grounds get the
       in-between value they actually need. */
    "--panel-fill": rgba(paper, Number(lerp(0.62, 0.34, darkness).toFixed(3))),

    // Hollow-heading stroke: heavier as the ground darkens (see globals.css).
    "--heading-stroke-w": `${lerp(1.1, 1.75, darkness).toFixed(2)}px`,

    "--txt-halo": [
      `0 2px 10px ${rgba(paper, 0.95)}`,
      `0 0 18px ${rgba(paper, 0.85)}`,
      `0 0 4px ${rgba(paper, 0.9)}`,
    ].join(", "),
  };

  return {
    ink,
    paper,
    isDark,
    darkness,
    phase: (t < 0.5 ? a : b).name,
    dayFraction: hour / 24,
    vars,
  };
}

/* ── pre-paint ─────────────────────────────────────────────────────
   Runs blocking in <head> so the very first frame already has the right
   polarity. It deliberately does LESS than solarTheme(): only the class
   and the ink/paper pair, which is everything that would actually
   flash. The full token set lands microseconds later on mount, and the
   gap between "right polarity" and "right polarity plus a warmer line
   colour" is not perceptible.

   SOLAR_STOPS is embedded rather than re-declared, so the ramp has
   exactly one definition. The lerp below mirrors `segment()` — keep the
   two in step if the easing ever changes.
─────────────────────────────────────────────────────────────────────*/
export function prepaintScript() {
  const packed = JSON.stringify(
    SOLAR_STOPS.map((s) => [
      s.h,
      s.paper,
      s.inkLight,
      s.inkDark,
      s.fast ? 1 : 0,
    ]),
  );

  return [
    "(function(){try{",
    `var S=${packed};`,
    "var d=new Date(),H=d.getHours()+d.getMinutes()/60,n=S.length,i=n-1;",
    "for(var k=0;k<n;k++){var e=k===n-1?24:S[k+1][0];if(H>=S[k][0]&&H<e){i=k;break}}",
    "var a=S[i],b=S[(i+1)%n],sp=(i===n-1?24:b[0])-a[0],t=sp>0?(H-a[0])/sp:0;",
    "if(a[4]){var p=2*t-1;t=0.5+0.5*Math.sign(p)*Math.pow(Math.abs(p),0.42)}",
    "function m(x,y){return[Math.round(x[0]+(y[0]-x[0])*t),Math.round(x[1]+(y[1]-x[1])*t),Math.round(x[2]+(y[2]-x[2])*t)]}",
    "var P=m(a[1],b[1]),L=(0.2126*P[0]+0.7152*P[1]+0.0722*P[2])/255;",
    `var dk=L<${BAND_MID};`,
    // Same readability guard as solarTheme(); see READABLE_BAND.
    `var g=dk?${READABLE_BAND[0]}/L:0,w=dk?0:(${READABLE_BAND[1]}-L)/(1-L);`,
    "if(dk&&g<1){P=P.map(function(v){return Math.round(v*g)})}",
    "else if(!dk&&w>0){P=P.map(function(v){return Math.round(v+(255-v)*w)})}",
    "var I=dk?m(a[2],b[2]):m(a[3],b[3]),r=document.documentElement;",
    "r.classList[dk?'add':'remove']('dark');",
    "r.style.setProperty('--paper-rgb',P.join(' '));",
    "r.style.setProperty('--ink-rgb',I.join(' '));",
    "r.style.setProperty('--surface-0','rgb('+P.join(',')+')');",
    "r.style.colorScheme=dk?'dark':'light';",
    "}catch(e){}})();",
  ].join("");
}
