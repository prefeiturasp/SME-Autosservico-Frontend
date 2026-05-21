// @vitest-environment jsdom
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { act, render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AnalyticsAutoRefreshIndicator from "./AnalyticsAutoRefreshIndicator";

const createWrapper = () => {
    const Wrapper = ({ children }: { readonly children: React.ReactNode }) => {
        const client = new QueryClient({
            defaultOptions: { queries: { retry: false, gcTime: Infinity } },
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

describe("AnalyticsAutoRefreshIndicator", () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it("exibe o contador inicial em segundos quando menor que 60", () => {
        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <AnalyticsAutoRefreshIndicator intervalSeconds={45} />
            </Wrapper>,
        );

        expect(screen.getByText("45s")).toBeInTheDocument();
    });

    it("exibe o contador inicial em minutos e segundos quando 60 ou mais", () => {
        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <AnalyticsAutoRefreshIndicator intervalSeconds={90} />
            </Wrapper>,
        );

        expect(screen.getByText("1m 30s")).toBeInTheDocument();
    });

    it("formata minutos com segundos zerados preenchidos", () => {
        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <AnalyticsAutoRefreshIndicator intervalSeconds={60} />
            </Wrapper>,
        );

        expect(screen.getByText("1m 00s")).toBeInTheDocument();
    });

    it("decrementa o contador a cada segundo", async () => {
        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <AnalyticsAutoRefreshIndicator intervalSeconds={10} />
            </Wrapper>,
        );

        await act(async () => {
            vi.advanceTimersByTime(3000);
        });

        expect(screen.getByText("7s")).toBeInTheDocument();
    });

    it("invalida as queries analíticas e reinicia o contador ao chegar a zero", async () => {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });
        const invalidateSpy = vi.spyOn(queryClient, "invalidateQueries");

        render(
            <QueryClientProvider client={queryClient}>
                <AnalyticsAutoRefreshIndicator intervalSeconds={3} />
            </QueryClientProvider>,
        );

        await act(async () => {
            vi.advanceTimersByTime(3000);
        });

        expect(invalidateSpy).toHaveBeenCalledTimes(6);
        expect(screen.getByText("3s")).toBeInTheDocument();
    });

    it("reinicia o contador quando intervalSeconds muda", async () => {
        const Wrapper = createWrapper();
        const { rerender } = render(
            <Wrapper>
                <AnalyticsAutoRefreshIndicator intervalSeconds={30} />
            </Wrapper>,
        );

        await act(async () => {
            vi.advanceTimersByTime(5000);
        });

        const NewWrapper = createWrapper();
        rerender(
            <NewWrapper>
                <AnalyticsAutoRefreshIndicator intervalSeconds={10} />
            </NewWrapper>,
        );

        expect(screen.getByText("10s")).toBeInTheDocument();
    });

    it("exibe o texto 'Atualiza em' no output acessível", () => {
        const Wrapper = createWrapper();
        render(
            <Wrapper>
                <AnalyticsAutoRefreshIndicator intervalSeconds={5} />
            </Wrapper>,
        );

        expect(screen.getByRole("status")).toBeInTheDocument();
        expect(screen.getByText(/Atualiza em/)).toBeInTheDocument();
    });
});
