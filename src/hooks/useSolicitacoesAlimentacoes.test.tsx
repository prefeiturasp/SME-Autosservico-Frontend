import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSolicitacoesAlimentacoes } from "./useSolicitacoesAlimentacoes";

const PAYLOAD = {
  dia: { total: 0, autorizadas: 0, aguardando: 0, negadas: 0, canceladas: 0 },
  quinzena: {
    total: 19,
    autorizadas: 10,
    aguardando: 0,
    negadas: 9,
    canceladas: 0,
  },
  mes: { total: 19, autorizadas: 10, aguardando: 0, negadas: 9, canceladas: 0 },
  trimestre: {
    total: 360,
    autorizadas: 285,
    aguardando: 32,
    negadas: 14,
    canceladas: 8,
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

describe("useSolicitacoesAlimentacoes", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useSolicitacoesAlimentacoes({ systemName: "" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("busca no endpoint e usa 'trimestre' como período padrão", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => PAYLOAD,
    } as unknown as Response);

    const { result } = renderHook(
      () => useSolicitacoesAlimentacoes({ systemName: "SigPAE" }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sigpae/alimentacoes");
    expect(result.current.data).toEqual([
      { label: "Total", value: 360, variant: "neutral" },
      { label: "Autorizadas", value: 285, variant: "success" },
      { label: "Aguardando", value: 32, variant: "warning" },
      { label: "Negadas", value: 14, variant: "danger" },
      { label: "Canceladas", value: 8, variant: "muted" },
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
        () => useSolicitacoesAlimentacoes({ systemName: "SigPAE", period }),
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
