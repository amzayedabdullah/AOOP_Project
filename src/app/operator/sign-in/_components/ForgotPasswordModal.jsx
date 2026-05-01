"use client";

import { useEffect, useRef } from "react";

export default function ForgotPasswordModal({ open, onClose }) {
  const dismissRef = useRef(null);
  const lastFocusableRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    dismissRef.current?.focus();

    function onKey(event) {
      if (event.key === "Escape") {
        event.stopPropagation();
        onClose();
        return;
      }
      if (event.key !== "Tab") return;

      const first = dismissRef.current;
      const last = lastFocusableRef.current;
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="forgot-password-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />

      <div className="relative w-full max-w-md rounded-md border border-hairline-strong bg-surface-4 p-6 text-ink shadow-lg">
        <h2
          id="forgot-password-title"
          className="text-lg font-semibold tracking-tight"
        >
          No password recovery in this prototype
        </h2>
        <p className="mt-3 text-sm text-ink-muted leading-relaxed">
          This is a UI demo of the Floodwatch operator console — there is no
          backend, no email, and no real authentication. To explore the
          dashboard, expand the <span className="text-ink">Demo credentials</span>{" "}
          section on the sign-in screen and use one of the listed operator ids
          and passwords.
        </p>
        <div className="mt-6 flex justify-end gap-2">
          <button
            ref={dismissRef}
            type="button"
            onClick={onClose}
            className="rounded-md border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:text-ink"
          >
            Cancel
          </button>
          <button
            ref={lastFocusableRef}
            type="button"
            onClick={onClose}
            className="rounded-md bg-tide px-3 py-1.5 text-sm font-medium text-white hover:bg-tide-pressed"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
