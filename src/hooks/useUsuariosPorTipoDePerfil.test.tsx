import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useUsuariosPorTipoDePerfil } from "./useUsuariosPorTipoDePerfil";
import {
  GIPE_METRICAS_FIXTURE,
  mockFetchGipe,
} from "./_helpers/gipeMetricas.fixture";

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
  mockFetchGipe();
});

describe("useUsuariosPorTipoDePerfil", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useUsuariosPorTipoDePerfil({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os 6 itens mockados de distribuição por tipo de perfil, somando 100%", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useUsuariosPorTipoDePerfil({ systemName: "GIPE" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toHaveLength(6);
    expect(
      result.current.data?.items.reduce((sum, item) => sum + item.percentage, 0),
    ).toBe(100);
    expect(result.current.data?.items[0]).toEqual({
      label: "Diretor de Escola",
      percentage: 28,
      color: "#3B82F6",
    });
  });
});

describe("useUsuariosPorTipoDePerfil — cores", () => {
  it("dá a cor de cada perfil pelo rótulo, com reserva para os imprevistos", async () => {
    mockFetchGipe({
      ...GIPE_METRICAS_FIXTURE,
      usuarios: {
        ...GIPE_METRICAS_FIXTURE.usuarios,
        porTipoDePerfil: [
          { label: "GIPE admin", percentage: 33 },
          { label: "Diretor de Escola", percentage: 30 },
          { label: "Diretor de Escola admin", percentage: 20 },
          { label: "Assistente de direção admin", percentage: 17 },
        ],
      },
    });
    const { result } = renderHook(
      () => useUsuariosPorTipoDePerfil({ systemName: "GIPE" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items.map((i) => i.color)).toEqual([
      "#065F46",
      "#3B82F6",
      "#8B5CF6",
      "#EC4899",
    ]);
  });

  it("dá a todos os seis perfis do painel a cor do mock", async () => {
    const { result } = renderHook(
      () => useUsuariosPorTipoDePerfil({ systemName: "GIPE" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(
      result.current.data?.items.map((i) => [i.label, i.color]),
    ).toEqual([
      ["Diretor de Escola", "#3B82F6"],
      ["Assistente de direção", "#1E3A8A"],
      ["Ponto focal", "#F59E0B"],
      ["Ponto focal admin", "#A16207"],
      ["GIPE", "#10B981"],
      ["GIPE admin", "#065F46"],
    ]);
  });
});
