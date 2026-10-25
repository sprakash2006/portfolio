"use client";

import Image from "next/image";
import { useState } from "react";

type Shot = { src: string; alt: string };

const PLACEHOLDER_COUNT = 4;

function Placeholder({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <div className="bg-grid-pattern flex h-full w-full flex-col items-center justify-center gap-2 bg-muted/30">
      <span className={`font-pixel text-muted-foreground ${small ? "text-[8px]" : "text-sm"}`}>{label}</span>
      {!small && <span className="font-mono text-[11px] text-muted-foreground/70">Screenshot coming soon</span>}
    </div>
  );
}

// Large preview with a row of thumbnails below; clicking a thumbnail shows it in the preview.
// With no screenshots yet, themed placeholder frames stand in.
export default function ProjectGallery({ title, shots }: { title: string; shots: Shot[] }) {
  const [active, setActive] = useState(0);
  const initials = title.slice(0, 2).toUpperCase();
  const count = shots.length || PLACEHOLDER_COUNT;
  const frame = "relative overflow-hidden rounded-xl border border-border/60 bg-card/40";

  return (
    <div className="space-y-3">
      <div className={`${frame} aspect-video`}>
        {shots.length ? (
          <Image
            src={shots[active].src}
            alt={shots[active].alt}
            fill
            sizes="(min-width: 768px) 720px, 100vw"
            className="object-cover"
            loading="eager"
          />
        ) : (
          <Placeholder label={`${initials} ${String(active + 1).padStart(2, "0")}`} />
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 sm:gap-3">
        {Array.from({ length: count }, (_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`Show screenshot ${i + 1} of ${count}`}
            aria-current={i === active}
            className={`${frame} aspect-video transition-all ${
              i === active ? "border-primary ring-1 ring-primary/40" : "opacity-60 hover:opacity-100"
            }`}
          >
            {shots.length ? (
              <Image src={shots[i].src} alt="" fill sizes="150px" className="object-cover" />
            ) : (
              <Placeholder label={String(i + 1).padStart(2, "0")} small />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
