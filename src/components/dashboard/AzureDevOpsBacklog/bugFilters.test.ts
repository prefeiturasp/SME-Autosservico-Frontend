import type { WorkItem } from "@/types/backlog";
import { describe, expect, it } from "vitest";
import {
    extractTitleIdentifiers,
    getProjectIdentifiers,
    identifiersMatch,
    matchesBugToProject,
    normalizeText,
    parseTags,
    PROJECT_IDENTIFIERS,
} from "./bugFilters";

describe("bugFilters", () => {
    describe("normalizeText", () => {
        it("converte para maiúsculas", () => {
            expect(normalizeText("texto")).toBe("TEXTO");
        });

        it("remove acentos", () => {
            expect(normalizeText("Conexão")).toBe("CONEXAO");
            expect(normalizeText("Rolê Agroecológico")).toBe(
                "ROLE AGROECOLOGICO",
            );
        });

        it("remove espaços extras", () => {
            expect(normalizeText("  texto  ")).toBe("TEXTO");
        });

        it("lida com string vazia", () => {
            expect(normalizeText("")).toBe("");
        });
    });

    describe("getProjectIdentifiers", () => {
        it("retorna identificadores mapeados para projetos conhecidos", () => {
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(identifiers).toContain("SGP");
            expect(identifiers).toContain("NOVO SGP");
        });

        it("gera identificadores para projetos não mapeados", () => {
            const identifiers = getProjectIdentifiers("Projeto Novo");
            expect(identifiers).toContain("PROJETO NOVO");
            expect(identifiers).toContain("PROJETONOVO");
            expect(identifiers).toContain("PROJETO-NOVO");
        });

        it("retorna identificadores corretos para SigPAE", () => {
            const identifiers = getProjectIdentifiers("SigPAE");
            expect(identifiers).toContain("SIGPAE");
        });
    });

    describe("parseTags", () => {
        it("retorna array vazio para tags nulas", () => {
            expect(parseTags(null)).toEqual([]);
            expect(parseTags(undefined)).toEqual([]);
        });

        it("retorna array vazio para string vazia", () => {
            expect(parseTags("")).toEqual([]);
        });

        it("parseia tags separadas por ponto e vírgula", () => {
            const tags = parseTags("SGP; Frontend; Backend");
            expect(tags).toContain("SGP");
            expect(tags).toContain("FRONTEND");
            expect(tags).toContain("BACKEND");
        });

        it("parseia tags separadas por vírgula", () => {
            const tags = parseTags("SGP, Frontend, Backend");
            expect(tags).toContain("SGP");
            expect(tags).toContain("FRONTEND");
            expect(tags).toContain("BACKEND");
        });

        it("parseia tags mistas (vírgula e ponto e vírgula)", () => {
            const tags = parseTags("SGP; Frontend, Backend");
            expect(tags).toHaveLength(3);
        });

        it("normaliza tags (remove acentos e converte para maiúsculas)", () => {
            const tags = parseTags("Conexão; Formação");
            expect(tags).toContain("CONEXAO");
            expect(tags).toContain("FORMACAO");
        });
    });

    describe("extractTitleIdentifiers", () => {
        it("retorna array vazio para título vazio", () => {
            expect(extractTitleIdentifiers("")).toEqual([]);
        });

        it("extrai identificadores entre colchetes", () => {
            const identifiers = extractTitleIdentifiers(
                "[SGP] Não aparece os semestres",
            );
            expect(identifiers).toContain("SGP");
        });

        it("extrai múltiplos identificadores entre colchetes", () => {
            const identifiers = extractTitleIdentifiers(
                "[SGP] [Frontend] Erro no login",
            );
            expect(identifiers).toContain("SGP");
            expect(identifiers).toContain("FRONTEND");
        });

        it("extrai identificador antes de hífen", () => {
            const identifiers = extractTitleIdentifiers(
                "SGP - Erro no cadastro",
            );
            expect(identifiers).toContain("SGP");
        });

        it("extrai identificador antes de dois pontos", () => {
            const identifiers = extractTitleIdentifiers(
                "SIGPAE: Problema no relatório",
            );
            expect(identifiers).toContain("SIGPAE");
        });

        it("normaliza identificadores extraídos", () => {
            const identifiers = extractTitleIdentifiers("[Conexão] Erro");
            expect(identifiers).toContain("CONEXAO");
        });
    });

    describe("identifiersMatch", () => {
        it("retorna true para identificadores iguais", () => {
            expect(identifiersMatch("SGP", "SGP")).toBe(true);
        });

        it("retorna true quando um contém o outro", () => {
            expect(identifiersMatch("SGP", "NOVO SGP")).toBe(true);
            expect(identifiersMatch("NOVO SGP", "SGP")).toBe(true);
        });

        it("ignora hífens na comparação", () => {
            expect(identifiersMatch("NOVO-SGP", "NOVOSGP")).toBe(true);
        });

        it("ignora espaços na comparação", () => {
            expect(identifiersMatch("NOVO SGP", "NOVOSGP")).toBe(true);
        });

        it("retorna false para identificadores diferentes", () => {
            expect(identifiersMatch("SGP", "SIGPAE")).toBe(false);
        });

        it("faz match quando versão limpa (sem hífens) de um contém o outro", () => {
            expect(identifiersMatch("NOVO-SGP", "NOVOSGP-EXTRA")).toBe(true);
        });
    });

    describe("matchesBugToProject", () => {
        const createBug = (overrides: Partial<WorkItem> = {}): WorkItem => ({
            id: 1,
            title: "Bug de teste",
            ...overrides,
        });

        it("retorna true para bug sem tags e sem identificador no título (aparece em todos os projetos)", () => {
            const bug = createBug({
                title: "Bug genérico sem identificador",
                tags: undefined,
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("faz match por tag", () => {
            const bug = createBug({ title: "Erro no login", tags: "SGP" });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("faz match por título com colchetes", () => {
            const bug = createBug({
                title: "[SGP] Não aparece os semestres",
                tags: undefined,
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("faz match por título com hífen", () => {
            const bug = createBug({
                title: "SGP - Erro no calendário",
                tags: undefined,
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("faz match com tags separadas por ponto e vírgula", () => {
            const bug = createBug({
                title: "Erro qualquer",
                tags: "Frontend; SGP; Backend",
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("faz match com tags separadas por vírgula", () => {
            const bug = createBug({
                title: "Erro qualquer",
                tags: "Frontend, SGP, Backend",
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("não faz match quando projeto é diferente", () => {
            const bug = createBug({
                title: "[SIGPAE] Erro no relatório",
                tags: "SIGPAE",
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(false);
        });

        it("faz match para bug real do exemplo", () => {
            const bug: WorkItem = {
                id: 141061,
                title: "[SGP] Não aparece os semestres no calendário",
                state: "Testing",
                work_item_type: "BugFix",
                tags: "SGP",
                created_by: "Marlon Goncalves",
                assigned_to: "Max Fernandes de Souza",
                area_path: "SME - Sustentação",
                team_project: "SME - Sustentação",
                iteration_path: String.raw`SME - Sustentação\Ciclo 006 - Sustentação -`,
            };
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("faz match para SigPAE", () => {
            const bug = createBug({
                title: "[SIGPAE] Erro no cadastro",
                tags: "SIGPAE",
            });
            const identifiers = getProjectIdentifiers("SigPAE");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("faz match para Conecta Formação com variações", () => {
            const bug1 = createBug({
                title: "[CONECTA FORMACAO] Erro",
                tags: undefined,
            });
            const bug2 = createBug({ title: "Erro", tags: "CONECTAFORMACAO" });
            const identifiers = getProjectIdentifiers("Conecta Formação");
            expect(matchesBugToProject(bug1, identifiers)).toBe(true);
            expect(matchesBugToProject(bug2, identifiers)).toBe(true);
        });

        it("faz match para projeto não mapeado usando fallback", () => {
            const bug = createBug({
                title: "[NOVO PROJETO] Erro",
                tags: undefined,
            });
            const identifiers = getProjectIdentifiers("Novo Projeto");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("faz match via versão limpa (sem hífens/espaços) do identificador e do texto", () => {
            const bug = createBug({ title: "PortalCEU bug", tags: undefined });
            const identifiers = getProjectIdentifiers("Portal CEU");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("retorna true para bug sem título e sem tags", () => {
            const bug = { id: 1 } as WorkItem;
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });

        it("não faz match quando título tem [Portal SME] mas projeto é Novo SGP", () => {
            const bug = createBug({
                title: "[Portal SME | Acervo] Capa de documento não exibida",
                tags: undefined,
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(false);
        });

        it("não faz match quando título tem [Intranet] mas projeto é Novo SGP", () => {
            const bug = createBug({
                title: "[Intranet] Seção de comentários exibe texto errado",
                tags: undefined,
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(false);
        });

        it("bug com título genérico sem identificadores ainda aparece em todos os projetos", () => {
            const bug = createBug({
                title: "Sistema de login muito lento",
                tags: undefined,
            });
            const identifiers = getProjectIdentifiers("Novo SGP");
            expect(matchesBugToProject(bug, identifiers)).toBe(true);
        });
    });

    describe("PROJECT_IDENTIFIERS", () => {
        it("contém todos os projetos esperados", () => {
            const expectedProjects = [
                "Portal Educação",
                "Portal CEU",
                "Plateia",
                "Novo SGP",
                "SigPAE",
                "Serap",
                "Conecta Formação",
                "SigEscola",
                "GIPE",
            ];

            for (const project of expectedProjects) {
                expect(PROJECT_IDENTIFIERS[project]).toBeDefined();
                expect(PROJECT_IDENTIFIERS[project].length).toBeGreaterThan(0);
            }
        });
    });
});
