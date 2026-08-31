import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useIndicadoresParticipacaoLogistica } from "./useIndicadoresParticipacaoLogistica";

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

describe("useIndicadoresParticipacaoLogistica", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useIndicadoresParticipacaoLogistica({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os 7 indicadores mockados", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useIndicadoresParticipacaoLogistica({ systemName: "Rolê Agroecológico" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(7);
    expect(result.current.data?.items[0]).toEqual({
      label: "Vivências realizadas",
      value: 184,
      variant: "neutral",
    });
  });
});
