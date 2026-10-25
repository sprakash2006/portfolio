"use client";

import { useEffect, useState } from "react";

// Full-screen percentage counter shown on first paint, then fades away.
export default function Loader() {
  const [pct, setPct] = useState(0);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setPct((p) => {
        const next = Math.min(100, p + Math.ceil(Math.random() * 9));
        if (next === 100) {
          clearInterval(id);
          setTimeout(() => setGone(true), 350);
        }
        return next;
      });
    }, 45);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-6 bg-background transition-opacity duration-500 ${
        gone ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <div className="grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="h-2.5 w-2.5 animate-pixel-pulse rounded-[1px] bg-primary"
            style={{ animationDelay: `${(i * 137) % 900}ms` }}
          />
        ))}
      </div>
      <p className="font-pixel text-xs tabular-nums text-muted-foreground">{pct}%</p>
    </div>
  );
}
