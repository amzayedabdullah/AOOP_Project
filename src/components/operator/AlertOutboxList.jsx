"use client";

import { useAlertOutbox } from "@/lib/alertOutbox";
import { districts } from "@/data/districts";
import { formatRelativeFromNow } from "@/lib/relativeTime";
import useTick from "@/lib/useTick";
import RiskPill from "@/components/ui/RiskPill";

const CHANNEL_LABEL = { sms: "SMS", email: "Email" };
const FEED_CAP = 50;

const DISTRICT_NAME = Object.fromEntries(districts.map((d) => [d.id, d.name]));

export default function AlertOutboxList() {
  const { entries } = useAlertOutbox();

  // Hydration-safe relative-time: tick=0 on first render → em-dash; first
  // tick swaps in real Date.now(). Same pattern as CommunityReportFeed.
  const { tick, now: liveNow } = useTick(30_000);
  const now = tick === 0 ? 0 : liveNow;

  const visible = entries
    .slice()
    .sort((a, b) => b.sentAt.localeCompare(a.sentAt))
    .slice(0, FEED_CAP);

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-ink">Outbox</h3>
        <p className="mt-1 text-xs text-ink-subtle">
          Sent alerts · newest first · capped at {FEED_CAP}
        </p>
      </div>

      {visible.length === 0 ? (
        <p className="text-sm text-ink-subtle py-3">No alerts sent yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {visible.map((entry) => (
            <li
              key={entry.id}
              className="border border-hairline rounded-card p-3 bg-surface-2"
            >
              <div className="flex items-center justify-between gap-2">
                <RiskPill level={entry.level} />
                <span className="inline-flex items-center bg-tide-subtle text-tide-pressed text-xs px-2 py-0.5 rounded-pill font-semibold">
                  Delivered
                </span>
              </div>
              <p className="mt-2 font-semibold text-ink">{entry.headline}</p>
              <p className="mt-1 text-sm text-ink-muted whitespace-pre-line">
                {entry.body}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2 text-xs text-ink-subtle">
                <div className="flex items-center gap-2 flex-wrap">
                  <span>{DISTRICT_NAME[entry.districtId] ?? entry.districtId}</span>
                  <span aria-hidden="true">·</span>
                  <ul className="flex items-center gap-1">
                    {entry.channels.map((channel) => (
                      <li
                        key={channel}
                        className="bg-surface-3 text-ink-muted px-2 py-0.5 rounded-pill"
                      >
                        {CHANNEL_LABEL[channel] ?? channel}
                      </li>
                    ))}
                  </ul>
                </div>
                <span>
                  {now > 0 ? formatRelativeFromNow(entry.sentAt, now) : "—"}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
