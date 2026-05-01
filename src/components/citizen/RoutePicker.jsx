"use client";

import { useRef } from "react";

const VARIANTS = [
  { id: "safest", label: "Safest" },
  { id: "fastest", label: "Fastest" },
  { id: "least-congested", label: "Least-congested" },
];

export default function RoutePicker({ selected, onSelect }) {
  // Keep refs to focus the next/previous button on arrow-key cycle.
  const buttonRefs = useRef([]);

  const indexOf = (variant) => VARIANTS.findIndex((v) => v.id === variant);

  function handleKeyDown(event, variantIndex) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = (variantIndex + 1) % VARIANTS.length;
      onSelect(VARIANTS[next].id);
      buttonRefs.current[next]?.focus();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = (variantIndex - 1 + VARIANTS.length) % VARIANTS.length;
      onSelect(VARIANTS[prev].id);
      buttonRefs.current[prev]?.focus();
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect(VARIANTS[variantIndex].id);
    }
  }

  return (
    <div
      role="radiogroup"
      aria-label="Route variant"
      className="flex flex-wrap gap-2"
    >
      {VARIANTS.map((variant, index) => {
        const isSelected = variant.id === selected;
        return (
          <button
            key={variant.id}
            ref={(el) => {
              buttonRefs.current[index] = el;
            }}
            type="button"
            role="radio"
            aria-checked={isSelected}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelect(variant.id)}
            onKeyDown={(event) => handleKeyDown(event, index)}
            className={
              "rounded-pill px-3 py-1.5 text-sm font-medium border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tide focus-visible:ring-offset-2 " +
              (isSelected
                ? "bg-tide text-white border-tide hover:bg-tide-hover"
                : "bg-surface-citizen text-body border-hairline-citizen hover:text-heading")
            }
          >
            {variant.label}
          </button>
        );
      })}
    </div>
  );
}
