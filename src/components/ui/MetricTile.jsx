// The "Pick this type" hero readout — soft pastel gradient on light, large
// lightweight numeric, optional risk pill, optional sparkline. Reused later
// for water-level / ETA tiles; keep prop surface minimal.

import RiskPill from "./RiskPill";
import Sparkline from "./Sparkline";

export default function MetricTile({ label, value, unit, riskLevel, trend }) {
  return (
    <div
      className="
        relative overflow-hidden
        rounded-xl border border-hairline-citizen
        bg-gradient-to-b from-surface-citizen to-tide-subtle
        p-7 shadow-card
        flex flex-col gap-5
      "
    >
      <p className="text-xs font-medium uppercase tracking-[0.4px] text-muted">
        {label}
      </p>

      <div className="flex items-baseline gap-3">
        <span
          className="tnum font-light text-heading leading-none"
          style={{ fontSize: "72px", letterSpacing: "-2.5px" }}
        >
          {value}
        </span>
        {unit ? (
          <span className="tnum text-sm text-body">{unit}</span>
        ) : null}
      </div>

      {riskLevel ? <RiskPill level={riskLevel} /> : null}

      {trend && trend.length > 1 ? (
        <div className="text-tide mt-auto">
          <Sparkline points={trend} />
        </div>
      ) : null}
    </div>
  );
}
