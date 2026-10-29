// Theme list shared by the switcher, the background and the no-flash script in layout.tsx.
// Colours for each theme live in globals.css under the matching class name.
// glow tints the top of the page background.

export const THEMES = [
  { value: "dark", label: "Dark", glow: "rgb(148 163 184 / 0.10)" },
  // A faint red glow so the light page matches the red accent
  { value: "light", label: "Light", glow: "rgb(239 68 68 / 0.07)" },
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
