"use client";

import { useEffect, useState } from "react";
import { ArrowUpIcon } from "./icons";

// Floating bottom-right button that appears after the first screen and scrolls back to the top.
export default function ScrollToTop() {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScroll = () => setShown(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function toTop() {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  }

  return (
    <button
      onClick={toTop}
      aria-label="Go to top"
      tabIndex={shown ? 0 : -1}
      className={`fixed bottom-5 right-5 z-40 rounded-full border border-border/60 bg-background/70 p-3 text-muted-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:text-primary sm:bottom-6 sm:right-6 ${
        shown ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
      }`}
    >
      <ArrowUpIcon className="h-4 w-4" />
    </button>
  );
}
