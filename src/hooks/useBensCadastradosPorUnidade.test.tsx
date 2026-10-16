import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBensCadastradosPorUnidade } from "./useBensCadastradosPorUnidade";

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

describe("useBensCadastradosPorUnidade", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useBensCadastradosPorUnidade({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 8 unidades administrativas mockadas, com as 5 primeiras batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useBensCadastradosPorUnidade({ systemName: "Bens Físicos" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(8);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { label: "SME/COTIC", value: 6247 },
      { label: "SME/COPED", value: 4123 },
      { label: "SME/COPLAN", value: 3560 },
      { label: "SME/CODAE", value: 1870 },
      { label: "SME/ASCOM", value: 1328 },
    ]);
  });
});
