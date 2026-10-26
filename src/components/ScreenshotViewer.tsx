"use client";

import Image from "next/image";
import { useState } from "react";
import TiltCard from "./TiltCard";

type Shot = { src: string; alt: string };

const button =
  "rounded-full border border-border/60 bg-card/40 p-2 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:pointer-events-none disabled:opacity-30";

// One project screenshot at a time, full width with the tilt-on-hover effect;
// the ‹ › buttons (or arrow keys) step through the rest.
export default function ScreenshotViewer({ shots, label }: { shots: Shot[]; label: string }) {
  const [index, setIndex] = useState(0);
  const go = (to: number) => setIndex(Math.min(shots.length - 1, Math.max(0, to)));
  const shot = shots[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
      className="space-y-4 rounded-xl outline-none focus-visible:ring-1 focus-visible:ring-primary/50"
    >
      <TiltCard className="rounded-xl">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border/60 bg-card">
          {/* key restarts the fade-in whenever the screenshot changes */}
          <Image
            key={shot.src + index}
            src={shot.src}
            alt={shot.alt}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            className="animate-fade-up object-cover"
            loading="eager"
          />
        </div>
      </TiltCard>

      {shots.length > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => go(index - 1)} disabled={index === 0} aria-label="Previous screenshot" className={button}>
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            onClick={() => go(index + 1)}
            disabled={index === shots.length - 1}
            aria-label="Next screenshot"
            className={button}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
