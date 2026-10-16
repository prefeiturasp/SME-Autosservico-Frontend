import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAgendamentosRolesIndicadores } from "./useAgendamentosRolesIndicadores";

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

describe("useAgendamentosRolesIndicadores", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useAgendamentosRolesIndicadores({ systemName: "" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os 4 indicadores mockados", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useAgendamentosRolesIndicadores({ systemName: "Rolê Agroecológico" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "Agendamentos totais", value: 268, variant: "neutral" },
      { label: "Agendamentos na última semana", value: 24, variant: "neutral" },
      { label: "Rolês concluídos até o momento", value: 152, variant: "success" },
      { label: "Rolês previstos para a semana", value: 18, variant: "warning" },
    ]);
  });
});
