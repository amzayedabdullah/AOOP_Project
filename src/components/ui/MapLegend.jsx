// One of the four canonical consumers of the risk-scale color tokens.
// Anything else that needs to show risk colors must go through RiskPill.

const SWATCHES = [
  { level: "Calm", className: "bg-risk-calm-fill border-risk-calm-text" },
  { level: "Watch", className: "bg-risk-watch-fill border-risk-watch-text" },
  {
    level: "Warning",
    className: "bg-risk-warning-fill border-risk-warning-text",
  },
  {
    level: "Severe",
    className: "bg-risk-severe-fill border-risk-severe-text",
  },
];

export default function MapLegend() {
  return (
    <ul
      className="flex items-center gap-4 text-xs text-muted"
      aria-label="Risk level legend"
    >
      {SWATCHES.map(({ level, className }) => (
        <li key={level} className="flex items-center gap-2">
          <span
            className={`w-3 h-3 rounded-xs border ${className}`}
            aria-hidden="true"
          />
          {level}
        </li>
      ))}
    </ul>
  );
}
