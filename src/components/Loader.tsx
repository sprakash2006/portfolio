"use client";

import { useEffect, useState } from "react";

const WORDS = ["Design", "Build", "Ship", "Prakash"];
// When each word appears (ms); the name stays a little longer
const AT = [0, 300, 600, 900];
const HIDE_WORDS = 1420;
const OPEN = 1540; // the halves start sliding apart
const DONE = OPEN + 900;

// Page loader: words flash in the middle (Design. Build. Ship. Prakash.), then the screen
// splits along a red line and the two halves slide apart to reveal the page. The hero
// signature is timed to start drawing as the halves open (.signature in globals.css).
// Skipped for visitors who prefer reduced motion.
export default function Loader() {
  const [word, setWord] = useState(0);
  const [wordsHidden, setWordsHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const timers = [
      ...AT.slice(1).map((t, i) => setTimeout(() => setWord(i + 1), t)),
      setTimeout(() => setWordsHidden(true), HIDE_WORDS),
      setTimeout(() => setOpen(true), OPEN),
      setTimeout(() => setDone(true), DONE),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  if (done) return null;

  const half = "absolute inset-x-0 h-[50.5%] bg-background transition-transform duration-[900ms] ease-[cubic-bezier(.77,0,.18,1)]";

  return (
    // motion-reduce:hidden skips the whole loader for visitors who prefer reduced motion
    <div aria-hidden className={`fixed inset-0 z-[100] motion-reduce:hidden ${open ? "pointer-events-none" : ""}`}>
      <div className={`${half} top-0 border-b border-red-500/60 ${open ? "-translate-y-full" : ""}`} />
      <div className={`${half} bottom-0 ${open ? "translate-y-full" : ""}`} />
      <div
        className={`absolute inset-0 flex items-center justify-center font-display text-[clamp(3rem,10vw,7rem)] font-black uppercase leading-none tracking-[-0.04em] transition-opacity duration-200 ${
          wordsHidden ? "opacity-0" : ""
        }`}
      >
        <span key={word} className="inline-block animate-loader-word">
          {WORDS[word]}
          <span className="text-red-500">.</span>
        </span>
      </div>
    </div>
  );
}
