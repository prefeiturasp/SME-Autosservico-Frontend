import { describe, it, expect } from "vitest";
import {
  bugsHelper,
  codeSmellsHelper,
  coverageHelper,
  duplicationHelper,
  securityHotspotsHelper,
  vulnerabilitiesHelper,
} from "./helperTexts";

describe("bugsHelper", () => {
  it("retorna 'Sem problemas encontrados' quando 0", () => {
    expect(bugsHelper(0, "A")).toBe("Sem problemas encontrados");
  });

  it("retorna 'Dentro do limite' para ratings A/B", () => {
    expect(bugsHelper(5, "A")).toBe("Dentro do limite");
    expect(bugsHelper(23, "B")).toBe("Dentro do limite");
  });

  it("retorna 'Acima do limite' para ratings C/D/E", () => {
    expect(bugsHelper(100, "C")).toBe("Acima do limite");
    expect(bugsHelper(500, "E")).toBe("Acima do limite");
  });
});

describe("vulnerabilitiesHelper", () => {
  it.each([
    [0, "Sem problemas encontrados"],
    [1, "1 problema encontrado"],
    [5, "5 problemas encontrados"],
  ])("valor %i → %s", (value, expected) => {
    expect(vulnerabilitiesHelper(value)).toBe(expected);
  });
});

describe("coverageHelper / duplicationHelper", () => {
  it("formata thresholds", () => {
    expect(coverageHelper(80)).toBe("Mínimo: 80%");
    expect(duplicationHelper(5)).toBe("Máximo: 5%");
  });
});

describe("codeSmellsHelper", () => {
  it("formata em 'k linhas' acima de 1000", () => {
    expect(codeSmellsHelper(999)).toBe("999 linhas");
    expect(codeSmellsHelper(1000)).toBe("1k linhas");
    expect(codeSmellsHelper(265000)).toBe("265k linhas");
  });
});

describe("securityHotspotsHelper", () => {
  it("retorna 'Sem trechos para revisar' quando 0", () => {
    expect(securityHotspotsHelper(0)).toBe("Sem trechos para revisar");
  });

  it("retorna 'Trechos que requerem revisão' quando > 0", () => {
    expect(securityHotspotsHelper(12)).toBe("Trechos que requerem revisão");
  });
});
