import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccessComparison } from "./useAccessComparison";

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

describe("useAccessComparison", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useAccessComparison({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa 'trimestre' como período padrão e marca o bucket central como pico", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useAccessComparison({ systemName: "SigPAE" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.buckets).toEqual([
      { label: "Mês 1", value: 42300, isPeak: false },
      { label: "Mês 2", value: 58900, isPeak: true },
      { label: "Mês 3", value: 47650, isPeak: false },
    ]);
  });

  it.each([
    ["dia", "Dia 2"],
    ["quinzena", "Quinzena 2"],
    ["mes", "Semana 2"],
    ["trimestre", "Mês 2"],
  ] as const)(
    "retorna buckets rotulados corretamente para o período '%s'",
    async (period, expectedPeakLabel) => {
      const wrapper = createWrapper();

      const { result } = renderHook(
        () => useAccessComparison({ systemName: "SigPAE", period }),
        { wrapper }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));

      expect(result.current.data?.buckets).toHaveLength(3);
      expect(
        result.current.data?.buckets.find((bucket) => bucket.isPeak)?.label
      ).toBe(expectedPeakLabel);
    }
  );
});
