import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDatabaseStatus } from "./useDatabaseStatus";
import type { DatabaseStatusResponse } from "@/types/database";

const createWrapper = () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    const client = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: Infinity,
        },
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

afterEach(() => {
  vi.restoreAllMocks();
});

describe("useDatabaseStatus", () => {
  it("não faz fetch quando systemName é vazio (enabled = false)", async () => {
    const wrapper = createWrapper();
    const fetchSpy = vi.spyOn(global, "fetch");

    const { result } = renderHook(
      () => useDatabaseStatus({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => {
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    expect(result.current.isFetching).toBe(false);
  });

  it("faz fetch com sucesso e retorna dados corretos", async () => {
    const wrapper = createWrapper();
    const mockData: DatabaseStatusResponse = {
      system: "SigPAE",
      hasDatabase: true,
      instances: [
        { label: "PostgreSQL", dbType: "postgresql", available: true },
      ],
    };

    const fetchSpy = vi
      .spyOn(global, "fetch")
      .mockResolvedValue({
        ok: true,
        json: async () => mockData,
      } as unknown as Response);

    const { result } = renderHook(
      () => useDatabaseStatus({ systemName: "SigPAE" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const calledUrl = (fetchSpy.mock.calls[0][0] as string) || "";
    expect(calledUrl).toBe("/api/zabbix/database?system=SigPAE");

    expect(result.current.data).toEqual(mockData);
  });

  it("retorna erro quando res.ok === false", async () => {
    const wrapper = createWrapper();

    vi.spyOn(global, "fetch").mockResolvedValue({
      ok: false,
      json: async () => ({}),
    } as unknown as Response);

    const { result } = renderHook(
      () => useDatabaseStatus({ systemName: "SigPAE" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(result.current.error).toBeInstanceOf(Error);
    expect((result.current.error as Error).message).toBe(
      "Falha ao buscar status do banco de dados"
    );
  });
});
