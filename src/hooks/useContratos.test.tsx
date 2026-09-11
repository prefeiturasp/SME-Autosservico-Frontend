import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useContratos } from "./useContratos";

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

describe("useContratos", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useContratos({ systemName: "" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os 7 contratos mockados, com os 5 primeiros batendo com o Figma", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useContratos({ systemName: "Limpeza" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toHaveLength(7);
    expect(result.current.data?.slice(0, 5)).toEqual([
      {
        termoContrato: "8613277/2026",
        prestador: "Prestador 1",
        vigencia: "até 03/2027",
      },
      {
        termoContrato: "0861221/2026",
        prestador: "Prestador 2",
        vigencia: "até 11/2026",
      },
      {
        termoContrato: "1328231/2025",
        prestador: "Prestador 3",
        vigencia: "até 07/2027",
      },
      {
        termoContrato: "3841628/2025",
        prestador: "Prestador 4",
        vigencia: "até 02/2028",
      },
      {
        termoContrato: "0123355/2025",
        prestador: "Prestador 5",
        vigencia: "até 07/2027",
      },
    ]);
  });
});
