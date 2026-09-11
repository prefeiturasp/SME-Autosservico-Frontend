import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFechamentos } from "./useFechamentos";

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

describe("useFechamentos", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useFechamentos({ systemName: "" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna os itens mockados de fechamentos", async () => {
    const wrapper = createWrapper();
    const { result } = renderHook(
      () => useFechamentos({ systemName: "Limpeza" }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.items).toEqual([
      { label: "Total", value: 620, variant: "neutral" },
      { label: "Automático atendido", value: 410, variant: "success" },
      { label: "Automático não atendido", value: 55, variant: "danger" },
      { label: "Fiscal atendido", value: 130, variant: "success" },
      { label: "Fiscal não atendido", value: 25, variant: "danger" },
    ]);
  });
});
