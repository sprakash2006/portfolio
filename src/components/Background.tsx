"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { getTheme } from "@/lib/themes";
import { useThemeName } from "@/lib/useTheme";
import dynamic from "next/dynamic";

// three.js is heavy, so like the reference it only loads where the WebGL field is used
const PixelBlast = dynamic(() => import("./react-bits/PixelBlast"), { ssr: false });

// 8x8 Bayer matrix used to dither the wave field into dots
const BAYER = [
  0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22,
  3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21,
].map((n) => n / 64);

const SPACING = 17;
const DOT = 4;
const SPEED = 0.32;
const BLAST_RADIUS = 75;

// Only the left and right edges show dots; the content column stays clear.
const EDGE_MASK =
  "linear-gradient(to right, #000 0%, rgb(0 0 0 / 0.85) 15%, rgb(0 0 0 / 0.1) 32%, rgb(0 0 0 / 0.1) 68%, rgb(0 0 0 / 0.85) 85%, #000 100%)";

type Ripple = { x: number; y: number; start: number };

function DotField({ color }: { color: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const ripples: Ripple[] = [];
    let cols = 0;
    let rows = 0;
    let frame = 0;

    // Pre-render three dot sizes once, then stamp them
    const r = (DOT / 2) * dpr;
    const size = Math.ceil(2 * r + 4);
    const stamp = (scale: number) => {
      const c = document.createElement("canvas");
      c.width = c.height = size;
      const g = c.getContext("2d")!;
      g.fillStyle = color;
      g.beginPath();
      g.arc(size / 2, size / 2, r * scale, 0, Math.PI * 2);
      g.fill();
      return c;
    };
    const dots = [stamp(0.55), stamp(0.8), stamp(1)];

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      cols = Math.ceil(w / SPACING) + 1;
      rows = Math.ceil(h / SPACING) + 1;
    };
    resize();
    window.addEventListener("resize", resize);

    const onClick = (e: PointerEvent) => {
      if (ripples.length >= 3) ripples.shift();
      ripples.push({ x: e.clientX, y: e.clientY, start: performance.now() });
    };
    window.addEventListener("pointerdown", onClick, { passive: true });

    const t0 = performance.now();
    const draw = () => {
      const now = performance.now();
      const t = ((now - t0) / 1000) * SPEED;
      for (let i = ripples.length - 1; i >= 0; i--) {
        if (((now - ripples[i].start) / 1000) * 175 > BLAST_RADIUS) ripples.splice(i, 1);
      }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const step = SPACING * dpr;
      const half = size / 2;

      for (let y = 0; y < rows; y++) {
        const py = y * SPACING;
        const ny = py * 0.0045;
        for (let x = 0; x < cols; x++) {
          const px = x * SPACING;
          const nx = px * 0.0045;
          // Slow layered waves give each cell a 0..1 intensity
          const wave =
            Math.sin(nx * 1.1 + t * 0.38) * Math.cos(ny * 1.1 - t * 0.3) +
            0.35 * Math.sin((nx + ny) * 1.6 + t * 0.44) +
            0.18 * Math.cos((nx - ny) * 2.2 - t * 0.52);
          let v = (0.15 + 0.34 * ((wave / 1.53) * 0.5 + 0.5)) * 0.9;

          for (const rp of ripples) {
            const front = ((now - rp.start) / 1000) * 175;
            const d = Math.hypot(px - rp.x, py - rp.y);
            const off = Math.abs(d - front);
            if (off < 18) v += Math.exp(-((off / 14) ** 2)) * Math.max(0, 1 - d / BLAST_RADIUS) * 0.85;
          }

          const threshold = 0.88 * BAYER[(y % 8) * 8 + (x % 8)] + 0.08;
          if (v > threshold) {
            const over = v - threshold;
            const img = over > 0.28 ? dots[2] : over > 0.14 ? dots[1] : dots[0];
            ctx.drawImage(img, x * step - half, y * step - half);
          }
        }
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) frame = requestAnimationFrame(draw);
    };
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointerdown", onClick);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [color]);

  return <canvas ref={ref} aria-hidden className="block h-full w-full" />;
}

// Same rule as the reference: the WebGL field only on large, capable, motion-friendly devices
function canUseWebGLField() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return !(
    window.innerWidth < 768 ||
    window.matchMedia("(pointer: coarse)").matches ||
    (nav.hardwareConcurrency && nav.hardwareConcurrency <= 4) ||
    (nav.deviceMemory && nav.deviceMemory <= 4) ||
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function subscribeResize(cb: () => void) {
  window.addEventListener("resize", cb);
  return () => window.removeEventListener("resize", cb);
}

// Page backdrop: dot field at the edges, a square grid and a tinted glow from the top.
export default function Background() {
  const theme = getTheme(useThemeName());
  const rich = useSyncExternalStore(subscribeResize, canUseWebGLField, () => false);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: theme.dotsOpacity, maskImage: EDGE_MASK, WebkitMaskImage: EDGE_MASK }}
      >
        {rich ? (
          <PixelBlast
            key={theme.dots}
            variant="circle"
            pixelSize={6}
            color={theme.dots}
            patternScale={3}
            patternDensity={1.25}
            pixelSizeJitter={0.5}
            enableRipples
            rippleSpeed={0.3}
            rippleThickness={0.08}
            rippleIntensityScale={0.4}
            liquid
            liquidStrength={0.015}
            liquidRadius={0.4}
            liquidWobbleSpeed={2}
            speed={0.6}
            edgeFade={0.25}
            transparent
          />
        ) : (
          <DotField color={theme.dots} />
        )}
      </div>
      <div className="bg-grid-pattern absolute inset-0" />
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse at top, ${theme.glow}, transparent 70%)` }}
      />
    </div>
  );
}
