// Theme list shared by the switcher, the background and the no-flash script in layout.tsx.
// Colours for each theme live in globals.css under the matching class name.
// dots/glow tint the page background.

export const THEMES = [
  { value: "light", label: "Light", dots: "#000000", dotsOpacity: 0.65, glow: "rgb(15 23 42 / 0.10)" },
  { value: "dark", label: "Dark", dots: "#ffffff", dotsOpacity: 0.35, glow: "rgb(148 163 184 / 0.10)" },
  { value: "blue-gray", label: "Blue Gray", dots: "#0f172a", dotsOpacity: 0.55, glow: "rgb(30 41 59 / 0.10)" },
  { value: "deep-dark", label: "Deep Dark", dots: "#10b981", dotsOpacity: 0.3, glow: "rgb(16 185 129 / 0.10)" },
  { value: "sunset", label: "Sunset", dots: "#7c2d12", dotsOpacity: 0.55, glow: "rgb(217 119 6 / 0.10)" },
  { value: "forest", label: "Rainforest", dots: "#22c55e", dotsOpacity: 0.35, glow: "rgb(34 197 94 / 0.12)" },
  { value: "ocean", label: "Ocean", dots: "#0284c7", dotsOpacity: 0.35, glow: "rgb(14 165 233 / 0.12)" },
  { value: "midnight", label: "Midnight", dots: "#8b5cf6", dotsOpacity: 0.3, glow: "rgb(168 85 247 / 0.12)" },
] as const;

export type ThemeName = (typeof THEMES)[number]["value"];

export const DEFAULT_THEME: ThemeName = "dark";
export const THEME_STORAGE_KEY = "theme";
export const THEME_EVENT = "themechange";

export function getTheme(name: string | null | undefined) {
  return THEMES.find((t) => t.value === name) ?? THEMES.find((t) => t.value === DEFAULT_THEME)!;
}

export function readTheme(): ThemeName {
  const cls = document.documentElement.classList;
  return THEMES.find((t) => cls.contains(t.value))?.value ?? DEFAULT_THEME;
}

export function applyTheme(name: ThemeName) {
  const cls = document.documentElement.classList;
  THEMES.forEach((t) => cls.remove(t.value));
  cls.add(name);
  try {
    localStorage.setItem(THEME_STORAGE_KEY, name);
  } catch {}
  window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: name }));
}

// Runs inline in <head> before paint, so it must be plain self-contained JS.
export const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)}),a=${JSON.stringify(
  THEMES.map((t) => t.value),
)};if(t&&a.indexOf(t)>-1){var c=document.documentElement.classList;c.remove(${JSON.stringify(DEFAULT_THEME)});c.add(t)}}catch(e){}`;
