"use client";

// This is a frontend-only, cosmetic auth gate. There is no backend, no
// signed token, and no server-side check — anyone can open devtools and
// inject a session blob into localStorage to bypass it. That is accepted
// as inherent to a UI prototype; see openspec/changes/operator-auth/design.md
// (Risks / Trade-offs).

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useOperatorSession } from "@/lib/operatorSession";

export default function OperatorAuthGate({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const session = useOperatorSession();

  useEffect(() => {
    if (!session && pathname !== "/operator/sign-in") {
      router.replace("/operator/sign-in");
    }
  }, [session, pathname, router]);

  if (!session) {
    return <div className="min-h-screen bg-canvas-operator" />;
  }

  return children;
}
