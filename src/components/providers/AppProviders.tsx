"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { ProgressProvider } from "@bprogress/next/app";
import QueryProvider from "@/components/providers/QueryProvider";

export default function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <ProgressProvider
          height="4px"
          options={{ showSpinner: false }}
          shallowRouting
        >
          {children}
        </ProgressProvider>
      </QueryProvider>
      <Toaster position="top-right" richColors duration={7000} closeButton />
    </AuthProvider>
  );
}
