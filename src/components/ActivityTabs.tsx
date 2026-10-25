"use client";

import { useState } from "react";
import { ExternalIcon } from "./icons";

export type ActivityTab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  handle: string;
  content: React.ReactNode;
};

// One card, two sources: a segmented control picks which panel shows. Panels are rendered
// on the server and all stay mounted; inactive ones are just hidden.
export default function ActivityTabs({ tabs, className }: { tabs: ActivityTab[]; className: string }) {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div className={className}>
      <div className="flex items-center justify-between gap-3">
        <div role="tablist" aria-label="Activity source" className="inline-flex rounded-lg border border-border/60 bg-muted/30 p-0.5">
          {tabs.map((t) => {
            const selected = t.id === active;
            return (
              <button
                key={t.id}
                role="tab"
                id={`tab-${t.id}`}
                aria-selected={selected}
                aria-controls={`panel-${t.id}`}
                onClick={() => setActive(t.id)}
                className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
                  selected ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className={selected ? "text-primary" : ""}>{t.icon}</span>
                {t.label}
              </button>
            );
          })}
        </div>
        <a
          href={current.href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground"
        >
          @{current.handle} <ExternalIcon className="h-3 w-3" />
        </a>
      </div>

      {tabs.map((t) => (
        <div
          key={t.id}
          role="tabpanel"
          id={`panel-${t.id}`}
          aria-labelledby={`tab-${t.id}`}
          hidden={t.id !== active}
          className="mt-4 space-y-4"
        >
          {t.content}
        </div>
      ))}
    </div>
  );
}
