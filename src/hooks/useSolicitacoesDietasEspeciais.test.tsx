import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSolicitacoesDietasEspeciais } from "./useSolicitacoesDietasEspeciais";

const PAYLOAD = {
  dia: { total: 12, autorizadas: 8, aguardando: 2, negadas: 1, canceladas: 1 },
  quinzena: {
    total: 58,
    autorizadas: 42,
    aguardando: 9,
    negadas: 4,
    canceladas: 3,
  },
  mes: { total: 110, autorizadas: 82, aguardando: 16, negadas: 7, canceladas: 5 },
  trimestre: {
    total: 310,
    autorizadas: 230,
    aguardando: 45,
    negadas: 20,
    canceladas: 15,
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

describe("useSolicitacoesDietasEspeciais", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useSolicitacoesDietasEspeciais({ systemName: "" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("busca no endpoint e monta os 5 itens do período 'dia'", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => PAYLOAD,
    } as unknown as Response);

    const { result } = renderHook(
      () =>
        useSolicitacoesDietasEspeciais({ systemName: "SigPAE", period: "dia" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigpae/dietas-especiais");
    expect(result.current.data).toEqual([
      { label: "Total", value: 12, variant: "neutral" },
      { label: "Autorizadas", value: 8, variant: "success" },
      { label: "Aguardando", value: 2, variant: "warning" },
      { label: "Negadas", value: 1, variant: "danger" },
      { label: "Canceladas", value: 1, variant: "muted" },
    ]);
  });

  it.each(["dia", "quinzena", "mes", "trimestre"] as const)(
    "seleciona o período '%s' com 5 itens",
    async (period) => {
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => PAYLOAD,
      } as unknown as Response);

      const { result } = renderHook(
        () => useSolicitacoesDietasEspeciais({ systemName: "SigPAE", period }),
        { wrapper: createWrapper() }
      );

      await waitFor(() => expect(result.current.isSuccess).toBe(true));
      expect(result.current.data).toHaveLength(5);
      expect(result.current.data?.[0]).toEqual({
        label: "Total",
        value: PAYLOAD[period].total,
        variant: "neutral",
      });
    }
  );
});
