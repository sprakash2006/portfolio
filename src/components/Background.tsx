"use client";

import { getTheme } from "@/lib/themes";
import { useThemeName } from "@/lib/useTheme";
import Constellation from "./Constellation";
import SilkLines from "./SilkLines";

// Page backdrop, one per theme: dark mode has drifting particles that link up around the cursor,
// light mode has slow silk-thread lines. Both get a tinted glow from the top.
export default function Background() {
  const theme = getTheme(useThemeName());

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      {theme.value === "dark" ? <Constellation /> : <SilkLines />}
      <div
        className="absolute inset-0 transition-colors duration-700"
        style={{ background: `radial-gradient(ellipse at top, ${theme.glow}, transparent 70%)` }}
      />
    </div>
  );
}
