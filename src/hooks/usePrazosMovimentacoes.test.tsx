import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePrazosMovimentacoes } from "./usePrazosMovimentacoes";

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

describe("usePrazosMovimentacoes", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => usePrazosMovimentacoes({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados de prazos e movimentações", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => usePrazosMovimentacoes({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "Ocorrências dentro do prazo", value: 903, variant: "neutral" },
      { label: "Ocorrências fora do prazo", value: 98, variant: "danger" },
      {
        label: "Ocorrências dentro sem movimentações há mais de 7 dias",
        value: 47,
        variant: "warning",
      },
      {
        label: "Média de movimentações por ocorrência",
        value: 3.8,
        variant: "neutral",
      },
    ]);
  });
});
