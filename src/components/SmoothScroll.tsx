"use client";

import { useEffect } from "react";

// How much of the remaining distance the page covers each frame; lower = lazier, longer glide
const EASE = 0.045;

// Can this element (or one of its parents) scroll vertically on its own? Then leave the wheel
// to it, e.g. the mobile menu or a scrollable panel.
function inScrollable(el: Element | null, deltaY: number): boolean {
  for (; el && el !== document.documentElement; el = el.parentElement) {
    const { overflowY } = getComputedStyle(el);
    if ((overflowY === "auto" || overflowY === "scroll") && el.scrollHeight > el.clientHeight) {
      if (deltaY > 0 ? el.scrollTop + el.clientHeight < el.scrollHeight : el.scrollTop > 0) return true;
    }
  }
  return false;
}

// Lazy, delayed mouse-wheel scrolling: the wheel moves a target position and the page eases
// toward it over several frames, so it keeps gliding a moment after you stop. Touch, keyboard,
// anchor links and the scrollbar keep their normal behaviour; the glide picks up from wherever
// they leave the page. Off when the visitor prefers reduced motion.
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let target = window.scrollY;
    let current = window.scrollY;
    let frame = 0;
    let gliding = false;

    const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;

    const step = () => {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < 0.5) current = target;
      window.scrollTo({ top: current, behavior: "instant" });
      if (current !== target) frame = requestAnimationFrame(step);
      else gliding = false;
    };

    const onWheel = (e: WheelEvent) => {
      // Leave pinch-zoom, sideways scrolling and scrollable inner panels alone
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (inScrollable(e.target as Element, e.deltaY)) return;
      e.preventDefault();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      if (!gliding) current = target = window.scrollY;
      target = Math.min(maxScroll(), Math.max(0, target + delta));
      if (!gliding) {
        gliding = true;
        frame = requestAnimationFrame(step);
      }
    };

    // Any scroll we didn't cause (keys, links, scrollbar, touch) resets the glide to it
    const onScroll = () => {
      if (!gliding) current = target = window.scrollY;
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      gliding = false;
      current = target = window.scrollY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("keydown", stop);
    window.addEventListener("pointerdown", stop);
    window.addEventListener("hashchange", stop);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", stop);
      window.removeEventListener("pointerdown", stop);
      window.removeEventListener("hashchange", stop);
    };
  }, []);

  return null;
}
