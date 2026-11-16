import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

vi.mock("@/lib/analytics", () => ({ fetchAnalytics: vi.fn() }));

import { fetchAnalytics } from "@/lib/analytics";
import { usePeakHours } from "./usePeakHours";

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

describe("usePeakHours", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const { result } = renderHook(() => usePeakHours({ systemName: "" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
    expect(mockedFetch).not.toHaveBeenCalled();
  });

  it("busca o indicador do sistema e período informados", async () => {
    const resposta = { system: "SGP", peakHour: "11h", data: [] };
    mockedFetch.mockResolvedValueOnce(resposta);

    const { result } = renderHook(
      () => usePeakHours({ systemName: "SGP", period: "7-dias" }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(resposta);
    expect(mockedFetch).toHaveBeenCalledWith("peak-hours", "SGP", "7-dias");
  });

  it("usa o período padrão e expõe o erro da consulta", async () => {
    mockedFetch.mockRejectedValueOnce(new Error("falha"));

    const { result } = renderHook(() => usePeakHours({ systemName: "SGP" }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockedFetch).toHaveBeenCalledWith("peak-hours", "SGP", "hoje");
  });
});
