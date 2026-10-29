"use client";

import { useLayoutEffect, useRef, useState } from "react";

export type ActivityTab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  handle: string;
  content: React.ReactNode;
};

// One card, two sources: a pill-shaped switch picks which panel shows. Panels are rendered
// on the server and all stay mounted, stacked in one grid cell. Switching glides the pill to
// the selected tab, slides panels in the direction of the click and animates the card height.
export default function ActivityTabs({ tabs, className }: { tabs: ActivityTab[]; className: string }) {
  const [active, setActive] = useState(tabs[0].id);
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === active));
  const current = tabs[activeIndex];

  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null);
  const [height, setHeight] = useState<number | null>(null);

  // Keep the pill and the card height in sync with the active tab and its panel's size.
  useLayoutEffect(() => {
    const tab = tabRefs.current[activeIndex];
    const panel = panelRefs.current[activeIndex];
    if (!tab || !panel) return;

    const measure = () => {
      setPill({ left: tab.offsetLeft, width: tab.offsetWidth });
      setHeight(panel.offsetHeight);
    };
    measure();

    const observer = new ResizeObserver(measure);
    observer.observe(tab);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [activeIndex]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <div
          role="tablist"
          aria-label="Activity source"
          className="relative inline-flex gap-0.5 rounded-full border border-border p-[3px]"
        >
          {pill && (
            <span
              aria-hidden
              className="absolute inset-y-[3px] left-0 rounded-full bg-foreground/[0.08] transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
              style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
            />
          )}
          {tabs.map((t, i) => {
            const selected = i === activeIndex;
            return (
              <button
                key={t.id}
                ref={(el) => {
                  tabRefs.current[i] = el;
                }}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                onClick={() => setActive(t.id)}
                className={`relative z-10 inline-flex items-center gap-1.5 rounded-full px-3 py-[5px] text-xs font-medium transition-colors duration-300 ${
                  selected ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                } ${selected && !pill ? "bg-foreground/[0.08]" : ""}`}
              >
                {t.icon}
                {t.label}
              </button>
            );
          })}
        </div>
        <a
          key={current.id}
          href={current.href}
          target="_blank"
          rel="noreferrer"
          className="activity-handle font-mono text-xs text-muted-foreground transition-colors hover:text-red-500"
        >
          @{current.handle} ↗
        </a>
      </div>

      <div
        className="mt-3.5 grid overflow-hidden transition-[height] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none"
        style={height === null ? undefined : { height }}
      >
        {tabs.map((t, i) => {
          const offset = i < activeIndex ? "-2rem" : i > activeIndex ? "2rem" : "0";
          const selected = i === activeIndex;
          return (
            <div
              key={t.id}
              ref={(el) => {
                panelRefs.current[i] = el;
              }}
              role="tabpanel"
              id={`panel-${t.id}`}
              aria-labelledby={`tab-${t.id}`}
              aria-hidden={!selected}
              inert={!selected}
              className={`col-start-1 row-start-1 space-y-4 self-start transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                selected ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
              style={{ transform: `translateX(${offset})` }}
            >
              {t.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
