import { useEffect, useRef, useState } from "react";

const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
const smoothstep = (a, b, x) => {
  const t = clamp((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

// Sets the page colors. In "dark" mode the page starts black and ends white;
// in "light" mode it starts white and ends black. The change happens while the
// butterfly emerges (t2 between 0.2 and 0.8).
function applyTheme(t2, mode) {
  const shift = smoothstep(0.2, 0.8, t2);
  const brightness = mode === "dark" ? shift : 1 - shift;
  const v = Math.round(brightness * 255);
  const root = document.documentElement;
  root.style.setProperty("--bg", `rgb(${v}, ${v}, ${v})`);
  root.style.setProperty("--fg", brightness < 0.5 ? "#fff" : "#000");
  root.style.colorScheme = brightness < 0.5 ? "dark" : "light";
}

// Watches the scroll position and turns it into three numbers:
//   t1     0 to 1   caterpillar becomes a chrysalis
//   t2     0 to 1   chrysalis becomes a butterfly
//   scroll raw (smoothed) scroll distance, used for crawling and wing flaps
// The stages are tied to the page sections marked with data-stage-start.
export function useMetamorphosis(mode) {
  const [frame, setFrame] = useState({ t1: 0, t2: 0, scroll: 0, calm: false });
  const modeRef = useRef(mode);
  const current = useRef({ t1: 0, t2: 0, scroll: 0 });

  useEffect(() => {
    modeRef.current = mode;
    applyTheme(current.current.t2, mode);
  }, [mode]);

  useEffect(() => {
    const target = { t1: 0, t2: 0, scroll: 0 };
    let marks = { y2: Infinity, y3: Infinity };
    let raf = 0;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let calm = motion.matches;
    const onMotionChange = (e) => {
      calm = e.matches;
    };
    motion.addEventListener("change", onMotionChange);

    const step = () => {
      raf = 0;
      const c = current.current;
      const k = calm ? 1 : 0.14;
      c.t1 += (target.t1 - c.t1) * k;
      c.t2 += (target.t2 - c.t2) * k;
      c.scroll += (target.scroll - c.scroll) * (calm ? 1 : 0.22);

      const done =
        Math.abs(target.t1 - c.t1) < 0.0005 &&
        Math.abs(target.t2 - c.t2) < 0.0005 &&
        Math.abs(target.scroll - c.scroll) < 0.3;
      if (done) {
        c.t1 = target.t1;
        c.t2 = target.t2;
        c.scroll = target.scroll;
      }

      applyTheme(c.t2, modeRef.current);
      setFrame({ t1: c.t1, t2: c.t2, scroll: c.scroll, calm });
      if (!done) raf = requestAnimationFrame(step);
    };

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(step);
    };

    function readScroll() {
      const y = window.scrollY;
      const vh = window.innerHeight;
      target.scroll = y;
      target.t1 = clamp((y - (marks.y2 - 1.1 * vh)) / (0.9 * vh));
      target.t2 = clamp((y - (marks.y3 - 1.1 * vh)) / (0.9 * vh));
      kick();
    }

    function measure() {
      const top = (selector) => {
        const el = document.querySelector(selector);
        return el ? el.getBoundingClientRect().top + window.scrollY : Infinity;
      };
      marks = {
        y2: top('[data-stage-start="2"]'),
        y3: top('[data-stage-start="3"]'),
      };
      readScroll();
    }

    measure();
    window.addEventListener("scroll", readScroll, { passive: true });
    window.addEventListener("resize", measure);
    window.addEventListener("load", measure);
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      motion.removeEventListener("change", onMotionChange);
      window.removeEventListener("scroll", readScroll);
      window.removeEventListener("resize", measure);
      window.removeEventListener("load", measure);
      observer.disconnect();
    };
  }, []);

  return frame;
}
