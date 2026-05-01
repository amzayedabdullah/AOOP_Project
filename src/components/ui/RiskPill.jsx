// The only place outside RiskSummaryCard that consumes the risk-scale colors.
// Other components must render risk via this pill, not raw tokens.

const STYLE_BY_LEVEL = {
  Calm: {
    bg: "bg-risk-calm-fill",
    text: "text-risk-calm-text",
    dot: "bg-risk-calm-text",
  },
  Watch: {
    bg: "bg-risk-watch-fill",
    text: "text-risk-watch-text",
    dot: "bg-risk-watch-text",
  },
  Warning: {
    bg: "bg-risk-warning-fill",
    text: "text-risk-warning-text",
    dot: "bg-risk-warning-text",
  },
  Severe: {
    bg: "bg-risk-severe-fill",
    text: "text-risk-severe-text",
    dot: "bg-risk-severe-text",
  },
};

export default function RiskPill({ level }) {
  const style = STYLE_BY_LEVEL[level];
  if (!style) return null;

  return (
    <span
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-pill text-xs font-semibold ${style.bg} ${style.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-pill ${style.dot}`} />
      {level}
    </span>
  );
}
