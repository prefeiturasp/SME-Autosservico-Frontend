import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePeakHours } from "./usePeakHours";

const createWrapper = () => {
    const Wrapper = ({ children }: { readonly children: React.ReactNode }) => {
        const client = new QueryClient({
            defaultOptions: {
                queries: { retry: false, gcTime: Infinity },
            },
        });
        return (
            <QueryClientProvider client={client}>
                {children}
            </QueryClientProvider>
        );
    };
    Wrapper.displayName = "QueryClientTestWrapper";
    return Wrapper;
};

beforeEach(() => {
    vi.restoreAllMocks();
});

describe("usePeakHours", () => {
    it("não dispara fetch quando systemName é vazio", async () => {
        const wrapper = createWrapper();

        const { result } = renderHook(() => usePeakHours({ systemName: "" }), {
            wrapper,
        });

        await waitFor(() => expect(result.current.isFetching).toBe(false));
        expect(result.current.data).toBeUndefined();
    });

    it("retorna dados mock e propaga o systemName", async () => {
        const wrapper = createWrapper();

        const { result } = renderHook(
            () => usePeakHours({ systemName: "SigPAE" }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true), {
            timeout: 2000,
        });

        expect(result.current.data).toMatchObject({
            system: "SigPAE",
            peakHour: expect.any(String),
            data: expect.any(Array),
        });
        expect(result.current.data?.data.length).toBe(24);
    });
});
