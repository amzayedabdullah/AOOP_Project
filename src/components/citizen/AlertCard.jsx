import RiskPill from "@/components/ui/RiskPill";
import { formatRelativeFromNow } from "@/lib/relativeTime";

export default function AlertCard({ alert, now }) {
  const relative = now > 0 ? formatRelativeFromNow(alert.issuedAt, now) : "—";

  return (
    <li className="bg-surface-citizen border border-hairline-citizen rounded-card shadow-card p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-heading tracking-tight">
            {alert.headline}
          </h3>
          <p className="mt-2 text-body">{alert.body}</p>
        </div>
        <RiskPill level={alert.level} />
      </div>
      <p className="mt-4 text-xs text-muted">{relative}</p>
    </li>
  );
}
