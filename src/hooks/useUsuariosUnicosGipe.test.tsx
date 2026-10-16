import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsuariosUnicosGipe } from "./useUsuariosUnicosGipe";

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

describe("useUsuariosUnicosGipe", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useUsuariosUnicosGipe({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os usuários únicos por dia mockados do GIPE", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useUsuariosUnicosGipe({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      uniqueCount: 1242,
      trend: "below",
      trendLabel: "12% abaixo da média diária",
    });
  });
});
