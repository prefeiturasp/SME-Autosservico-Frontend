import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUnidadesProdutivasIndicadores } from "./useUnidadesProdutivasIndicadores";

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

describe("useUnidadesProdutivasIndicadores", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useUnidadesProdutivasIndicadores({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os 3 indicadores mockados", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useUnidadesProdutivasIndicadores({ systemName: "Rolê Agroecológico" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "UPs cadastradas para o projeto", value: 63, variant: "neutral" },
      {
        label: "UPs em áreas de preservação ambiental e/ou mananciais",
        value: 18,
        variant: "danger",
      },
      { label: "UPs que receberam visita", value: 47, variant: "success" },
    ]);
  });
});
