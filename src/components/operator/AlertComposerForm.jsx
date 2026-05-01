"use client";

import { useState } from "react";
import { districts } from "@/data/districts";

const LEVELS = ["Calm", "Watch", "Warning", "Severe"];
const CHANNEL_OPTIONS = [
  { value: "sms", label: "SMS" },
  { value: "email", label: "Email" },
];

const INPUT_BASE =
  "w-full rounded-button border border-hairline bg-surface-2 px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-tide focus:border-transparent";

export default function AlertComposerForm({ focusedDistrictId, onDraftReady }) {
  const [district, setDistrict] = useState(
    focusedDistrictId ?? districts[0]?.id ?? "",
  );
  const [level, setLevel] = useState("");
  const [headline, setHeadline] = useState("");
  const [body, setBody] = useState("");
  const [channels, setChannels] = useState(["sms", "email"]);

  const trimmedHeadline = headline.trim();
  const trimmedBody = body.trim();
  const isValid =
    district !== "" &&
    level !== "" &&
    trimmedHeadline !== "" &&
    trimmedBody !== "" &&
    channels.length >= 1;

  function toggleChannel(value) {
    setChannels((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value],
    );
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (!isValid) return;
    onDraftReady({
      districtId: district,
      level,
      headline: trimmedHeadline,
      body: trimmedBody,
      channels,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <h3 className="text-sm font-semibold text-ink">Compose alert</h3>
        <p className="mt-1 text-xs text-ink-subtle">
          Draft, confirm, and broadcast to citizens in the selected district.
        </p>
      </div>

      <label className="flex flex-col gap-1 text-xs text-ink-subtle">
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

      <label className="flex flex-col gap-1 text-xs text-ink-subtle">
        Risk level
        <select
          className={INPUT_BASE}
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          <option value="">Choose a level</option>
          {LEVELS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs text-ink-subtle">
        Headline
        <input
          className={INPUT_BASE}
          type="text"
          maxLength={80}
          placeholder="Short, urgent — what citizens need to know"
          value={headline}
          onChange={(event) => setHeadline(event.target.value)}
        />
        <span className="self-end tnum text-[11px] text-ink-subtle">
          {headline.length} / 80
        </span>
      </label>

      <label className="flex flex-col gap-1 text-xs text-ink-subtle">
        Body
        <textarea
          className={INPUT_BASE + " resize-y"}
          rows={4}
          maxLength={500}
          placeholder="What is happening, and what should they do?"
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <span className="self-end tnum text-[11px] text-ink-subtle">
          {body.length} / 500
        </span>
      </label>

      <fieldset className="flex flex-col gap-2 text-xs text-ink-subtle">
        <legend className="mb-1">Channels</legend>
        <div className="flex flex-wrap gap-4">
          {CHANNEL_OPTIONS.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 text-sm text-ink"
            >
              <input
                type="checkbox"
                checked={channels.includes(option.value)}
                onChange={() => toggleChannel(option.value)}
                className="accent-tide"
              />
              {option.label}
            </label>
          ))}
        </div>
        {channels.length === 0 ? (
          <span className="text-[11px] text-ink-tertiary">
            Pick at least one channel.
          </span>
        ) : null}
      </fieldset>

      <button
        type="submit"
        disabled={!isValid}
        aria-disabled={!isValid}
        className={
          "rounded-button px-4 py-2 text-sm font-medium transition-colors self-start " +
          (isValid
            ? "bg-tide hover:bg-tide-hover text-white"
            : "bg-surface-2 text-ink-tertiary cursor-not-allowed opacity-60")
        }
      >
        Send alert
      </button>
    </form>
  );
}
