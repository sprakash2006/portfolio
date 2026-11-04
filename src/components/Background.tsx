"use client";

import { getTheme } from "@/lib/themes";
import { useThemeName } from "@/lib/useTheme";
import DeepSpace from "./DeepSpace";

// Page backdrop: the same starry sky in both themes, white stars on black in dark mode and
// ink specks (a few red) on the paper background in light mode, with a tinted glow from the top.
export default function Background() {
  const theme = getTheme(useThemeName());

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <DeepSpace light={theme.value !== "dark"} />
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse at top, ${theme.glow}, transparent 70%)` }}
      />
    </div>
  );
}
