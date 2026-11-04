"use client";

import { useEffect, useRef } from "react";

// Faint star dust: about one speck per this many square pixels, drawn once and moved as a sheet
const AREA_PER_DUST = 2600;
// Twinkling stars: about one per this many square pixels
const AREA_PER_STAR = 7000;
// Bright stars with a glow and cross-shaped spikes: about one per this many square pixels
const AREA_PER_GIANT = 450000;
// Share of stars that gather into a few loose clusters instead of spreading evenly
const CLUSTERED = 0.35;
const CLUSTERS = 4;
// Depth layers, far to near: nearer stars are bigger, brighter, drift faster and shift more with the cursor
const LAYERS = [
  { share: 0.6, size: 0.6, alpha: 0.3, drift: 0.015, parallax: 6 },
  { share: 0.3, size: 0.95, alpha: 0.42, drift: 0.035, parallax: 14 },
  { share: 0.1, size: 1.4, alpha: 0.55, drift: 0.07, parallax: 26 },
];
const DUST_PARALLAX = 3;
const GIANT_PARALLAX = 32;
// Star tints, mostly white with a few warm ones
const TINTS = ["255 255 255", "255 255 255", "255 255 255", "255 244 232", "255 232 210"];
// Light theme: ink specks on the paper background, mostly warm charcoal with a few in the red accent
const LIGHT_TINTS = ["40 30 25", "40 30 25", "40 30 25", "70 55 45", "239 68 68"];
const LIGHT_DUST = "40 30 25";
// Average seconds between shooting stars
const METEOR_EVERY = 9;

type Star = { x: number; y: number; layer: number; tint: string; phase: number; speed: number };
type Giant = { x: number; y: number; size: number; tint: string; phase: number };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };

// Page backdrop: a deep-space sky (black with white stars, or paper with ink specks when light). A fine sheet of star dust sits behind three
// depths of twinkling stars, some gathered into loose clusters, plus a few bright stars with
// spikes and the odd shooting star. Layers shift with the cursor for depth. Pauses in background
// tabs and stays still for visitors who prefer reduced motion.
export default function DeepSpace({ light = false }: { light?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const dust = document.createElement("canvas");
    let w = 0;
    let h = 0;
    let stars: Star[] = [];
    let giants: Giant[] = [];
    let meteor: Meteor | null = null;
    let frame = 0;
    let last = performance.now();
    // Cursor offset from the centre (-0.5..0.5), eased so the parallax glides
    const target = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };

    const palette = light ? LIGHT_TINTS : TINTS;
    const dustRgb = light ? LIGHT_DUST : "255 255 255";
    const tint = () => palette[Math.floor(Math.random() * palette.length)];

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Loose clusters: stars scatter around a few centres with a bell-shaped spread
      const centres = Array.from({ length: CLUSTERS }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.min(w, h) * (0.08 + Math.random() * 0.12),
      }));
      const place = () => {
        if (Math.random() > CLUSTERED) return { x: Math.random() * w, y: Math.random() * h };
        const c = centres[Math.floor(Math.random() * CLUSTERS)];
        const a = Math.random() * Math.PI * 2;
        const d = c.r * Math.sqrt(-2 * Math.log(Math.random() || 1e-6)) * 0.6;
        return { x: (c.x + Math.cos(a) * d + w) % w, y: (c.y + Math.sin(a) * d + h) % h };
      };

      stars = Array.from({ length: Math.round((w * h) / AREA_PER_STAR) }, () => {
        const r = Math.random();
        const layer = r < LAYERS[0].share ? 0 : r < LAYERS[0].share + LAYERS[1].share ? 1 : 2;
        return {
          ...place(),
          layer,
          tint: tint(),
          phase: Math.random() * Math.PI * 2,
          speed: 0.5 + Math.random() * 1.8,
        };
      });

      giants = Array.from({ length: Math.max(2, Math.round((w * h) / AREA_PER_GIANT)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: 1.6 + Math.random() * 1.2,
        tint: tint(),
        phase: Math.random() * Math.PI * 2,
      }));

      // Star dust never twinkles, so it is drawn once to its own canvas and moved as a sheet
      dust.width = canvas.width;
      dust.height = canvas.height;
      const dctx = dust.getContext("2d");
      if (dctx) {
        dctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        for (let i = Math.round((w * h) / AREA_PER_DUST); i > 0; i--) {
          const p = place();
          dctx.fillStyle = `rgb(${dustRgb} / ${0.04 + Math.random() * 0.14})`;
          dctx.fillRect(p.x, p.y, 0.8, 0.8);
        }
      }
    };

    // Draws the dust sheet four times so it wraps seamlessly as it shifts
    const drawDust = () => {
      const dx = (((-offset.x * DUST_PARALLAX) % w) + w) % w;
      const dy = (((-offset.y * DUST_PARALLAX) % h) + h) % h;
      for (const ox of [dx - w, dx]) {
        for (const oy of [dy - h, dy]) ctx.drawImage(dust, ox, oy, w, h);
      }
    };

    const drawGiant = (g: Giant, t: number) => {
      const x = (g.x - offset.x * GIANT_PARALLAX + w) % w;
      const y = (g.y - offset.y * GIANT_PARALLAX + h) % h;
      const pulse = reduceMotion ? 1 : 0.8 + 0.2 * Math.sin(t * 0.8 + g.phase);
      const glow = ctx.createRadialGradient(x, y, 0, x, y, g.size * 7);
      glow.addColorStop(0, `rgb(${g.tint} / ${0.18 * pulse})`);
      glow.addColorStop(1, `rgb(${g.tint} / 0)`);
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(x, y, g.size * 7, 0, Math.PI * 2);
      ctx.fill();
      // Thin cross-shaped spikes that fade out from the centre
      const len = g.size * 9 * pulse;
      for (const [ax, ay] of [[1, 0], [0, 1]]) {
        const spike = ctx.createLinearGradient(x - ax * len, y - ay * len, x + ax * len, y + ay * len);
        spike.addColorStop(0, `rgb(${g.tint} / 0)`);
        spike.addColorStop(0.5, `rgb(${g.tint} / ${0.35 * pulse})`);
        spike.addColorStop(1, `rgb(${g.tint} / 0)`);
        ctx.strokeStyle = spike;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(x - ax * len, y - ay * len);
        ctx.lineTo(x + ax * len, y + ay * len);
        ctx.stroke();
      }
      ctx.fillStyle = `rgb(${g.tint} / ${0.6 * pulse})`;
      ctx.beginPath();
      ctx.arc(x, y, g.size * 0.8, 0, Math.PI * 2);
      ctx.fill();
    };

    const draw = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, w, h);

      offset.x += (target.x - offset.x) * 0.04;
      offset.y += (target.y - offset.y) * 0.04;

      drawDust();

      for (const s of stars) {
        const l = LAYERS[s.layer];
        if (!reduceMotion) s.x = (s.x - l.drift + w) % w;
        const x = (s.x - offset.x * l.parallax + w) % w;
        const y = (s.y - offset.y * l.parallax + h) % h;
        const twinkle = reduceMotion ? 1 : 0.45 + 0.55 * Math.sin(t * s.speed + s.phase) ** 2;
        ctx.fillStyle = `rgb(${s.tint} / ${l.alpha * twinkle})`;
        ctx.beginPath();
        ctx.arc(x, y, l.size, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const g of giants) drawGiant(g, t);

      if (!reduceMotion) {
        if (!meteor && Math.random() < dt / METEOR_EVERY) {
          const angle = Math.PI * (0.15 + Math.random() * 0.15);
          const speed = 700 + Math.random() * 400;
          meteor = {
            x: Math.random() * w * 0.8 + w * 0.2,
            y: Math.random() * h * 0.4,
            vx: -Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
          };
        }
        if (meteor) {
          meteor.x += meteor.vx * dt;
          meteor.y += meteor.vy * dt;
          meteor.life -= dt * 1.2;
          const tail = 0.12;
          const grad = ctx.createLinearGradient(
            meteor.x, meteor.y, meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail,
          );
          grad.addColorStop(0, `rgb(${dustRgb} / ${Math.max(meteor.life, 0) * 0.5})`);
          grad.addColorStop(1, `rgb(${dustRgb} / 0)`);
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(meteor.x, meteor.y);
          ctx.lineTo(meteor.x - meteor.vx * tail, meteor.y - meteor.vy * tail);
          ctx.stroke();
          if (meteor.life <= 0 || meteor.y > h || meteor.x < 0) meteor = null;
        }
        frame = requestAnimationFrame(draw);
      }
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || reduceMotion) return;
      target.x = e.clientX / w - 0.5;
      target.y = e.clientY / h - 0.5;
    };
    const onVisibility = () => {
      cancelAnimationFrame(frame);
      last = performance.now();
      if (!document.hidden && !reduceMotion) frame = requestAnimationFrame(draw);
    };
    const onResize = () => {
      resize();
      if (reduceMotion) draw(performance.now());
    };

    resize();
    window.addEventListener("resize", onResize);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [light]);

  return <canvas ref={ref} aria-hidden className={`absolute inset-0 block h-full w-full ${light ? "bg-background" : "bg-black"}`} />;
}
