import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePeakUsageToday } from "./usePeakUsageToday";

const createWrapper = () => {
  const Wrapper = ({ children }: { readonly children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: Infinity },
      },
    });
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("usePeakUsageToday", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => usePeakUsageToday({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna peakHour e status válidos para o systemName informado", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => usePeakUsageToday({ systemName: "SigPAE" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.system).toBe("SigPAE");
    expect(result.current.data?.peakHour).toBeTypeOf("number");
    expect(["peak", "off-peak"]).toContain(result.current.data?.status);
  });
});
