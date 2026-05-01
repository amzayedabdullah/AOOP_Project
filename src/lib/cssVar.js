// Resolve a CSS custom property to its current value at runtime.
// Used where we need a literal color string (e.g. Leaflet's L.polygon
// `fillColor` option) rather than a Tailwind class name. Lets the
// "no hex literals in component code" rule from design-tokens hold for
// libraries that take raw color strings.

export function getCssVar(name, fallback = "#000") {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return value || fallback;
}
