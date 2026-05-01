"use client";

// Dev-only widget — flip between citizen (/) and operator (/operator).
// Hidden in production. process.env.NODE_ENV is inlined at build time,
// so the production bundle does not ship this markup.

import Link from "next/link";

export default function ModeSwitcher() {
  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div
      role="navigation"
      aria-label="Dev mode switcher"
      className="fixed bottom-4 right-4 z-50 flex items-center gap-1 p-1 rounded-pill bg-surface-1 border border-hairline shadow-card text-xs"
    >
      <Link
        href="/"
        className="px-3 py-1.5 rounded-pill text-ink-muted hover:text-ink hover:bg-surface-2"
      >
        Citizen
      </Link>
      <Link
        href="/operator"
        className="px-3 py-1.5 rounded-pill text-ink-muted hover:text-ink hover:bg-surface-2"
      >
        Operator
      </Link>
    </div>
  );
}
