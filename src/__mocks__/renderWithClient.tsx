import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export function withClient(children: React.ReactNode) {
  const client = new QueryClient();
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
