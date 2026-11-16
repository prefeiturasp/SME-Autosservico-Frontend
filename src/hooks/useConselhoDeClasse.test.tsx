import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useConselhoDeClasse } from "./useConselhoDeClasse";
import type { StatItem } from "@/types/metricas";

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

const RESPOSTA: StatItem[] = [
  { label: "Esperados para o período", value: 2480, variant: "neutral", percentage: 91.77 },
];

describe("useConselhoDeClasse", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useConselhoDeClasse({ systemName: "", periodo: "eja:2026:2:1" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca a rota do conselho com o período da EJA", async () => {
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: async () => RESPOSTA,
    } as unknown as Response);

    const { result } = renderHook(
      () => useConselhoDeClasse({ systemName: "SGP", periodo: "eja:2026:2:1" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/sgp/conselho-de-classe?ano_letivo=2026&bimestre=1&segmento=eja&semestre=2",
    );
    expect(result.current.data).toEqual(RESPOSTA);
  });

  it("não busca com um período inválido", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(
      () => useConselhoDeClasse({ systemName: "SGP", periodo: "eja:2026:2:3" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
