import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAcessoAtivoBensFisicos } from "./useAcessoAtivoBensFisicos";
import {
  BENS_FISICOS_METRICAS_FIXTURE,
  mockFetchBensFisicos,
} from "./_helpers/bensFisicosMetricas.fixture";

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
  mockFetchBensFisicos();
});

describe("useAcessoAtivoBensFisicos", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useAcessoAtivoBensFisicos({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna o acesso ativo do Bens Físicos vindo do BFF", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useAcessoAtivoBensFisicos({ systemName: "Bens Físicos" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(BENS_FISICOS_METRICAS_FIXTURE.acessoAtivo);
  });
});
