import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useJenkinsMetrics } from "./useJenkinsMetrics";

const createWrapper = () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const client = new QueryClient({
            defaultOptions: {
                queries: { retry: false, gcTime: Infinity },
            },
        });
        return React.createElement(QueryClientProvider, { client }, children);
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

describe("useJenkinsMetrics", () => {
    it("não faz fetch quando projectName é vazio (enabled = false)", async () => {
        const wrapper = createWrapper();
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        renderHook(() => useJenkinsMetrics({ projectName: "" }), { wrapper });

        await new Promise((r) => setTimeout(r, 50));
        expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("faz fetch com sucesso sem environment (usa 'prod' na queryKey)", async () => {
        const wrapper = createWrapper();
        const mockData = { builds: [] };

        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => mockData,
        } as unknown as Response);

        const { result } = renderHook(
            () => useJenkinsMetrics({ projectName: "SME-NovoSGP" }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(fetchSpy).toHaveBeenCalledTimes(1);
        const calledUrl = fetchSpy.mock.calls[0][0] as string;
        expect(calledUrl).toContain("project=SME-NovoSGP");
        // sem environment, não deve ter param 'env'
        expect(calledUrl).not.toContain("env=");
        expect(result.current.data).toEqual(mockData);
    });

    it("não inclui env na querystring quando environment = 'prod'", async () => {
        const wrapper = createWrapper();

        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as unknown as Response);

        const { result } = renderHook(
            () =>
                useJenkinsMetrics({
                    projectName: "SME-NovoSGP",
                    environment: "prod",
                }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const calledUrl = fetchSpy.mock.calls[0][0] as string;
        expect(calledUrl).not.toContain("env=");
    });

    it("inclui env na querystring quando environment não é 'prod'", async () => {
        const wrapper = createWrapper();

        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => ({}),
        } as unknown as Response);

        const { result } = renderHook(
            () =>
                useJenkinsMetrics({
                    projectName: "SME-NovoSGP",
                    environment: "homolog",
                }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const calledUrl = fetchSpy.mock.calls[0][0] as string;
        expect(calledUrl).toContain("env=homolog");
    });

    it("lança erro quando res.ok é false", async () => {
        const wrapper = createWrapper();

        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            json: async () => ({}),
        } as unknown as Response);

        const { result } = renderHook(
            () => useJenkinsMetrics({ projectName: "SME-NovoSGP" }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect((result.current.error as Error).message).toBe(
            "Falha ao buscar métricas do Jenkins",
        );
    });
});
