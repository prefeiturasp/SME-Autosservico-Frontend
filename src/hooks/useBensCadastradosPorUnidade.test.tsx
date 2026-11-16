import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useBensCadastradosPorUnidade } from "./useBensCadastradosPorUnidade";
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

describe("useBensCadastradosPorUnidade", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useBensCadastradosPorUnidade({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as unidades administrativas vindas do BFF", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useBensCadastradosPorUnidade({ systemName: "Bens Físicos" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(BENS_FISICOS_METRICAS_FIXTURE.bensPorUnidade);
  });
});
