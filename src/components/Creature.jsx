// The line-art creature. Everything is drawn from three numbers:
//   t1  (0 to 1)  caterpillar -> chrysalis
//   t2  (0 to 1)  chrysalis -> butterfly
//   scroll        scroll distance, drives crawling and wing flaps
// The drawing area is 800 x 800 and scales to fit.

const CX = 400;
const GROUND = 603; // top of the lower branch

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

// Ten body segments, tail (0) to head (9).
const SEGMENTS = 10;
const CRAWL_RADIUS = [23, 25, 27, 28, 29, 30, 31, 32, 33, 39];
const CHRYSALIS_RADIUS = [8, 18, 28, 36, 42, 44, 42, 36, 26, 14];

function Wing() {
  // Right-hand wings. The left side is a mirror image of this.
  return (
    <g>
      <path className="solid" d="M 6 -16 C 40 -112 130 -156 192 -112 C 218 -88 176 -22 6 4 Z" />
      <path className="solid" d="M 6 4 C 112 -4 178 32 162 92 C 150 142 58 138 6 40 Z" />
      <g opacity="0.55">
        <path d="M 6 -16 C 40 -112 130 -156 192 -112 C 218 -88 176 -22 6 4 Z" transform="translate(6 -6) scale(0.78) translate(-6 6)" />
        <path d="M 6 4 C 112 -4 178 32 162 92 C 150 142 58 138 6 40 Z" transform="translate(6 20) scale(0.76) translate(-6 -20)" />
      </g>
      <g opacity="0.45" transform="translate(8 0) scale(0.8) translate(-8 0)">
        <path d="M 8 -8 L 160 -112" />
        <path d="M 8 -6 L 184 -78" />
        <path d="M 8 -2 L 168 -40" />
        <path d="M 8 8 L 146 36" />
        <path d="M 8 14 L 150 86" />
        <path d="M 8 22 L 100 118" />
      </g>
      <circle cx="150" cy="-96" r="6" />
      <circle cx="128" cy="68" r="8" />
    </g>
  );
}

export default function Creature({ t1, t2, scroll, calm }) {
  const phase = scroll * 0.011;

  // ── Segment positions: blend from "crawling" to "hanging" ──
  const segments = [];
  for (let i = 0; i < SEGMENTS; i++) {
    const lift = 16 * (0.5 + 0.5 * Math.sin(phase - i * 0.72));
    const xCrawl = 170 + i * 44;
    const yCrawl = GROUND - CRAWL_RADIUS[i] - lift;
    const yHang = 232 + i * 28;

    // Each segment starts a little after the one before it, so the body
    // gathers up from the tail instead of moving all at once.
    const e = ease(clamp((t1 - 0.45 * (i / (SEGMENTS - 1))) / 0.55));

    segments.push({
      i,
      e,
      x: lerp(xCrawl, CX, e),
      y: lerp(yCrawl, yHang, e) - Math.sin(Math.PI * e) * 46,
      r: lerp(CRAWL_RADIUS[i], CHRYSALIS_RADIUS[i], e),
      
    });
  }
  const head = segments[SEGMENTS - 1];

  // ── Opacities for each part of the scene ──
  const legsOpacity = 1 - clamp(t1 * 4);
  const faceOpacity = 1 - clamp(head.e * 2.5);
  const lowerBranch = 1 - ease(clamp(t1 * 1.6));
  const upperBranch = ease(clamp(t1 * 1.4 - 0.1)) * (1 - 0.55 * t2);
  const threadOpacity = ease(clamp(t1 * 1.6 - 0.3));
  const crack = clamp(t2 / 0.3);
  const shellOpacity = lerp(1, 0.1, ease(clamp((t2 - 0.3) / 0.4)));

  // The shell sways very slightly once it is hanging.
  const sway = calm ? 0 : Math.sin(scroll * 0.006) * 1.6 * ease(clamp((t1 - 0.8) / 0.2));

  // ── Butterfly ──
  const u = ease(clamp((t2 - 0.28) / 0.62));
  const bodyOpacity = clamp((t2 - 0.26) / 0.12);
  const flap = calm ? 1 : 0.88 + 0.12 * Math.cos(scroll * 0.022);
  const butterfly = {
    x: CX,
    y: lerp(470, 395, u) + (calm ? 0 : Math.sin(scroll * 0.01) * 5 * u),
    scale: lerp(0.42, 1, u),
    wingX: u * flap,
    wingY: lerp(0.45, 1, u),
  };

  return (
    <svg className="creature" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
      {/* Branches */}
      <g opacity={lowerBranch}>
        <path d="M 30 618 Q 400 606 770 622" />
        <path d="M 30 628 Q 400 616 770 632" opacity="0.5" />
      </g>
      <g opacity={upperBranch}>
        <path d="M 40 122 Q 400 98 760 124" />
        <path d="M 40 132 Q 400 108 760 134" opacity="0.5" />
      </g>

      {/* Silk thread */}
      <line x1={CX} y1="111" x2={CX} y2="226" opacity={threadOpacity} />

      {/* Caterpillar / chrysalis */}
      <g opacity={shellOpacity} transform={`rotate(${sway} ${CX} 111)`}>
        {/* Legs sit behind the body */}
        <g opacity={legsOpacity}>
          {segments.slice(0, SEGMENTS - 1).map((s) => {
            const footY = Math.min(GROUND + 3, s.y + s.r + 9);
            return (
              <g key={`leg-${s.i}`}>
                <path d={`M ${s.x + 2} ${s.y + s.r * 0.8} L ${s.x + 4} ${footY}`} />
                <path d={`M ${s.x - 2} ${footY} L ${s.x + 9} ${footY}`} />
              </g>
            );
          })}
        </g>

        {segments.map((s) => (
          <g key={`seg-${s.i}`}>
            <circle className="solid" cx={s.x} cy={s.y} r={s.r} />
            {s.i > 0 && s.i < SEGMENTS - 1 && (
              <circle className="ink" cx={s.x} cy={s.y - s.r * 0.15} r="1.8" opacity={1 - s.e} />
            )}
          </g>
        ))}

        {/* Face */}
        <g opacity={faceOpacity}>
          <circle className="ink" cx={head.x + head.r * 0.38} cy={head.y - head.r * 0.15} r="3.6" />
          <path d={`M ${head.x + head.r * 0.58} ${head.y + head.r * 0.35} Q ${head.x + head.r * 0.4} ${head.y + head.r * 0.55} ${head.x + head.r * 0.18} ${head.y + head.r * 0.48}`} />
          <path d={`M ${head.x + head.r * 0.2} ${head.y - head.r * 0.92} Q ${head.x + head.r * 0.35} ${head.y - head.r * 1.6} ${head.x + head.r * 0.75} ${head.y - head.r * 1.75}`} />
          <path d={`M ${head.x + head.r * 0.5} ${head.y - head.r * 0.85} Q ${head.x + head.r * 0.8} ${head.y - head.r * 1.4} ${head.x + head.r * 1.2} ${head.y - head.r * 1.4}`} />
        </g>

        {/* Crack where the butterfly will come out */}
        <path
          d="M 391 262 L 405 288 L 393 312 L 408 338 L 395 362 L 410 388 L 399 412"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - crack}
          opacity={t1 > 0.9 ? 1 : 0}
        />
      </g>

      {/* Butterfly */}
      {t2 > 0.26 && (
        <g transform={`translate(${butterfly.x} ${butterfly.y}) scale(${butterfly.scale})`} opacity={bodyOpacity}>
          <g transform={`scale(${butterfly.wingX} ${butterfly.wingY})`}>
            <Wing />
            <g transform="scale(-1 1)">
              <Wing />
            </g>
          </g>
          <ellipse className="solid" cx="0" cy="40" rx="5.5" ry="42" />
          <ellipse className="solid" cx="0" cy="-12" rx="7" ry="20" />
          <circle className="solid" cx="0" cy="-42" r="8.5" />
          <path d="M -3 -48 Q -14 -80 -34 -98" />
          <path d="M 3 -48 Q 14 -80 34 -98" />
          <circle className="ink" cx="-34" cy="-98" r="3" />
          <circle className="ink" cx="34" cy="-98" r="3" />
        </g>
      )}
    </svg>
  );
}
