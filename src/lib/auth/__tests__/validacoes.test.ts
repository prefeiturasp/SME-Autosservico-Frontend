import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { temPermissaoDeAcesso, temPermissaoDeAcessoV2 } from "../validacoes";

describe("temPermissaoDeAcessoV2", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = { ...OLD_ENV };
        process.env.NEXT_PUBLIC_SQUADS_VALIDAS = "ASCOM,COGEP,CODAE,COPED,COPLAN,COTIC,GIPE";
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    it("retorna true se grupo do usuário está em grupos válidos", () => {
        expect(temPermissaoDeAcessoV2(["COPED"]))
            .toBe(true);
    });

    it("retorna false se grupo do usuário não está em grupos válidos", () => {
        expect(temPermissaoDeAcessoV2(["INEXISTENTE"]))
            .toBe(false);
    });

    it("retorna false se grupos for vazio", () => {
        expect(temPermissaoDeAcessoV2([])).toBe(false);
    });

    it("retorna false se grupos for undefined", () => {
        expect(temPermissaoDeAcessoV2(undefined as unknown as string[])).toBe(false);
    });

    it("retorna false se env de grupos válidos estiver ausente", () => {
        delete process.env.NEXT_PUBLIC_SQUADS_VALIDAS;
        expect(temPermissaoDeAcessoV2(["COPED"]))
            .toBe(false);
    });

    it("aceita grupos com letras minúsculas e mistura de maiúsculas", () => {
        expect(temPermissaoDeAcessoV2(["coped"]))
            .toBe(true);
        expect(temPermissaoDeAcessoV2(["CoPeD"]))
            .toBe(true);
    });

    it("retorna true se pelo menos um grupo for válido entre vários", () => {
        expect(temPermissaoDeAcessoV2(["INEXISTENTE", "COPED"]))
            .toBe(true);
    });

    it("retorna false se todos os grupos forem inválidos", () => {
        expect(temPermissaoDeAcessoV2(["X", "Y"]))
            .toBe(false);
    });

    it("usa gruposValidosEnv customizado se passado", () => {
        expect(temPermissaoDeAcessoV2(["GRUPO1"], "GRUPO1,GRUPO2")).toBe(true);
        expect(temPermissaoDeAcessoV2(["GRUPO3"], "GRUPO1,GRUPO2")).toBe(false);
    });

    it("faz log dos grupos e grupos válidos", () => {
        const logSpy = vi.spyOn(console, "log");
        temPermissaoDeAcessoV2(["COPED"]);
        expect(logSpy).toHaveBeenCalledWith("Grupos do usuário:", ["COPED"]);
        expect(logSpy).toHaveBeenCalledWith(
            "Grupos válidos:",
            ["ASCOM", "COGEP", "CODAE", "COPED", "COPLAN", "COTIC", "GIPE"]
        );
        logSpy.mockRestore();
    });

    it("faz warn se env ausente", () => {
        const warnSpy = vi.spyOn(console, "warn");
        delete process.env.NEXT_PUBLIC_SQUADS_VALIDAS;
        temPermissaoDeAcessoV2(["COPED"]);
        expect(warnSpy).toHaveBeenCalledWith(
            "Variável de ambiente NEXT_PUBLIC_SQUADS_VALIDAS não configurada."
        );
        warnSpy.mockRestore();
    });
});

describe("temPermissaoDeAcesso", () => {
    const OLD_ENV = process.env;

    beforeEach(() => {
        process.env = { ...OLD_ENV };
        process.env.NEXT_PUBLIC_SISTEMA_AUTOSERVICO = "1008";
        process.env.NEXT_PUBLIC_SQUADS_VALIDAS = "ASCOM,COGEP,CODAE,COPED,COPLAN,COTIC,GIPE";
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    it("retorna true quando o sistema e uma Squad válida estão presentes", () => {
        const entrada = [
            {
                sistema: 1008,
                perfis: ["COPED", "OutroPerfil"],
            },
        ];
        expect(temPermissaoDeAcesso(entrada)).toBe(true);
    });

    it("retorna false se o sistema estiver errado", () => {
        const entrada = [
            {
                sistema: 207,
                perfis: ["COPED"],
            },
        ];
        expect(temPermissaoDeAcesso(entrada)).toBe(false);
    });

    it("retorna false se não houver nenhuma Squad válida", () => {
        const entrada = [
            {
                sistema: 1008,
                perfis: ["OutroPerfil"],
            },
        ];
        expect(temPermissaoDeAcesso(entrada)).toBe(false);
    });

    it("retorna false se perfisPorSistema for undefined", () => {
        const entradaInvalida = undefined as unknown as { sistema: number; perfis: string[] }[];
        expect(temPermissaoDeAcesso(entradaInvalida)).toBe(undefined);
    });

    it("retorna false se variáveis de ambiente estiverem ausentes", () => {
        delete process.env.NEXT_PUBLIC_SISTEMA_AUTOSERVICO;
        delete process.env.NEXT_PUBLIC_SQUADS_VALIDAS;

        const entrada = [
            {
                sistema: 1008,
                perfis: ["COPED"],
            },
        ];
        expect(temPermissaoDeAcesso(entrada)).toBe(false);
    });

    it("aceita perfis com letras minúsculas e mistura de maiúsculas", () => {
        const entrada = [
            {
                sistema: 1008,
                perfis: ["coped"],
            },
        ];
        expect(temPermissaoDeAcesso(entrada)).toBe(true);
    });
});
