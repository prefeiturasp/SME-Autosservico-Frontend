/* @vitest-environment jsdom */
import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";

vi.mock("@/hooks/useAllowedSquads", () => ({
    useAllowedSquads: vi.fn(),
}));

import { useAllowedSquads } from "@/hooks/useAllowedSquads";
import { useAreasAcesso } from "./useAreasAcesso";

describe("useAreasAcesso", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("retorna [] quando não houver squads permitidas", () => {
        (useAllowedSquads as unknown as Mock).mockReturnValue([]);

        const { result } = renderHook(() => useAreasAcesso());
        expect(result.current).toEqual([]);
    });

    it("mapeia squad conhecida para coordenadoria com áreas e descrição a partir dos sistemas", () => {
        (useAllowedSquads as unknown as Mock).mockReturnValue(["COPED"]);

        const { result } = renderHook(() => useAreasAcesso());

        expect(result.current).toHaveLength(1);
        expect(result.current[0].sigla).toBe("COPED");
        expect(result.current[0].areas).toEqual([
            "Operacional",
            "Analytics",
            "Saúde do deploy",
        ]);
        expect(result.current[0].descricao.length).toBeGreaterThan(0);
    });

    it("normaliza a sigla para maiúsculas ao buscar as áreas", () => {
        (useAllowedSquads as unknown as Mock).mockReturnValue(["coped"]);

        const { result } = renderHook(() => useAreasAcesso());

        expect(result.current).toHaveLength(1);
        expect(result.current[0].sigla).toBe("coped");
        expect(result.current[0].areas).toEqual([
            "Operacional",
            "Analytics",
            "Saúde do deploy",
        ]);
    });

    it("filtra squads sem áreas mapeadas (retornam null)", () => {
        (useAllowedSquads as unknown as Mock).mockReturnValue([
            "SQUAD_INEXISTENTE",
        ]);

        const { result } = renderHook(() => useAreasAcesso());
        expect(result.current).toEqual([]);
    });

    it("usa a própria sigla como descrição quando não houver sistemas mapeados", () => {
        (useAllowedSquads as unknown as Mock).mockReturnValue(["COGEP"]);

        const { result } = renderHook(() => useAreasAcesso());

        expect(result.current).toHaveLength(1);
        expect(result.current[0].sigla).toBe("COGEP");
        expect(typeof result.current[0].descricao).toBe("string");
        expect(result.current[0].descricao.length).toBeGreaterThan(0);
    });

    it("mescla múltiplas squads válidas e ignora as inválidas", () => {
        (useAllowedSquads as unknown as Mock).mockReturnValue([
            "COPED",
            "SQUAD_INEXISTENTE",
            "ASCOM",
        ]);

        const { result } = renderHook(() => useAreasAcesso());

        const siglas = result.current.map((c) => c.sigla);
        expect(siglas).toEqual(["COPED", "ASCOM"]);
    });
});
