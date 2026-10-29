"use client";

import { applyTheme } from "@/lib/themes";
import { useThemeName } from "@/lib/useTheme";
import { MoonIcon, SunIcon } from "./icons";

// One-click dark/light toggle. The icon shows the theme you'd switch to, and turns over as it swaps.
export default function ThemeSwitcher() {
  const theme = useThemeName();
  const next = theme === "dark" ? "light" : "dark";
  const Icon = next === "light" ? SunIcon : MoonIcon;

  return (
    <button
      onClick={() => applyTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="group ml-1 rounded-md border border-border/60 p-1.5 transition-colors hover:text-foreground"
    >
      <Icon key={next} className="h-3.5 w-3.5 animate-fade-up transition-transform duration-500 group-hover:rotate-45" />
    </button>
  );
}
