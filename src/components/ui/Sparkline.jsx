// Hand-rolled sparkline — one polyline, no library, no axis, no tooltip.
// Inherits stroke from `currentColor` so callers control the hue.

export default function Sparkline({ points, className = "" }) {
  if (!points || points.length < 2) return null;

  const width = 100;
  const height = 24;
  const min = Math.min(...points);
  const max = Math.max(...points);
  // 5% top/bottom padding so a flat-ish series doesn't sit on the floor.
  const range = max - min || 1;
  const yPad = height * 0.05;
  const usable = height - yPad * 2;

  const coords = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * width;
      const y = height - yPad - ((value - min) / range) * usable;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      className={`w-full h-6 ${className}`}
      aria-hidden="true"
    >
      <polyline
        points={coords}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
