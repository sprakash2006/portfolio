"use client";

import { useEffect, useRef } from "react";

const LINES = 9;
const RED_LINE = 4; // index of the one red thread
const SPEED = 0.006;

// Light-mode backdrop: thin lines drift across the lower part of the screen like silk threads,
// warm grey with one red. Pauses in background tabs and stays still for visitors who prefer
// reduced motion.
export default function SilkLines() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let t = 0;
    let frame = 0;

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!reduceMotion) t += SPEED;
      ctx.clearRect(0, 0, w, h);
      // Wave sizes follow the screen height so the threads look the same on any screen
      const amp = h / 16;
      for (let k = 0; k < LINES; k++) {
        const red = k === RED_LINE;
        ctx.beginPath();
        ctx.strokeStyle = red ? "rgb(239 68 68 / 0.45)" : "rgb(41 28 20 / 0.09)";
        ctx.lineWidth = red ? 1.3 : 1;
        for (let x = -10; x <= w + 10; x += 8) {
          const y =
            h * 0.62 +
            Math.sin(x * (5 / w) + t + k * 0.35) * (amp * 0.5 + k * (amp / 15)) +
            Math.sin(x * (2 / w) - t * 0.7) * (amp * 0.65) -
            k * (amp / 7);
          if (x === -10) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden && !reduceMotion) frame = requestAnimationFrame(draw);
    };
    const onResize = () => {
      resize();
      if (reduceMotion) draw();
    };

    resize();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="block h-full w-full" />;
}
