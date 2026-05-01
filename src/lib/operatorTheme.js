// Per-browser dark/light preference for the operator surface (sign-in +
// dashboard). Citizen route is unaffected. Mirrors the shape of
// operatorSession.js so both modules read the same way.

import { useSyncExternalStore } from "react";

export const THEME_KEY = "floodwatch.operatorTheme";
export const THEME_ROOT_ID = "operator-theme-root";
// Light is the operator default. Returning visitors who explicitly chose
// dark via the toggle keep dark via the localStorage preference.
const DEFAULT_THEME = "light";

function isBrowser() {
  return typeof window !== "undefined";
}

function isValid(value) {
  return value === "dark" || value === "light";
}

export function getTheme() {
  if (!isBrowser()) return DEFAULT_THEME;

  try {
    const raw = window.localStorage.getItem(THEME_KEY);
    if (raw === null) return DEFAULT_THEME;
    if (!isValid(raw)) {
      window.localStorage.removeItem(THEME_KEY);
      return DEFAULT_THEME;
    }
    return raw;
  } catch {
    return DEFAULT_THEME;
  }
}

export function setTheme(value) {
  if (!isBrowser()) return;
  if (!isValid(value)) return;

  try {
    window.localStorage.setItem(THEME_KEY, value);
    // Apply to the live DOM directly. data-theme is intentionally NOT in JSX
    // (it would race with the pre-paint inline script and cause a hydration
    // mismatch + flash). React state drives only the toggle's icon.
    applyThemeToDom(value);
    // Same-tab subscribers don't see `storage` events from their own writes,
    // so dispatch one synthetically — same trick as operatorSession.
    window.dispatchEvent(new StorageEvent("storage", { key: THEME_KEY }));
  } catch {
    // localStorage may throw in privacy modes — silently no-op.
  }
}

export function applyThemeToDom(value) {
  if (!isBrowser()) return;
  const root = document.getElementById(THEME_ROOT_ID);
  if (root) root.setAttribute("data-theme", value);
}

function subscribeToTheme(onChange) {
  function handler(event) {
    if (event.key === null || event.key === THEME_KEY) onChange();
  }
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export function useOperatorTheme() {
  return useSyncExternalStore(
    subscribeToTheme,
    getTheme,
    () => DEFAULT_THEME,
  );
}
