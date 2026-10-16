import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAccessComparison } from "./useAccessComparison";

const bucket = (label: string, value: number, isPeak = false) => ({
  label,
  value,
  isPeak,
});

const PAYLOAD = {
  dia: {
    buckets: [bucket("Dia 1", 10), bucket("Dia 2", 25, true), bucket("Dia 3", 15)],
  },
  quinzena: {
    buckets: [
      bucket("Quinzena 1", 100),
      bucket("Quinzena 2", 200, true),
      bucket("Quinzena 3", 150),
    ],
  },
  mes: {
    buckets: [
      bucket("Semana 1", 5),
      bucket("Semana 2", 9, true),
      bucket("Semana 3", 7),
    ],
  },
  trimestre: {
    buckets: [
      bucket("Mês 1", 42300),
      bucket("Mês 2", 58900, true),
      bucket("Mês 3", 47650),
    ],
  },
};

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

describe("useAccessComparison", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useAccessComparison({ systemName: "" }),
      { wrapper: createWrapper() }
    );
    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca no endpoint e usa 'trimestre' como período padrão", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => PAYLOAD,
    } as unknown as Response);

    const { result } = renderHook(
      () => useAccessComparison({ systemName: "SigPAE" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigpae/comparativo-acessos");
    expect(result.current.data?.buckets).toEqual(PAYLOAD.trimestre.buckets);
  });

  it.each([
    ["dia", "Dia 2"],
    ["quinzena", "Quinzena 2"],
    ["mes", "Semana 2"],
    ["trimestre", "Mês 2"],
  ] as const)(
    "seleciona os buckets do período '%s'",
    async (period, expectedPeakLabel) => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => PAYLOAD,
      } as unknown as Response);

      const { result } = renderHook(
        () => useAccessComparison({ systemName: "SigPAE", period }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data?.buckets).toHaveLength(3);
      expect(
        result.current.data?.buckets.find((b) => b.isPeak)?.label
      ).toBe(expectedPeakLabel);
    }
  );
});
