import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useAzureDevOpsBacklog } from "./useAzureDevOpsBacklog";

const createWrapper = () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        const client = new QueryClient({
            defaultOptions: { queries: { retry: false, gcTime: Infinity } },
        });
        return React.createElement(QueryClientProvider, { client }, children);
    };
    Wrapper.displayName = "QueryClientTestWrapper";
    return Wrapper;
};

const mockResponse = {
    total_items: 0,
    parents: [],
    children: [],
    metadata: {},
};

beforeEach(() => {
    vi.restoreAllMocks();
});

afterEach(() => {
    vi.restoreAllMocks();
});

describe("useAzureDevOpsBacklog", () => {
    it("não faz fetch quando projectName é vazio (enabled = false)", async () => {
        const wrapper = createWrapper();
        const fetchSpy = vi.spyOn(globalThis, "fetch");

        renderHook(
            () =>
                useAzureDevOpsBacklog({
                    endpoint: "/api/azure-devops/backlog",
                    keyPrefix: "test",
                    projectName: "",
                }),
            { wrapper },
        );

        await waitFor(() => expect(fetchSpy).not.toHaveBeenCalled());
    });

    it("inclui work_item_types na URL quando filtro é fornecido", async () => {
        const wrapper = createWrapper();

        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as unknown as Response);

        const { result } = renderHook(
            () =>
                useAzureDevOpsBacklog({
                    endpoint: "/api/azure-devops/backlog",
                    keyPrefix: "test",
                    projectName: "SME - Sustentação",
                    filters: { workItemTypes: ["BugFix", "HotFix"] },
                }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const calledUrl = fetchSpy.mock.calls[0][0] as string;
        expect(calledUrl).toContain("work_item_types=BugFix%2CHotFix");
    });

    it("inclui iteration_paths na URL quando iterationPaths é fornecido", async () => {
        const wrapper = createWrapper();

        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as unknown as Response);

        const { result } = renderHook(
            () =>
                useAzureDevOpsBacklog({
                    endpoint: "/api/azure-devops/backlog",
                    keyPrefix: "test",
                    projectName: "SME - Sustentação",
                    filters: {
                        workItemTypes: ["BugFix", "HotFix"],
                        iterationPaths: [
                            String.raw`SME - Sustentação\Sprint 014`,
                        ],
                    },
                }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const calledUrl = fetchSpy.mock.calls[0][0] as string;
        const params = new URLSearchParams(calledUrl.split("?")[1]);
        expect(params.get("iteration_paths")).toBe(
            String.raw`SME - Sustentação\Sprint 014`,
        );
    });

    it("não inclui iteration_paths na URL quando iterationPaths é undefined", async () => {
        const wrapper = createWrapper();

        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as unknown as Response);

        const { result } = renderHook(
            () =>
                useAzureDevOpsBacklog({
                    endpoint: "/api/azure-devops/backlog",
                    keyPrefix: "test",
                    projectName: "SME - Sustentação",
                    filters: { workItemTypes: ["BugFix"] },
                }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const calledUrl = fetchSpy.mock.calls[0][0] as string;
        expect(calledUrl).not.toContain("iteration_paths");
    });

    it("não inclui iteration_paths na URL quando iterationPaths é array vazio", async () => {
        const wrapper = createWrapper();

        const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: true,
            json: async () => mockResponse,
        } as unknown as Response);

        const { result } = renderHook(
            () =>
                useAzureDevOpsBacklog({
                    endpoint: "/api/azure-devops/backlog",
                    keyPrefix: "test",
                    projectName: "SME - Sustentação",
                    filters: { iterationPaths: [] },
                }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const calledUrl = fetchSpy.mock.calls[0][0] as string;
        expect(calledUrl).not.toContain("iteration_paths");
    });

    it("retorna erro quando res.ok === false", async () => {
        const wrapper = createWrapper();

        vi.spyOn(globalThis, "fetch").mockResolvedValue({
            ok: false,
            json: async () => ({}),
        } as unknown as Response);

        const { result } = renderHook(
            () =>
                useAzureDevOpsBacklog({
                    endpoint: "/api/azure-devops/backlog",
                    keyPrefix: "test",
                    projectName: "SME - Sustentação",
                }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isError).toBe(true));
        expect((result.current.error as Error).message).toBe(
            "Falha ao buscar backlog",
        );
    });
});
