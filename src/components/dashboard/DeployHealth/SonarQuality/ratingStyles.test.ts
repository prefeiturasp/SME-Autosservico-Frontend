import { describe, it, expect } from "vitest";
import { ratingFromCoverage, ratingFromDuplication, RATING_STYLES } from "./ratingStyles";

describe("ratingFromCoverage", () => {
  it("retorna A quando atinge o mínimo (padrão 80%)", () => {
    expect(ratingFromCoverage(80)).toBe("A");
    expect(ratingFromCoverage(95)).toBe("A");
  });

  it("retorna B/C/D/E em faixas decrescentes", () => {
    expect(ratingFromCoverage(75)).toBe("B");
    expect(ratingFromCoverage(60)).toBe("C");
    expect(ratingFromCoverage(40)).toBe("D");
    expect(ratingFromCoverage(10)).toBe("E");
  });

  it("aceita mínimo customizado", () => {
    expect(ratingFromCoverage(70, 70)).toBe("A");
    expect(ratingFromCoverage(69, 70)).toBe("B");
  });
});

describe("ratingFromDuplication", () => {
  it("retorna A quando duplicação está abaixo do máximo (padrão 5%)", () => {
    expect(ratingFromDuplication(0)).toBe("A");
    expect(ratingFromDuplication(5)).toBe("A");
  });

  it("retorna B/C/D/E em faixas crescentes", () => {
    expect(ratingFromDuplication(8)).toBe("B");
    expect(ratingFromDuplication(15)).toBe("C");
    expect(ratingFromDuplication(25)).toBe("D");
    expect(ratingFromDuplication(40)).toBe("E");
  });
});

describe("RATING_STYLES", () => {
  it("contém entrada para todos os ratings A–E", () => {
    (["A", "B", "C", "D", "E"] as const).forEach((r) => {
      expect(RATING_STYLES[r]).toBeDefined();
      expect(RATING_STYLES[r].badgeClassName).toBeTruthy();
      expect(RATING_STYLES[r].cardClassName).toBeTruthy();
    });
  });
});
