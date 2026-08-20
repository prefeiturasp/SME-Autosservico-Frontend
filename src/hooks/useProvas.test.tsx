import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useProvas } from "./useProvas";

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

describe("useProvas", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProvas({ systemName: "" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("usa '2026-2' (2º Bimestre de 2026) como bimestre padrão", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useProvas({ systemName: "Serap" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual({
      items: [
        { label: "Total de provas", value: 8398, variant: "neutral" },
        { label: "Provas iniciadas hoje", value: 7530, variant: "muted" },
        { label: "Provas não finalizadas", value: 1853, variant: "warning" },
        { label: "Provas finalizadas", value: 6398, variant: "success" },
      ],
      progressPercentage: 96.3,
    });
  });

  it.each(["2025-3", "2025-4", "2026-1", "2026-2"])(
    "retorna dados para o bimestre '%s'",
    async (bimestre) => {
      const wrapper = createWrapper();
      const { result } = renderHook(
        () => useProvas({ systemName: "Serap", bimestre }),
        { wrapper }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.items).toHaveLength(4);
      expect(result.current.data?.progressPercentage).toBeGreaterThan(0);
    }
  );
});
