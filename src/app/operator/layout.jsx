"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import OperatorAuthGate from "./_components/OperatorAuthGate";
import OperatorUserChip from "./_components/OperatorUserChip";
import OperatorThemeToggle from "./_components/OperatorThemeToggle";
import { THEME_KEY, applyThemeToDom, getTheme } from "@/lib/operatorTheme";

// Theme application has two parts:
//
// 1. The first-paint pre-paint script lives in the ROOT layout
//    (src/app/layout.jsx) — a Server Component, so React 19 doesn't warn
//    that the inline <script> won't execute on client renders. It runs
//    once during initial HTML parse and is a no-op on citizen routes.
//
// 2. ThemeReflector below covers the cases the pre-paint script can't:
//    a) Client-side navigation into /operator (the script ran at original
//       page load when #operator-theme-root didn't exist yet).
//    b) Cross-tab sync when another tab flips the toggle.

function ThemeReflector() {
  useEffect(() => {
    // a) Apply the stored theme on mount — handles client-side navigation
    //    into the operator layout from elsewhere in the app.
    applyThemeToDom(getTheme());

    // b) Cross-tab sync: mirror flips from sibling tabs onto the DOM here.
    //    (Same-tab toggle already updates the DOM directly via setTheme.)
    function onStorage(event) {
      if (event.key === null || event.key === THEME_KEY) {
        applyThemeToDom(getTheme());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);
  return null;
}

export default function OperatorLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/operator/sign-in") {
    return (
      <div id="operator-theme-root">
        <ThemeReflector />
        {children}
      </div>
    );
  }

  return (
    <div id="operator-theme-root">
      <ThemeReflector />
      <OperatorAuthGate>
        <div className="min-h-screen flex flex-col bg-canvas-operator text-ink">
          <header className="sticky top-0 z-10 border-b border-hairline bg-canvas-operator/90 backdrop-blur">
            <div className="mx-auto max-w-[1280px] px-6 max-md:px-4 h-14 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium tracking-tight text-ink">
                  Floodwatch
                </span>
                <span className="text-ink-subtle text-sm max-md:hidden">
                  Operator
                </span>
              </div>
              <nav className="flex items-center gap-6 max-md:hidden">
                <a className="text-sm text-ink-muted hover:text-ink" href="#">
                  Districts
                </a>
                <a className="text-sm text-ink-muted hover:text-ink" href="#">
                  Sensors
                </a>
                <a className="text-sm text-ink-muted hover:text-ink" href="#">
                  Alerts
                </a>
                <a className="text-sm text-ink-muted hover:text-ink" href="#">
                  Simulation
                </a>
              </nav>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 text-xs px-2.5 py-1 rounded-pill bg-tide-subtle text-tide-pressed font-semibold">
                  <span className="w-1.5 h-1.5 rounded-pill bg-tide-pressed" />
                  Live
                </span>
                <OperatorThemeToggle />
                <OperatorUserChip />
              </div>
            </div>
          </header>

          <main className="flex-1 mx-auto w-full max-w-[1280px] px-6 max-md:px-4 py-8">
            {children}
          </main>
        </div>
      </OperatorAuthGate>
    </div>
  );
}
