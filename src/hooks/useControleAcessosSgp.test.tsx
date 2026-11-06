import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useControleAcessosSgp, useSerieAcessosSgp } from "./useControleAcessosSgp";

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

const okFetch = (corpo: unknown) =>
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => corpo,
  } as unknown as Response);

describe("useControleAcessosSgp", () => {
  it("não busca sem systemName", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(() => useControleAcessosSgp({ systemName: "" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca o estado atual na rota do controle de acessos", async () => {
    const fetchSpy = okFetch({ atualizadoEm: "2026-11-10T09:30:00-03:00" });
    const { result } = renderHook(() => useControleAcessosSgp({ systemName: "SGP" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sgp/controle-acessos");
  });

  it("vira erro quando a rota falha", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: false } as unknown as Response);
    const { result } = renderHook(() => useControleAcessosSgp({ systemName: "SGP" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("useSerieAcessosSgp", () => {
  it("busca a série da granularidade pedida", async () => {
    const fetchSpy = okFetch({ granularidade: "mes", pontos: [] });
    const { result } = renderHook(
      () => useSerieAcessosSgp({ systemName: "SGP", granularidade: "mes" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/sgp/controle-acessos/serie?granularidade=mes",
    );
  });
});
