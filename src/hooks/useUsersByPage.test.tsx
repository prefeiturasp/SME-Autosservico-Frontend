import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsersByPage } from "./useUsersByPage";

const createWrapper = () => {
  const Wrapper = ({ children }: { readonly children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: {
        queries: { retry: false, gcTime: Infinity },
      },
    });
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
  Wrapper.displayName = "QueryClientTestWrapper";
  return Wrapper;
};

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("useUsersByPage", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useUsersByPage({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna dados mock e propaga o systemName", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useUsersByPage({ systemName: "Novo SGP" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.system).toBe("Novo SGP");
    expect(Array.isArray(result.current.data?.pages)).toBe(true);
    expect(result.current.data?.pages.length).toBeGreaterThan(0);
    expect(result.current.data?.pages[0]).toMatchObject({
      path: expect.any(String),
      currentUsers: expect.any(Number),
      averageUsers: expect.any(Number),
    });
  });

  it("retorna o mock específico do SigPAE quando a coordenadoria é CODAE", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useUsersByPage({ systemName: "SigPAE", coordenadoria: "CODAE" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    const paths = result.current.data?.pages.map((page) => page.path);
    expect(paths).toEqual([
      "/Página Inicial",
      "/Lançamento de Medição Inicial",
      "/Solicitação de Alimentação",
      "/Fichas Técnicas",
      "/Acompanhamento de Medição Inicial",
      "/Cronogramas de Entrega",
      "/Consulta Dieta Especial",
    ]);
  });

  it("retorna o mock genérico quando a coordenadoria não é CODAE", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useUsersByPage({ systemName: "Intranet", coordenadoria: "COPED" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(
      result.current.data?.pages.some((page) => page.path === "/Fichas Técnicas"),
    ).toBe(false);
  });
});
