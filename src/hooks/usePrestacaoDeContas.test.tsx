import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePrestacaoDeContas } from "./usePrestacaoDeContas";

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

describe("usePrestacaoDeContas", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => usePrestacaoDeContas({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa '2026.1' como período padrão e retorna os valores do Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => usePrestacaoDeContas({ systemName: "SigEscola" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      items: [
        {
          label: "Prestações de contas enviadas ou em andamento com as DREs",
          value: 2490,
          variant: "neutral",
        },
        {
          label: "Créditos disponíveis para as UEs",
          value: 197248412.27,
          variant: "success",
          format: "currency",
        },
        {
          label: "Despesas registradas pelas as UEs",
          value: 90490083.76,
          variant: "danger",
          format: "currency",
        },
        {
          label: "Demonstrativos financeiros gerados pelas UEs",
          value: 3683,
          variant: "neutral",
        },
      ],
    });
  });

  it.each(["2025.1", "2025.2", "2026.1", "2026.2"])(
    "retorna dados para o período '%s'",
    async (periodo) => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => usePrestacaoDeContas({ systemName: "SigEscola", periodo }),
        { wrapper },
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.items).toHaveLength(4);
    },
  );
});
