import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOportunidadesRecrutamento } from "./useOportunidadesRecrutamento";

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

describe("useOportunidadesRecrutamento", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOportunidadesRecrutamento({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados de oportunidades e recrutamento", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOportunidadesRecrutamento({ systemName: "Intranet" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "Oportunidades cadastradas", value: 86, variant: "neutral" },
      { label: "CVs cadastrados", value: 2340, variant: "neutral" },
      { label: "Inscrições realizadas", value: 1912, variant: "warning" },
      { label: "Contratações efetivadas", value: 64, variant: "success" },
    ]);
  });
});
