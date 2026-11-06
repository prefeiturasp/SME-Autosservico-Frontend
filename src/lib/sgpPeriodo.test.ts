import {
  codificarPeriodoSgp,
  decodificarPeriodoSgp,
  periodoCorrente,
  periodoPadraoSgp,
  rotuloPeriodoSgp,
} from "./sgpPeriodo";
import type { PeriodoSgpOption } from "@/types/sgpMetricas";

const EJA = { anoLetivo: 2026, segmento: "eja", semestre: 2, bimestre: 1 } as const;
const FUND = {
  anoLetivo: 2026,
  segmento: "fundamental_medio",
  semestre: null,
  bimestre: 4,
} as const;

describe("sgpPeriodo", () => {
  it("codifica e decodifica o filtro do seletor", () => {
    expect(codificarPeriodoSgp(EJA)).toBe("eja:2026:2:1");
    expect(codificarPeriodoSgp(FUND)).toBe("fundamental_medio:2026:0:4");
    expect(decodificarPeriodoSgp("eja:2026:2:1")).toEqual(EJA);
    expect(decodificarPeriodoSgp("fundamental_medio:2026:0:4")).toEqual(FUND);
  });

  it.each([
    "infantil:2026:0:1",
    "eja:2026:2:3",
    "eja:2026:3:1",
    "fundamental_medio:2026:0:5",
    "fundamental_medio:abc:0:1",
  ])("rejeita valores inválidos (%s)", (valor) => {
    expect(decodificarPeriodoSgp(valor)).toBeUndefined();
  });

  it("monta os rótulos do protótipo", () => {
    expect(rotuloPeriodoSgp(FUND)).toBe("4º Bimestre de 2026");
    expect(rotuloPeriodoSgp(EJA)).toBe("EJA - 1º Bim. do 2º Sem. 2026");
  });

  it("resolve o bimestre corrente pelo mês", () => {
    expect(periodoCorrente(new Date(2026, 10, 3))).toEqual({
      anoLetivo: 2026,
      bimestre: 4,
    });
  });

  it("usa como padrão o último bimestre de Fundamental/Médio", () => {
    const opcoes: PeriodoSgpOption[] = [
      { value: "fundamental_medio:2026:0:3", label: "", segmento: "fundamental_medio" },
      { value: "fundamental_medio:2026:0:4", label: "", segmento: "fundamental_medio" },
      { value: "eja:2026:2:2", label: "", segmento: "eja" },
    ];

    expect(periodoPadraoSgp(opcoes)).toBe("fundamental_medio:2026:0:4");
  });

  it("sem opções, cai no bimestre corrente de Fundamental/Médio", () => {
    expect(periodoPadraoSgp([], new Date(2026, 4, 10))).toBe(
      "fundamental_medio:2026:0:2",
    );
  });
});
