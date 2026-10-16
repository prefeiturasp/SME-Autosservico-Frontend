import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConvocacoesPorAno } from "./useConvocacoesPorAno";

const createWrapper = () => {
  const Wrapper = ({ children }: { readonly children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: { queries: { retry: false, gcTime: Infinity } },
    });
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useConvocacoesPorAno", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useConvocacoesPorAno({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 8 linhas mockadas por ano, com as 5 primeiras batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useConvocacoesPorAno({ systemName: "Sigla" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(8);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { label: "2026", value: 542 },
      { label: "2025", value: 654 },
      { label: "2024", value: 483 },
      { label: "2023", value: 452 },
      { label: "2022", value: 348 },
    ]);
  });
});
