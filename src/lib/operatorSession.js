// Frontend-only operator session — there is no backend.
// Anyone can edit localStorage in devtools and bypass this gate; that is
// inherent to a UI prototype and explicitly accepted in the design doc.

import { useSyncExternalStore } from "react";
import { operatorAccounts } from "@/data/operatorAccounts";

export const SESSION_KEY = "floodwatch.operatorSession";

function isBrowser() {
  return typeof window !== "undefined";
}

export function signIn(id, password) {
  if (!isBrowser()) return null;

  const match = operatorAccounts.find(
    (account) => account.id === id && account.password === password,
  );
  if (!match) return null;

  const session = {
    operatorId: match.id,
    name: match.name,
    district: match.district,
    signedInAt: new Date().toISOString(),
  };
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new StorageEvent("storage", { key: SESSION_KEY }));
  return session;
}

export function getSession() {
  if (!isBrowser()) return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.operatorId || !parsed.name || !parsed.district) {
      window.localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    window.localStorage.removeItem(SESSION_KEY);
    return null;
  }
}

export function signOut() {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_KEY);
  // Manually notify same-tab subscribers; the `storage` event only fires
  // in *other* tabs/windows.
  window.dispatchEvent(new StorageEvent("storage", { key: SESSION_KEY }));
}

function subscribeToSession(onChange) {
  function handler(event) {
    if (event.key === null || event.key === SESSION_KEY) onChange();
  }
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

// Cache the parsed snapshot so useSyncExternalStore sees a stable reference
// when the underlying string hasn't changed. Without this it would warn
// about returning a new object on every getSnapshot call.
let cachedRaw = null;
let cachedSession = null;

function readSnapshot() {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (raw === cachedRaw) return cachedSession;
  cachedRaw = raw;
  cachedSession = getSession();
  return cachedSession;
}

export function useOperatorSession() {
  return useSyncExternalStore(
    subscribeToSession,
    readSnapshot,
    () => null,
  );
}
