import React from "react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useDeviceDistribution } from "./useDeviceDistribution";

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

describe("useDeviceDistribution", () => {
  it("não dispara fetch quando systemName é vazio", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useDeviceDistribution({ systemName: "" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.data).toBeUndefined();
  });

  it("retorna dados mock e propaga o systemName", async () => {
    const wrapper = createWrapper();

    const { result } = renderHook(
      () => useDeviceDistribution({ systemName: "Novo SGP" }),
      { wrapper }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toMatchObject({
      system: "Novo SGP",
      desktop: expect.any(Number),
      mobile: expect.any(Number),
      tablet: expect.any(Number),
    });
  });
});
