"use client";

import { useState } from "react";
import { useAlertOutbox } from "@/lib/alertOutbox";
import AlertComposerForm from "./AlertComposerForm";
import AlertConfirmModal from "./AlertConfirmModal";
import AlertOutboxList from "./AlertOutboxList";

export default function AlertComposerPanel({ focusedDistrictId }) {
  const { sendAlert } = useAlertOutbox();
  const [pendingDraft, setPendingDraft] = useState(null);
  // Bump this on every successful confirm so the form remounts with fresh state.
  const [confirmCount, setConfirmCount] = useState(0);

  function handleConfirm() {
    if (!pendingDraft) return;
    sendAlert(pendingDraft);
    setPendingDraft(null);
    setConfirmCount((n) => n + 1);
  }

  return (
    <div className="bg-surface-1 border border-hairline rounded-card p-6">
      <header className="mb-6">
        <p className="text-xs font-medium uppercase tracking-[0.4px] text-ink-subtle">
          Broadcast
        </p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-ink">
          Send a citizen alert
        </h2>
      </header>

      <div className="grid grid-cols-12 gap-6 max-md:grid-cols-1">
        <div className="col-span-5 max-md:col-span-1">
          <AlertComposerForm
            key={confirmCount}
            focusedDistrictId={focusedDistrictId}
            onDraftReady={setPendingDraft}
          />
        </div>
        <div className="col-span-7 max-md:col-span-1">
          <AlertOutboxList />
        </div>
      </div>

      <AlertConfirmModal
        draft={pendingDraft}
        onCancel={() => setPendingDraft(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}
