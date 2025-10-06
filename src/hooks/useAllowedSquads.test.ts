/* @vitest-environment jsdom */
// src/hooks/useAllowedSquads.test.ts
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

    it('deve retornar [] quando status="loading"', () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: null,
            status: "loading",
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });

    it("deve retornar um array vazio quando não houver sessão", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: null,
            status: "unauthenticated",
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });

    it("deve retornar [] quando existir sessão mas user estiver ausente", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: { user: undefined },
            status: "authenticated",
        });

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
            status: "authenticated",
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
            status: "authenticated",
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual(["COPED", "COPLAN"]);
    });

    it("deve remover perfis duplicados (no mesmo item)", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: {
                user: {
                    name: "Teste",
                    perfis_por_sistema: [
                        { sistema: 1008, perfis: ["COPED", "COPED", "COTIC"] },
                    ],
                },
            },
            status: "authenticated",
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual(["COPED", "COTIC"]);
    });

    it("deve mesclar e deduplicar perfis vindos de múltiplos itens do sistema 1008", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: {
                user: {
                    name: "Teste",
                    perfis_por_sistema: [
                        { sistema: 1008, perfis: ["COPED", "COPLAN"] },
                        { sistema: 1008, perfis: ["COPLAN", "COTIC"] }, // duplicado "COPLAN"
                        { sistema: 903, perfis: ["UE"] },
                    ],
                },
            },
            status: "authenticated",
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual(["COPED", "COPLAN", "COTIC"]);
    });

    it("deve retornar um array vazio quando perfis_por_sistema não contiver sistema 1008", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: {
                user: {
                    name: "Teste",
                    perfis_por_sistema: [{ sistema: 903, perfis: ["UE", "SME"] }],
                },
            },
            status: "authenticated",
        });

        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });
});


describe("useAllowedSquads (v2)", () => {
    const OLD_ENV = { ...process.env };
    beforeEach(() => {
        vi.clearAllMocks();
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v2";
    });
    afterAll(() => {
        process.env = { ...OLD_ENV };
    });

    it("deve retornar [] quando groups está ausente (v2)", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: { user: { name: "Teste" } },
            status: "authenticated",
        });
        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });

    it("deve retornar groups quando presentes (v2)", async () => {
        vi.resetModules();
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v2";
        // Precisa importar o hook depois de setar a env!
        const { useAllowedSquads } = await import("./useAllowedSquads");
        (useSession as unknown as Mock).mockReturnValue({
            data: { user: { name: "Teste", groups: ["G1", "G2"] } },
            status: "authenticated",
        });
        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual(["G1", "G2"]);
    });

    it("deve retornar [] quando groups existe mas não é array (v2)", () => {
        (useSession as unknown as Mock).mockReturnValue({
            data: { user: { name: "Teste", groups: "G1" } },
            status: "authenticated",
        });
        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });

    it("deve retornar [] quando groups existe mas não é array (v2)", async () => {
        vi.resetModules();
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v2";
        const { useAllowedSquads } = await import("./useAllowedSquads");
        (useSession as unknown as Mock).mockReturnValue({
            data: { user: { name: "Teste", groups: "G1" } },
            status: "authenticated",
        });
        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });

    it("deve retornar [] quando groups é null (v2)", async () => {
        vi.resetModules();
        process.env.NEXT_PUBLIC_AUTH_VERSION = "v2";
        const { useAllowedSquads } = await import("./useAllowedSquads");
        (useSession as unknown as Mock).mockReturnValue({
            data: { user: { name: "Teste", groups: null } },
            status: "authenticated",
        });
        const { result } = renderHook(() => useAllowedSquads());
        expect(result.current).toEqual([]);
    });
});
