"use client";

// Community-reporting persistence layer.
//
// Storage: a single localStorage key holding a JSON array. Errors are
// swallowed silently — corrupt JSON, missing localStorage (SSR or private
// browsing), and quota failures all return [] / no-op so the demo keeps
// working. Bumping the :v suffix in STORAGE_KEY is the migration story.
//
// Hydration model: useSyncExternalStore subscribes to a module-level
// in-memory mirror of the localStorage array. The server snapshot is a
// stable empty array; the client snapshot reflects the mirror. React 19
// re-renders cleanly after hydration without warnings.

import { useSyncExternalStore } from "react";

export const STORAGE_KEY = "floodwatch:community-reports:v1";

const SERVER_SNAPSHOT = [];

let memoryStore = null; // lazy: null until first client read, then Array
const listeners = new Set();

function hasLocalStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadReports() {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveReports(reports) {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(reports));
  } catch {
    // Quota exceeded, private mode, etc. — silently no-op.
  }
}

function generateId() {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  const suffix = Math.random().toString(36).slice(2, 8);
  return `r-${Date.now()}-${suffix}`;
}

function notifyListeners() {
  for (const listener of listeners) listener();
}

function getSnapshot() {
  if (memoryStore === null) memoryStore = loadReports();
  return memoryStore;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addReport(input) {
  const current = memoryStore ?? loadReports();
  const next = [
    ...current,
    {
      id: generateId(),
      districtId: input.districtId,
      type: input.type,
      description: input.description,
      reporterName: input.reporterName ?? null,
      submittedAt: new Date().toISOString(),
    },
  ];
  memoryStore = next;
  saveReports(next);
  notifyListeners();
  return next;
}

export function useCommunityReports() {
  const reports = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => SERVER_SNAPSHOT,
  );
  return { reports, submitReport: addReport };
}
