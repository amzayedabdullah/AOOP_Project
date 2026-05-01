// Pure function — no library, no side effects.
// Returns short human-readable elapsed time strings for the alert feed.

export function formatRelativeFromNow(iso, nowMs) {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "";

  const deltaMs = nowMs - then;
  const seconds = Math.max(0, Math.floor(deltaMs / 1000));

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  // Older than a week — show the ISO date.
  return new Date(iso).toISOString().slice(0, 10);
}
