import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSorteiosPorTipo } from "./useSorteiosPorTipo";

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

describe("useSorteiosPorTipo", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useSorteiosPorTipo({ systemName: "" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa 'dia' como período padrão", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useSorteiosPorTipo({ systemName: "Intranet" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual([
      { label: "Premiação", value: 254 },
      { label: "Data específica", value: 124 },
      { label: "Período", value: 57 },
    ]);
  });

  it.each(["dia", "quinzena", "mes", "trimestre"] as const)(
    "retorna 3 linhas para o período '%s'",
    async (period) => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useSorteiosPorTipo({ systemName: "Intranet", period }),
        { wrapper }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(3);
    }
  );
});
