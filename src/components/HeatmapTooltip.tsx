"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type Tip = { count: string; date: string; x: number; y: number };

// Themed tooltip for heatmap cells. One listener for the whole grid: any child with
// data-count/data-date shows the tip above it. It's portalled to <body> with fixed positioning:
// the card's backdrop-blur would otherwise become the fixed box's reference and misplace it.
export default function HeatmapTooltip({ children }: { children: React.ReactNode }) {
  const [tip, setTip] = useState<Tip | null>(null);

  // A fixed tooltip would drift away from its cell when the page scrolls, so hide it
  useEffect(() => {
    if (!tip) return;
    const hide = () => setTip(null);
    window.addEventListener("scroll", hide, { passive: true, capture: true });
    return () => window.removeEventListener("scroll", hide, { capture: true });
  }, [tip]);

  function onPointerOver(e: React.PointerEvent) {
    const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-count]");
    if (!cell) return setTip(null);
    const r = cell.getBoundingClientRect();
    // Keep the tooltip inside the viewport near the screen edges
    const x = Math.min(Math.max(r.left + r.width / 2, 90), window.innerWidth - 90);
    setTip({ count: cell.dataset.count!, date: cell.dataset.date!, x, y: r.top });
  }

  return (
    <div onPointerOver={onPointerOver} onPointerLeave={() => setTip(null)}>
      {children}
      {tip &&
        createPortal(
          <div
            role="tooltip"
            className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full pb-2"
            style={{ left: tip.x, top: tip.y }}
          >
            <div className="relative whitespace-nowrap rounded-md border border-border/60 bg-card px-2.5 py-1.5 font-mono text-[11px] text-muted-foreground shadow-lg">
              <span className="font-bold text-primary">{tip.count}</span> on {tip.date}
              <span className="absolute -bottom-[5px] left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-b border-r border-border/60 bg-card" />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}
