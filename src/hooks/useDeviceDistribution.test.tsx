import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/analytics", () => ({ fetchAnalytics: vi.fn() }));

import { fetchAnalytics } from "@/lib/analytics";
import { useDeviceDistribution } from "./useDeviceDistribution";

const mockedFetch = vi.mocked(fetchAnalytics);

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
  mockedFetch.mockReset();
});

describe("useDeviceDistribution", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const { result } = renderHook(() => useDeviceDistribution({ systemName: "" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("busca o indicador do sistema e período informados", async () => {
    const resposta = { system: "SGP", desktop: 84, mobile: 15, tablet: 1, warning: null };
    mockedFetch.mockResolvedValueOnce(resposta);

    const { result } = renderHook(
      () => useDeviceDistribution({ systemName: "SGP", period: "7-dias" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(resposta);
    expect(mockedFetch).toHaveBeenCalledWith("device-distribution", "SGP", "7-dias");
  });

  it("usa o período padrão e expõe o erro da consulta", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("falha"));

    const { result } = renderHook(() => useDeviceDistribution({ systemName: "SGP" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedFetch).toHaveBeenCalledWith("device-distribution", "SGP", "hoje");
  });
});
