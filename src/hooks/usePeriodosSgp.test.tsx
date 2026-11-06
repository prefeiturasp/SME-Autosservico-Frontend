import React from "react";
import { act, renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { usePeriodoSgp, usePeriodosSgp } from "./usePeriodosSgp";
import type { PeriodoSgpOption } from "@/types/sgpMetricas";

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

const OPCOES: PeriodoSgpOption[] = [
  { value: "fundamental_medio:2026:0:3", label: "3º Bimestre de 2026", segmento: "fundamental_medio" },
  { value: "fundamental_medio:2026:0:4", label: "4º Bimestre de 2026", segmento: "fundamental_medio" },
  { value: "eja:2026:2:2", label: "EJA - 2º Bim. do 2º Sem. 2026", segmento: "eja" },
];

const okFetch = (corpo: unknown) =>
  vi.spyOn(global, "fetch").mockResolvedValue({
    ok: true,
    json: async () => corpo,
  } as unknown as Response);

describe("usePeriodosSgp", () => {
  it("não busca sem systemName", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const { result } = renderHook(() => usePeriodosSgp({ systemName: "" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("busca as opções na rota de períodos", async () => {
    const fetchSpy = okFetch(OPCOES);
    const { result } = renderHook(() => usePeriodosSgp({ systemName: "SGP" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchSpy).toHaveBeenCalledWith("/api/sgp/periodos");
    expect(result.current.data).toEqual(OPCOES);
  });

  it("vira erro quando a rota falha", async () => {
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: false } as unknown as Response);
    const { result } = renderHook(() => usePeriodosSgp({ systemName: "SGP" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});

describe("usePeriodoSgp", () => {
  it("começa no último bimestre de Fundamental/Médio e aceita a troca", async () => {
    okFetch(OPCOES);
    const { result } = renderHook(() => usePeriodoSgp("SGP"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.opcoes).toEqual(OPCOES));
    expect(result.current.periodo).toBe("fundamental_medio:2026:0:4");

    act(() => result.current.setPeriodo("eja:2026:2:2"));

    expect(result.current.periodo).toBe("eja:2026:2:2");
  });
});
