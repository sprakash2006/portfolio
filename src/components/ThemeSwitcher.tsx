"use client";

import { useEffect, useRef, useState } from "react";
import { THEMES, applyTheme, type ThemeName } from "@/lib/themes";
import { useThemeName } from "@/lib/useTheme";
import { CheckIcon, EclipseIcon, MoonIcon, SparklesIcon, SunIcon, SunsetIcon } from "./icons";

const ICONS: Record<ThemeName, typeof SunIcon> = {
  light: SunIcon,
  dark: MoonIcon,
  "deep-dark": EclipseIcon,
  sunset: SunsetIcon,
  midnight: SparklesIcon,
};

export default function ThemeSwitcher() {
  const theme = useThemeName();
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const Icon = ICONS[theme];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={root} className="relative ml-1">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Change theme"
        aria-haspopup="menu"
        aria-expanded={open}
        className={`rounded-md border p-1.5 transition-colors hover:text-foreground ${
          open ? "border-primary text-foreground" : "border-border/60"
        }`}
      >
        <Icon className="h-3.5 w-3.5" />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute right-0 top-full z-50 mt-2 w-40 animate-fade-up rounded-lg border border-border/60 bg-background p-1 shadow-xl"
        >
          {THEMES.map((t) => {
            const ItemIcon = ICONS[t.value];
            const active = t.value === theme;
            return (
              <li key={t.value} role="none">
                <button
                  role="menuitemradio"
                  aria-checked={active}
                  onClick={() => {
                    applyTheme(t.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors hover:bg-muted ${
                    active ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  <ItemIcon className={`h-3.5 w-3.5 ${active ? "text-primary" : ""}`} />
                  <span className="flex-1">{t.label}</span>
                  {active && <CheckIcon className="h-3 w-3 text-primary" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
