import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useMovimentacoesTransferencias } from "./useMovimentacoesTransferencias";

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

describe("useMovimentacoesTransferencias", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useMovimentacoesTransferencias({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados de movimentações e transferências", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useMovimentacoesTransferencias({ systemName: "Bens Físicos" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "Movimentações realizadas", value: 3150, variant: "neutral" },
      { label: "Movimentações pendentes", value: 214, variant: "warning" },
      { label: "Transferências realizadas", value: 892, variant: "neutral" },
    ]);
  });
});
