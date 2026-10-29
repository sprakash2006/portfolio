"use client";

import { useEffect, useRef } from "react";

// About one particle per this many square pixels of screen
const AREA_PER_POINT = 14000;
const SPEED = 0.25;
// Particles within REACH of the cursor link to neighbours closer than LINK
const REACH = 160;
const LINK = 100;

type Point = { x: number; y: number; vx: number; vy: number };

// Dark-mode backdrop: tiny particles drift slowly across the screen; near the cursor they join
// up with faint lines that turn red the closer they are to it. Pauses in background tabs and
// stays still for visitors who prefer reduced motion.
export default function Constellation() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let points: Point[] = [];
    let frame = 0;
    const mouse = { x: 0, y: 0, active: false };

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / AREA_PER_POINT);
      points = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED * 2,
        vy: (Math.random() - 0.5) * SPEED * 2,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "rgb(255 255 255 / 0.35)";
      for (const p of points) {
        if (!reduceMotion) {
          p.x = (p.x + p.vx + w) % w;
          p.y = (p.y + p.vy + h) % h;
        }
        ctx.fillRect(p.x, p.y, 1.6, 1.6);
      }

      if (mouse.active) {
        // Only particles near the cursor can link, so this stays cheap
        const near = points
          .map((p) => ({ p, d: Math.hypot(p.x - mouse.x, p.y - mouse.y) }))
          .filter((n) => n.d < REACH);
        ctx.lineWidth = 1;
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const a = near[i];
            const b = near[j];
            const d = Math.hypot(a.p.x - b.p.x, a.p.y - b.p.y);
            if (d >= LINK) continue;
            const alpha = (1 - Math.min(a.d, b.d) / REACH) * (1 - d / LINK) * 0.9;
            ctx.strokeStyle = `rgb(239 68 68 / ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(a.p.x, a.p.y);
            ctx.lineTo(b.p.x, b.p.y);
            ctx.stroke();
          }
        }
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
      if (reduceMotion) draw();
    };
    const onLeave = () => {
      mouse.active = false;
      if (reduceMotion) draw();
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
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="block h-full w-full" />;
}
