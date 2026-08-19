import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOrdemInscricaoStatusGeral } from "./useOrdemInscricaoStatusGeral";

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

describe("useOrdemInscricaoStatusGeral", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOrdemInscricaoStatusGeral({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados do status geral de ordem de inscrição", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOrdemInscricaoStatusGeral({ systemName: "Intranet" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "Cadastrados", value: 432, variant: "neutral" },
      { label: "Realizados", value: 243, variant: "success" },
      { label: "Ativos", value: 54, variant: "warning" },
      { label: "Encerrados", value: 23, variant: "danger" },
    ]);
  });
});
