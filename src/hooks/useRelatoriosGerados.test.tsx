import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRelatoriosGerados } from "./useRelatoriosGerados";

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

describe("useRelatoriosGerados", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useRelatoriosGerados({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os 10 itens mockados de relatórios gerados", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useRelatoriosGerados({ systemName: "Sigla" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(10);
    expect(result.current.data?.items[0]).toEqual({
      label: "Laudas de Vagas",
      value: 412,
      variant: "neutral",
    });
    expect(result.current.data?.items[9]).toEqual({
      label: "Listas de Candidatos por Sessão",
      value: 298,
      variant: "neutral",
    });
  });
});
