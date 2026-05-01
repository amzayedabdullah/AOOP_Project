"use client";

// Operator-side mock outbox. Mirrors the community-reporting localStorage
// pattern: one versioned key, swallow errors silently, useSyncExternalStore
// for hydration-safe reads. Sent alerts persist until the user clears their
// browser data; "Delivered" is hardcoded — no real channels are dispatched.

import { useSyncExternalStore } from "react";

export const STORAGE_KEY = "floodwatch:alert-outbox:v1";

const SERVER_SNAPSHOT = [];

let memoryStore = null; // null = not loaded; Array = loaded
const listeners = new Set();

function hasLocalStorage() {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadOutbox() {
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

export function saveOutbox(entries) {
  if (!hasLocalStorage()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // Quota / private mode — silently no-op.
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
  return `a-${Date.now()}-${suffix}`;
}

function notifyListeners() {
  for (const listener of listeners) listener();
}

function getSnapshot() {
  if (memoryStore === null) memoryStore = loadOutbox();
  return memoryStore;
}

function subscribe(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addOutboxEntry(input) {
  const current = memoryStore ?? loadOutbox();
  const next = [
    ...current,
    {
      id: generateId(),
      districtId: input.districtId,
      level: input.level,
      headline: input.headline,
      body: input.body,
      channels: input.channels,
      sentAt: new Date().toISOString(),
    },
  ];
  memoryStore = next;
  saveOutbox(next);
  notifyListeners();
  return next;
}

export function useAlertOutbox() {
  const entries = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => SERVER_SNAPSHOT,
  );
  return { entries, sendAlert: addOutboxEntry };
}
