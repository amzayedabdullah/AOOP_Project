"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { operatorAccounts } from "@/data/operatorAccounts";
import { signIn } from "@/lib/operatorSession";
import ForgotPasswordModal from "./_components/ForgotPasswordModal";
import OperatorThemeToggle from "../_components/OperatorThemeToggle";

export default function OperatorSignInPage() {
  const router = useRouter();
  const passwordRef = useRef(null);

  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError("");

    // 400ms delay is purely cosmetic — there is no real authentication
    // happening, this just lets the button show a "Signing in…" state so
    // the gate doesn't feel instant in a way that gives the demo away.
    setTimeout(() => {
      const session = signIn(id, password);
      if (session) {
        router.replace("/operator");
        return;
      }
      setError("Invalid operator id or password");
      setPending(false);
    }, 400);
  }

  function closeForgot() {
    setForgotOpen(false);
    passwordRef.current?.focus();
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-canvas-operator text-ink px-4 py-12">
      <div className="w-full max-w-sm relative">
        {/* Toggle sits absolute-positioned in the card's top-right so it
            stays reachable before sign-in without claiming a row of its own. */}
        <div className="absolute right-0 -top-2">
          <OperatorThemeToggle />
        </div>
        <div className="text-center">
          <span className="font-medium tracking-tight text-ink text-lg">
            Floodwatch
          </span>
          <p className="mt-1 text-sm text-ink-subtle">Operator console</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 rounded-md border border-hairline bg-surface-1 p-6"
        >
          <label className="block">
            <span className="text-xs font-medium text-ink-muted">
              Operator id
            </span>
            <input
              type="text"
              autoComplete="username"
              value={id}
              onChange={(e) => setId(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-hairline bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-tide"
              placeholder="op-dh-01"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-medium text-ink-muted">Password</span>
            <input
              ref={passwordRef}
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-hairline bg-surface-2 px-3 py-2 text-sm text-ink outline-none focus:border-tide"
            />
          </label>

          <div
            role="alert"
            aria-live="polite"
            className="mt-3 min-h-5 text-xs font-medium text-ink"
          >
            {error}
          </div>

          <button
            type="submit"
            disabled={pending}
            className="mt-2 w-full rounded-md bg-tide px-3 py-2 text-sm font-medium text-white hover:bg-tide-pressed disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>

          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={() => setForgotOpen(true)}
              className="text-xs text-ink-muted hover:text-ink underline-offset-2 hover:underline"
            >
              Forgot password?
            </button>
          </div>
        </form>

        <details className="mt-4 rounded-md border border-hairline bg-surface-1 px-4 py-3 text-sm text-ink-muted">
          <summary className="cursor-pointer text-xs font-medium text-ink-muted">
            Demo credentials
          </summary>
          <ul className="mt-3 space-y-2 text-xs">
            {operatorAccounts.map((account) => (
              <li
                key={account.id}
                className="flex items-baseline justify-between gap-3 font-mono"
              >
                <span className="text-ink">{account.id}</span>
                <span className="text-ink-muted">{account.password}</span>
                <span className="text-ink-subtle">{account.district}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <ForgotPasswordModal open={forgotOpen} onClose={closeForgot} />
    </div>
  );
}
