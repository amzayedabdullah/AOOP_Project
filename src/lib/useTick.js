"use client";

// Drives simulated "live" updates by re-rendering the consumer on a timer.
// Nothing is actually streamed — the static seed in src/data/ is unchanged.
// Each call site owns its own setInterval (kept simple on purpose).

import { useEffect, useState } from "react";

export default function useTick(intervalMs = 5000) {
  // Lazy initializer keeps Date.now() out of the render path.
  const [state, setState] = useState(() => ({ tick: 0, now: Date.now() }));

  useEffect(() => {
    const id = setInterval(() => {
      setState((prev) => ({ tick: prev.tick + 1, now: Date.now() }));
    }, intervalMs);

    return () => clearInterval(id);
  }, [intervalMs]);

  return state;
}
