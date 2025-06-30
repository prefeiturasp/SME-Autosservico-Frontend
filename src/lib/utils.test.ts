import { describe, expect, it } from "vitest";
import { cn, numberToBRL } from "./utils";

describe("Função cn (clsx + tailwind-merge)", () => {
  it("retorna uma string combinada de classes", () => {
    const result = cn("p-2", "text-sm", "text-center");
    expect(result).toBe("p-2 text-sm text-center");
  });

  it("remove classes duplicadas do Tailwind", () => {
    const result = cn("text-sm", "text-lg");
    expect(result).toBe("text-lg"); // tailwind-merge dá prioridade à última
  });

  it("ignora valores falsy (null, undefined, false)", () => {
    const result = cn("p-2", null, undefined, false, "text-sm");
    expect(result).toBe("p-2 text-sm");
  });

  it("lida com entradas booleanas e objetos (clsx)", () => {
    const result = cn("p-2", { "text-sm": true, "text-lg": false });
    expect(result).toBe("p-2 text-sm");
  });
});

describe("Função numberToBRL", () => {
  it("formata corretamente o número em moeda BRL", () => {
    expect(numberToBRL(1234.5)).toBe("R$ 1.234,50");
  });

  it("formata zero corretamente", () => {
    expect(numberToBRL(0)).toBe("R$ 0,00");
  });

  it("formata números grandes corretamente", () => {
    expect(numberToBRL(9876543.21)).toBe("R$ 9.876.543,21");
  });

  it("formata número negativo corretamente", () => {
    expect(numberToBRL(-2500.75)).toBe("R$ -2.500,75");

  });
});
