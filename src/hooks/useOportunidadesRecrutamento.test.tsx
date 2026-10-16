import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useOportunidadesRecrutamento } from "./useOportunidadesRecrutamento";
import type { StatsCardResponse } from "@/types/metricas";

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

const mockFetchOk = (body: unknown) =>
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => body,
  } as unknown as Response);

beforeEach(() => {
  vi.restoreAllMocks();
});

const RESPOSTA: StatsCardResponse = {
  items: [
    { label: "Cadastrados", value: 30, variant: "neutral" },
    { label: "Encerrados", value: 15, variant: "danger" },
  ],
};

describe("useOportunidadesRecrutamento", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(() => useOportunidadesRecrutamento({ systemName: "" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result.current.data).toBeUndefined();
  });

  it("entra em erro quando a rota responde com falha", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
    } as unknown as Response);
    const { result } = renderHook(() => useOportunidadesRecrutamento({ systemName: "Intranet" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });

  it("busca na rota do BFF e devolve o corpo", async () => {
    const fetchSpy = mockFetchOk(RESPOSTA);
    const { result } = renderHook(() => useOportunidadesRecrutamento({ systemName: "Intranet" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/intranet/oportunidades");
    expect(result.current.data).toEqual(RESPOSTA);
  });
});
