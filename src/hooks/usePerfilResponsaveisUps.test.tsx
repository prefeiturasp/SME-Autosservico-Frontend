import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { usePerfilResponsaveisUps } from "./usePerfilResponsaveisUps";

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

beforeEach(() => {
    vi.restoreAllMocks();
});

describe("usePerfilResponsaveisUps", () => {
    it("não dispara fetch quando systemName é vazio", async () => {
        const wrapper = createWrapper();
        const { result } = renderHook(
            () => usePerfilResponsaveisUps({ systemName: "" }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isFetching).toBe(false));
        expect(result.current.data).toBeUndefined();
    });

    it("retorna os 4 blocos de perfil mockados, com o bloco de Raça corrigido", async () => {
        const wrapper = createWrapper();
        const { result } = renderHook(
            () =>
                usePerfilResponsaveisUps({ systemName: "Rolê Agroecológico" }),
            { wrapper },
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        const titles = result.current.data?.map((block) => block.title);
        expect(titles).toEqual([
            "Gênero",
            "Faixa etária",
            "Raça",
            "Nacionalidade",
        ]);

        const racaCor = result.current.data?.find(
            (block) => block.title === "Raça",
        );
        expect(racaCor?.rows).toEqual([
            { label: "Branca", value: 20 },
            { label: "Preta", value: 24 },
            { label: "Parda", value: 14 },
            { label: "Amarela", value: 3 },
            { label: "Indígena", value: 2 },
        ]);
    });
});
