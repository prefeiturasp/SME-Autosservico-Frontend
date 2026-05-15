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
        const novoSistema = {
            id: "99",
            nome: "Teste",
            zabbixQueryFrontend: "",
            zabbixQueryBackend: "",
            zabbixQueryFilasRabbitMQ: "",
            zabbixQueryJenkinsJob: "",
        };
        sistemas.push(novoSistema);

        const sistemasNovos = getSistemasPorSquad("ASCOM");
        expect(sistemasNovos).not.toContainEqual(novoSistema);
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
        expect(escolhas?.sonarProjectKey).toBeUndefined();
    });

    it("inclui chaves explícitas do SonarQube para projetos mapeados", () => {
        const coped = getSistemasPorSquad("COPED");
        const ascom = getSistemasPorSquad("ASCOM");
        const coplan = getSistemasPorSquad("COPLAN");

        expect(coped.find((s) => s.nome === "Novo SGP")?.sonarProjectKey).toBe("SME-NovoSGP-WebClient");
        expect(coped.find((s) => s.nome === "Cdep")?.sonarProjectKey).toBe("SME-CDEP-FRONTEND");
        expect(coped.find((s) => s.nome === "Curriculo da Cidade")?.sonarProjectKey).toBe(
            "SME-plataforma-curriculo-interface"
        );
        expect(ascom.find((s) => s.nome === "Portal Educação")?.sonarProjectKey).toBe("SME-EDUCACAO");
        expect(coplan.find((s) => s.nome === "SigEscola")?.sonarProjectKey).toBe("SME-PTRF-FrontEnd");
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
