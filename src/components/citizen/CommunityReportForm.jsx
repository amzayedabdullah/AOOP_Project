"use client";

import { useEffect, useState } from "react";
import { districts } from "@/data/districts";
import { useCommunityReports } from "@/lib/communityReports";

export const REPORT_TYPES = [
  { value: "water-rising", label: "Water rising" },
  { value: "road-blocked", label: "Road blocked" },
  { value: "shelter-full", label: "Shelter full" },
  { value: "hazard", label: "Hazard" },
  { value: "other", label: "Other" },
];

const INPUT_BASE =
  "w-full rounded-button border border-hairline-citizen bg-surface-citizen px-3 py-2 text-sm text-heading focus:outline-none focus:ring-2 focus:ring-tide focus:border-transparent";

export default function CommunityReportForm({ currentDistrictId, onSubmitted }) {
  const { submitReport } = useCommunityReports();
  // The page-level current district is fixed for the demo; if a future
  // district selector lands, that change can re-key this form to reset.
  const [district, setDistrict] = useState(currentDistrictId);
  const [type, setType] = useState("");
  const [description, setDescription] = useState("");
  const [reporterName, setReporterName] = useState("");
  const [confirmationVisible, setConfirmationVisible] = useState(false);

  useEffect(() => {
    if (!confirmationVisible) return;
    const id = setTimeout(() => setConfirmationVisible(false), 3000);
    return () => clearTimeout(id);
  }, [confirmationVisible]);

  const trimmedDescription = description.trim();
  const isValid = type !== "" && trimmedDescription !== "";

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) return;
    submitReport({
      districtId: district,
      type,
      description: trimmedDescription,
      reporterName: reporterName.trim() || null,
    });
    setType("");
    setDescription("");
    setReporterName("");
    setConfirmationVisible(true);
    onSubmitted?.();
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-heading">Submit a sighting</h3>
        <p className="mt-1 text-xs text-muted">
          Share what you’re seeing on the ground — flooded roads, full shelters, hazards.
        </p>
      </div>

      <label className="flex flex-col gap-1 text-xs text-muted">
        District
        <select
          className={INPUT_BASE}
          value={district}
          onChange={(event) => setDistrict(event.target.value)}
        >
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Type
        <select
          className={INPUT_BASE}
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="">Choose a type</option>
          {REPORT_TYPES.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Description
        <textarea
          className={INPUT_BASE + " resize-y"}
          rows={4}
          maxLength={500}
          placeholder="What did you see?"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        <span className="self-end tnum text-[11px] text-muted">
          {description.length} / 500
        </span>
      </label>

      <label className="flex flex-col gap-1 text-xs text-muted">
        Name (optional)
        <input
          className={INPUT_BASE}
          type="text"
          maxLength={80}
          placeholder="Anonymous"
          value={reporterName}
          onChange={(event) => setReporterName(event.target.value)}
        />
      </label>

      <div className="flex items-center justify-between gap-3">
        <button
          type="submit"
          disabled={!isValid}
          aria-disabled={!isValid}
          className={
            "rounded-button px-4 py-2 text-sm font-medium transition-colors " +
            (isValid
              ? "bg-tide hover:bg-tide-hover text-white"
              : "bg-surface-mist text-muted cursor-not-allowed opacity-60")
          }
        >
          Submit report
        </button>
        {confirmationVisible ? (
          <span className="text-xs font-medium text-tide-pressed" role="status">
            Report submitted
          </span>
        ) : null}
      </div>
    </form>
  );
}
