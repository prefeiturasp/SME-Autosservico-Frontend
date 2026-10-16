import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsuariosPorTipoDePerfil } from "./useUsuariosPorTipoDePerfil";

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

describe("useUsuariosPorTipoDePerfil", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useUsuariosPorTipoDePerfil({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os 6 itens mockados de distribuição por tipo de perfil, somando 100%", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useUsuariosPorTipoDePerfil({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(6);
    expect(
      result.current.data?.items.reduce((sum, item) => sum + item.percentage, 0),
    ).toBe(100);
    expect(result.current.data?.items[0]).toEqual({
      label: "Diretor",
      percentage: 28,
      color: "#3B82F6",
    });
  });
});
