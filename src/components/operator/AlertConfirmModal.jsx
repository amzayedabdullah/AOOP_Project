"use client";

// Native <dialog> element gets us free focus trap, Escape-to-close, and
// modal backdrop semantics. The Send button switches to the Severe-level
// danger styling when draft.level === "Severe" — this is the fifth and only
// operator-side canonical consumer of risk-scale color tokens.

import { useEffect, useRef } from "react";
import { districts } from "@/data/districts";
import RiskPill from "@/components/ui/RiskPill";

const CHANNEL_LABEL = { sms: "SMS", email: "Email" };

export default function AlertConfirmModal({ draft, onCancel, onConfirm }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (draft && !dialog.open) {
      dialog.showModal();
    } else if (!draft && dialog.open) {
      dialog.close();
    }
  }, [draft]);

  function handleBackdropClick(event) {
    if (event.target === dialogRef.current) onCancel();
  }

  // The native dialog `close` event fires for Escape and for our own
  // close() call. onCancel is idempotent — calling it after a confirm is
  // a no-op since the parent has already cleared the draft.
  function handleClose() {
    if (draft) onCancel();
  }

  if (!draft) {
    return (
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onClose={handleClose}
        className="hidden"
      />
    );
  }

  const district = districts.find((d) => d.id === draft.districtId);
  const isSevere = draft.level === "Severe";

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={handleClose}
      className="bg-surface-1 border border-hairline rounded-card p-0 max-w-md backdrop:bg-canvas-operator/70"
    >
      <div className="p-6 flex flex-col gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle">
            Confirm broadcast
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-ink">
            Send alert?
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <RiskPill level={draft.level} />
          <span className="text-sm text-ink-muted">
            {district?.name ?? draft.districtId}
          </span>
        </div>

        <div>
          <p className="text-base font-semibold text-ink">{draft.headline}</p>
          <p className="mt-2 text-sm text-ink-muted whitespace-pre-line">
            {draft.body}
          </p>
        </div>

        <ul className="flex items-center gap-2">
          {draft.channels.map((channel) => (
            <li
              key={channel}
              className="bg-surface-2 text-ink-muted text-xs px-2 py-0.5 rounded-pill"
            >
              {CHANNEL_LABEL[channel] ?? channel}
            </li>
          ))}
        </ul>

        <div className="flex items-center justify-end gap-2 mt-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-button px-3 py-2 text-sm font-medium bg-surface-2 text-ink border border-hairline hover:bg-surface-3"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={
              "rounded-button px-3 py-2 text-sm font-medium text-white " +
              (isSevere
                ? "bg-risk-severe-text hover:opacity-90"
                : "bg-tide hover:bg-tide-hover")
            }
          >
            {isSevere ? "Send severe alert" : "Send alert"}
          </button>
        </div>
      </div>
    </dialog>
  );
}
