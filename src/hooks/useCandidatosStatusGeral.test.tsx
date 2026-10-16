import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCandidatosStatusGeral } from "./useCandidatosStatusGeral";

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

describe("useCandidatosStatusGeral", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useCandidatosStatusGeral({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os 8 itens mockados do status geral de candidatos", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useCandidatosStatusGeral({ systemName: "Sigla" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(8);
    expect(result.current.data?.items[0]).toEqual({
      label: "Candidatos habilitados",
      value: 3240,
      variant: "neutral",
    });
    expect(result.current.data?.items[7]).toEqual({
      label: "Candidatos em lista específica",
      value: 186,
      variant: "normal",
    });
  });
});
