"use client";

import { useSyncExternalStore } from "react";
import { DEFAULT_THEME, THEME_EVENT, readTheme } from "./themes";

function subscribe(cb: () => void) {
  window.addEventListener(THEME_EVENT, cb);
  return () => window.removeEventListener(THEME_EVENT, cb);
}

// Current theme name, kept in sync with applyTheme(). Renders the default on the server.
export function useThemeName() {
  return useSyncExternalStore(subscribe, readTheme, () => DEFAULT_THEME);
}
