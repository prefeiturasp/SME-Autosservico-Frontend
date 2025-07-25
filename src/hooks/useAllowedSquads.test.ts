import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { useAllowedSquads } from "./useAllowedSquads";

// ✅ Mock do useSession do NextAuth
vi.mock("next-auth/react", () => ({
    __esModule: true,
    useSession: vi.fn(),
}));

import { useSession } from "next-auth/react";

describe("useAllowedSquads", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("deve retornar um array vazio quando não houver sessão", () => {
        (useSession as unknown as Mock).mockReturnValue({ data: null });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });

    it("deve retornar um array vazio quando não houver perfis_por_sistema", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: {
                user: {
                    name: "Teste",
                    perfis_por_sistema: undefined,
                },
            },
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });

    it("deve retornar apenas os perfis do sistema 1008", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: {
                user: {
                    name: "Teste",
                    perfis_por_sistema: [
                        { sistema: 1008, perfis: ["COPED", "COPLAN"] },
                        { sistema: 903, perfis: ["UE", "SME"] },
                    ],
                },
            },
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual(["COPED", "COPLAN"]);
    });

    it("deve remover perfis duplicados", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: {
                user: {
                    name: "Teste",
                    perfis_por_sistema: [
                        { sistema: 1008, perfis: ["COPED", "COPED", "COTIC"] },
                    ],
                },
            },
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual(["COPED", "COTIC"]);
    });

    it("deve retornar um array vazio quando perfis_por_sistema não contiver sistema 1008", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: {
                user: {
                    name: "Teste",
                    perfis_por_sistema: [
                        { sistema: 903, perfis: ["UE", "SME"] },
                    ],
                },
            },
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });
});
