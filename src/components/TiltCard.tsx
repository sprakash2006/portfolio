"use client";

import { useEffect, useRef } from "react";

const TILT = 4; // max degrees in each direction
const PERSPECTIVE = 1000; // px
const HOVER_SCALE = 1.02;
const GLARE = 0.12; // peak glare opacity

// 3D tilt-on-hover card: tilts away from the pointer, lifts with a deeper shadow,
// and a soft glare follows the cursor. Writes styles directly (no re-renders) and
// stays flat on touch devices and for reduced-motion users.
export default function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const glareRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    const glare = glareRef.current;
    if (!card || !glare) return;
    const canTilt =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!canTilt) return;

    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width; // 0..1
        const y = (e.clientY - r.top) / r.height;
        // Inverted so the side under the pointer lifts towards the viewer
        const rotateY = (0.5 - x) * 2 * TILT;
        const rotateX = (y - 0.5) * 2 * TILT;
        card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${HOVER_SCALE})`;
        card.style.boxShadow = "0 25px 50px -12px rgb(0 0 0 / 0.5)";
        glare.style.opacity = "1";
        glare.style.background = `radial-gradient(circle at ${x * 100}% ${y * 100}%, rgb(255 255 255 / ${GLARE}) 0%, transparent 60%)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      card.style.transform = `perspective(${PERSPECTIVE}px) rotateX(0deg) rotateY(0deg) scale(1)`;
      card.style.boxShadow = "";
      glare.style.opacity = "0";
    };

    card.addEventListener("pointermove", onMove);
    card.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      card.removeEventListener("pointermove", onMove);
      card.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={`relative [transform-style:preserve-3d] transition-[transform,box-shadow] duration-200 ease-out will-change-transform ${className}`}
    >
      {children}
      <div
        ref={glareRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-200"
      />
    </div>
  );
}
