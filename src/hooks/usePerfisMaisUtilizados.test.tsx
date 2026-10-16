import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePerfisMaisUtilizados } from "./usePerfisMaisUtilizados";

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

describe("usePerfisMaisUtilizados", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => usePerfisMaisUtilizados({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 6 linhas mockadas de perfis mais utilizados", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => usePerfisMaisUtilizados({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { label: "Diretor", value: 681 },
      { label: "GIPE admin", value: 598 },
      { label: "Ponto focal admin", value: 467 },
      { label: "GIPE", value: 342 },
      { label: "Ponto focal", value: 244 },
      { label: "Assistente de direção", value: 130 },
    ]);
  });
});
