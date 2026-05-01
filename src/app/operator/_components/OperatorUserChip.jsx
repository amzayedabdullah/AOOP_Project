"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useOperatorSession } from "@/lib/operatorSession";
import { formatRelativeFromNow } from "@/lib/relativeTime";
import useTick from "@/lib/useTick";

function initialsFor(name) {
  const tokens = name.trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return "?";
  if (tokens.length === 1) return tokens[0][0].toUpperCase();
  return (tokens[0][0] + tokens[tokens.length - 1][0]).toUpperCase();
}

export default function OperatorUserChip() {
  const router = useRouter();
  const wrapperRef = useRef(null);
  const buttonRef = useRef(null);

  const session = useOperatorSession();
  const [open, setOpen] = useState(false);
  const { now } = useTick(60_000);

  useEffect(() => {
    if (!open) return;

    function onMouseDown(event) {
      if (!wrapperRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }
    function onKey(event) {
      if (event.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!session) {
    return (
      <span
        aria-hidden="true"
        className="w-8 h-8 rounded-pill bg-surface-2 border border-hairline"
      />
    );
  }

  const initials = initialsFor(session.name);
  const relative = formatRelativeFromNow(session.signedInAt, now);

  function handleSignOut() {
    signOut();
    router.replace("/operator/sign-in");
  }

  return (
    <div ref={wrapperRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`Signed in as ${session.name}, ${session.district}`}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((v) => !v)}
        className="w-8 h-8 rounded-pill bg-surface-2 border border-hairline text-xs font-semibold text-ink flex items-center justify-center hover:bg-surface-3"
      >
        {initials}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Operator session"
          className="absolute right-0 top-full mt-2 w-64 max-w-[calc(100vw-2rem)] rounded-md border border-hairline bg-surface-3 p-4 text-ink shadow-lg z-20"
        >
          <div className="text-sm font-medium">{session.name}</div>
          <div className="text-xs text-ink-muted mt-0.5">{session.district}</div>
          <div className="text-xs text-ink-subtle mt-3 tabular-nums">
            Signed in {relative || "just now"}
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="mt-4 w-full rounded-md border border-hairline px-3 py-1.5 text-sm text-ink-muted hover:text-ink hover:bg-surface-4"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
