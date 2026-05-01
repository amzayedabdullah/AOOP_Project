// Featured card with a 4px top stripe in the matching risk-scale color and
// level-appropriate guidance. The stripe is the only place outside RiskPill
// where the risk-scale color tokens are referenced directly.

const COPY_BY_LEVEL = {
  Calm: {
    stripe: "bg-risk-calm-text",
    headline: "Conditions are stable",
    body: "No flood risk for your district right now. Stay informed and review your plan when convenient.",
    actions: [
      "Save your nearest shelter location",
      "Sign up for SMS alerts",
      "Check back during the rainy season",
    ],
  },
  Watch: {
    stripe: "bg-risk-watch-text",
    headline: "Conditions are developing",
    body: "Rainfall and river levels are trending upward. Flooding is possible in the next 24 hours.",
    actions: [
      "Pack a small go-bag with documents and medicine",
      "Charge phones and power banks",
      "Identify your nearest verified shelter",
    ],
  },
  Warning: {
    stripe: "bg-risk-warning-text",
    headline: "Action recommended",
    body: "River levels have crossed warning thresholds nearby. Be ready to evacuate on short notice.",
    actions: [
      "Move valuables to an upper floor",
      "Confirm an evacuation route to a shelter",
      "Stay tuned for the next alert",
    ],
  },
  Severe: {
    stripe: "bg-risk-severe-text",
    headline: "Evacuate now",
    body: "Severe flooding is occurring or imminent. Move to higher ground or a verified shelter immediately.",
    actions: [
      "Move to your nearest shelter now",
      "Leave non-essentials behind — take only your go-bag",
      "Avoid flooded roads and downed power lines",
    ],
  },
};

export default function RiskSummaryCard({ level }) {
  const copy = COPY_BY_LEVEL[level] ?? COPY_BY_LEVEL.Calm;

  return (
    <div className="relative bg-surface-citizen border border-hairline-citizen rounded-card shadow-card p-6 overflow-hidden">
      <div className={`absolute inset-x-0 top-0 h-1 ${copy.stripe}`} />
      <p className="text-xs font-medium uppercase tracking-[0.4px] text-muted">
        What this means
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-heading">
        {copy.headline}
      </h2>
      <p className="mt-3 text-body">{copy.body}</p>
      <ul className="mt-4 space-y-2 text-body">
        {copy.actions.map((action) => (
          <li key={action} className="flex gap-3">
            <span className="text-tide" aria-hidden="true">
              →
            </span>
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
