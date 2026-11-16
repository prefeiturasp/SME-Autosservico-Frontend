import {
  formatarDuracao,
  formatarInicioFila,
  resumirControleAcessos,
} from "./sgpControleAcessos";
import type { ControleAcessosSgpResponse } from "@/types/sgpControleAcessos";

const estado = (
  parcial: Partial<ControleAcessosSgpResponse> = {},
): ControleAcessosSgpResponse => ({
  atualizadoEm: "2026-11-10T09:30:00-03:00",
  limiteConexoes: 5000,
  conectados: 1346,
  emFila: 0,
  filaIniciadaEm: null,
  tempoEspera: {
    mediaSegundos: null,
    posicaoMedia: null,
    testes: 0,
    atingiuLimiteTeste: false,
  },
  ...parcial,
});

describe("formatarDuracao", () => {
  it.each([
    [0.122, "122 ms"],
    [45.4, "45 s"],
    [152.3, "2 min 32 s"],
    [600, "10 min"],
  ])("%s s vira %s", (segundos, esperado) => {
    expect(formatarDuracao(segundos)).toBe(esperado);
  });
});

describe("formatarInicioFila", () => {
  it("formata hora e data no fuso de São Paulo", () => {
    expect(formatarInicioFila("2026-11-10T10:41:00Z")).toBe("07:41 - 10/11/2026");
  });
});

describe("resumirControleAcessos", () => {
  it("sem dados do BFF (cache frio), não resume", () => {
    expect(resumirControleAcessos(estado({ limiteConexoes: null }))).toBeUndefined();
  });

  it("abaixo de 90% do limite: verde, conexões disponíveis", () => {
    const resumo = resumirControleAcessos(estado())!;

    expect(resumo.limite).toMatchObject({
      valor: "5.000",
      badge: "73,08% de conexões disponíveis",
      tomBadge: "success",
    });
    expect(resumo.conectados).toMatchObject({
      valor: "1.346",
      detalhe: "(26,92%)",
      tom: "success",
      badge: "Restam 3.654 conexões",
      tomBadge: "muted",
    });
    expect(resumo.fila).toMatchObject({
      valor: "0",
      badge: "Sem acionamento de fila",
      tomBadge: "muted",
    });
    expect(resumo.tempoEspera).toMatchObject({
      valor: "0 ms",
      badge: "Sem acionamento de fila",
    });
  });

  it("de 90% até o limite: amarelo, perto do acionamento da fila", () => {
    const resumo = resumirControleAcessos(estado({ conectados: 4980 }))!;

    expect(resumo.limite).toMatchObject({
      badge: "0,40% para o acionamento da fila",
      tomBadge: "warning",
    });
    expect(resumo.conectados).toMatchObject({
      detalhe: "(99,60%)",
      tom: "warning",
      badge: "Restam 20 conexões",
      tomBadge: "warning",
    });
  });

  it("com fila: vermelho, início da fila e tempo estimado", () => {
    const resumo = resumirControleAcessos(
      estado({
        conectados: 6467,
        emFila: 1467,
        filaIniciadaEm: "2026-11-10T07:41:00-03:00",
        tempoEspera: {
          mediaSegundos: 152.3,
          posicaoMedia: 8,
          testes: 6,
          atingiuLimiteTeste: false,
        },
      }),
    )!;

    expect(resumo.limite).toMatchObject({
      badge: "Fila de acessos ativa",
      tomBadge: "danger",
    });
    expect(resumo.conectados).toMatchObject({
      detalhe: "(129,34%)",
      tom: "danger",
      badge: "Não restam conexões",
    });
    expect(resumo.fila).toMatchObject({
      valor: "1.467",
      tom: "danger",
      badge: "Fila iniciou: 07:41 - 10/11/2026",
    });
    expect(resumo.tempoEspera).toMatchObject({
      valor: "2 min 32 s",
      tom: "danger",
      badge: "Posição média até o acesso: 8º",
    });
  });

  it("limite atingido sem fila e sem início conhecido", () => {
    const resumo = resumirControleAcessos(
      estado({ conectados: 5000, tempoEspera: null }),
    )!;

    expect(resumo.conectados).toMatchObject({
      detalhe: "(100,00%)",
      tom: "danger",
      badge: "Não restam conexões",
    });
    expect(resumo.tempoEspera.valor).toBe("0 ms");
  });

  it("fila ativa sem o horário de início", () => {
    const resumo = resumirControleAcessos(estado({ emFila: 3 }))!;

    expect(resumo.fila.badge).toBe("Fila de acessos ativa");
  });
});
