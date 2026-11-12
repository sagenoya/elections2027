"use client";

import type { ReactNode } from "react";
import { QueryProvider } from "./query-provider";

/** Root providers. Auth (admin) and theme providers slot in above/below Query in later phases. */
export function Providers({ children }: { children: ReactNode }) {
  return <QueryProvider>{children}</QueryProvider>;
}
