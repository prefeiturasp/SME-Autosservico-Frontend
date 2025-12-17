import { describe, it, expect } from "vitest";
import { getSistemasPorSquad } from "./getSistemasPorSquad";

describe("getSistemasPorSquad", () => {
    it("deve retornar os sistemas corretos para um squad existente", () => {
        const sistemas = getSistemasPorSquad("COPED");

        expect(sistemas).toBeInstanceOf(Array);
        expect(sistemas.length).toBeGreaterThan(0);

        // ✅ Verifica o primeiro item como exemplo
        expect(sistemas[0]).toMatchObject({
            id: "10",
            nome: "Novo SGP",
        });

        // ✅ Verifica se contém todos os sistemas esperados
        const nomes = sistemas.map((s) => s.nome);
        expect(nomes).toContain("Serap");
        expect(nomes).toContain("Curriculo da Cidade");
    });

    it("deve retornar um array vazio para um squad inexistente", () => {
        const sistemas = getSistemasPorSquad("SQUAD_INEXISTENTE");

        expect(sistemas).toEqual([]);
    });

    it("deve retornar um array vazio quando o nome do squad for vazio", () => {
        const sistemas = getSistemasPorSquad("");
        expect(sistemas).toEqual([]);
    });

    it("não deve mutar o array original dos squads", () => {
        const sistemas = getSistemasPorSquad("ASCOM");
        sistemas.push({ id: "99", nome: "Teste" });

        // ✅ Chamada subsequente não deve conter o item mutado
        const sistemasNovos = getSistemasPorSquad("ASCOM");
        expect(sistemasNovos).not.toContainEqual({ id: "99", nome: "Teste" });
    });

    it("inclui subprojetos de releases quando existir mapeamento", () => {
        const sistemas = getSistemasPorSquad("COPLAN");
        const sigEscola = sistemas.find((s) => s.nome === "SigEscola");
        expect(sigEscola?.jenkinsSubprojects).toEqual([
            { label: "PTRF-BackEnd", key: "PTRF-BackEnd" },
            { label: "PTRF-FrontEnd", key: "PTRF-FrontEnd" },
        ]);
    });

    it("quando não houver mapeamento (N/E), retorna subprojetos vazios", () => {
        const sistemas = getSistemasPorSquad("ASCOM");
        const portal = sistemas.find((s) => s.nome === "Portal Educação");
        expect(portal?.jenkinsSubprojects).toEqual([]);
    });
});
