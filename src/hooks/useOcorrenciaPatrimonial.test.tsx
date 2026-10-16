import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOcorrenciaPatrimonial } from "./useOcorrenciaPatrimonial";

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

describe("useOcorrenciaPatrimonial", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciaPatrimonial({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna as 6 linhas mockadas, com as 5 primeiras batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useOcorrenciaPatrimonial({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(6);
    expect(result.current.data?.slice(0, 5)).toEqual([
      { label: "Dano material", value: 86 },
      { label: "Depredação ou vandalismo", value: 64 },
      { label: "Ocorrência com câmera/Smart Sampa", value: 38 },
      { label: "Furto", value: 28 },
      { label: "Invasão", value: 22 },
    ]);
  });
});
