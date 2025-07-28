import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { temPermissaoDeAcesso } from "../validacoes";

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
