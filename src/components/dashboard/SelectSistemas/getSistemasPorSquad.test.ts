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
        const sistemas = getSistemasPorSquad("COGEP");
        const escolhas = sistemas.find((s) => s.nome === "Escolhas");
        expect(escolhas?.jenkinsSubprojects).toEqual([]);
    });

    it("inclui subprojeto para Portal Educação (php-fpm-prod)", () => {
        const sistemas = getSistemasPorSquad("ASCOM");
        const portal = sistemas.find((s) => s.nome === "Portal Educação");
        expect(portal?.jenkinsSubprojects).toEqual([{ label: "EDUCACAO", key: "EDUCACAO/php-fpm-prod" }]);
    });

    it("inclui subprojeto para Intranet (php-fpm-prod)", () => {
        const sistemas = getSistemasPorSquad("ASCOM");
        const intranet = sistemas.find((s) => s.nome === "Intranet");
        expect(intranet?.jenkinsSubprojects).toEqual([{ label: "INTRANET", key: "INTRANET/php-fpm-prod" }]);
    });

    it("inclui subprojeto para Portal CEU (php-fpm-prod)", () => {
        const sistemas = getSistemasPorSquad("ASCOM");
        const portal = sistemas.find((s) => s.nome === "Portal CEU");
        expect(portal?.jenkinsSubprojects).toEqual([{ label: "CEU", key: "CEU/php-fpm-prod" }]);
    });

    it("inclui subprojeto para Rolê Agroecológico (main)", () => {
        const sistemas = getSistemasPorSquad("CODAE");
        const role = sistemas.find((s) => s.nome === "Rolê Agroecológico");
        expect(role?.jenkinsSubprojects).toEqual([{ label: "ROLE-AGROECOLOGICO", key: "ROLE-AGROECOLOGICO/main" }]);
    });

    it("inclui subprojeto para Autosserviço", () => {
        const sistemas = getSistemasPorSquad("COTIC");
        const autosservico = sistemas.find((s) => s.nome === "Autosserviço");
        expect(autosservico?.jenkinsSubprojects).toEqual([
            { label: "SME-Autosservico-Frontend", key: "SME-Autosservico-Frontend" },
        ]);
    });

    it("inclui lista de projetos para GIPE", () => {
        const sistemas = getSistemasPorSquad("GIPE");
        const gipe = sistemas.find((s) => s.nome === "GIPE");
        expect(gipe?.jenkinsSubprojects?.length).toBeGreaterThan(1);
        expect(gipe?.jenkinsSubprojects).toEqual(
            expect.arrayContaining([
                { label: "GIPE-Backend", key: "GIPE-Backend" },
                { label: "GIPE-Frontend", key: "GIPE-Frontend" },
            ])
        );
    });
});
