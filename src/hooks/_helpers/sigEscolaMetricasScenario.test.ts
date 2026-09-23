import { describe, it, expect } from "vitest";
import { ALL_DRES_VALUE } from "@/types/dreOption";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import { ALL_UES_VALUE } from "@/types/ueOption";
import { resolveSigEscolaScenario } from "./sigEscolaMetricasScenario";

const BASE: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "2026.2",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: ALL_DRES_VALUE,
  ue: ALL_UES_VALUE,
};

describe("resolveSigEscolaScenario", () => {
  it("retorna 'baseline' quando o modo é 'periodo'", () => {
    expect(resolveSigEscolaScenario(BASE)).toBe("baseline");
  });

  it("retorna 'intervalo' quando o modo é 'intervalo' com todas as DREs e UEs", () => {
    expect(
      resolveSigEscolaScenario({ ...BASE, modo: "intervalo" }),
    ).toBe("intervalo");
  });

  it("retorna 'intervalo-butanta' quando o modo é 'intervalo' com a DRE Butantã", () => {
    expect(
      resolveSigEscolaScenario({ ...BASE, modo: "intervalo", dre: "butanta" }),
    ).toBe("intervalo-butanta");
  });

  it("cai em 'baseline' quando o modo é 'intervalo' com outra DRE fora das 2 conhecidas", () => {
    expect(
      resolveSigEscolaScenario({
        ...BASE,
        modo: "intervalo",
        dre: "ipiranga",
      }),
    ).toBe("baseline");
  });

  it("cai em 'baseline' quando o modo é 'intervalo' mas com uma UE específica", () => {
    expect(
      resolveSigEscolaScenario({
        ...BASE,
        modo: "intervalo",
        ue: "cemei-morumbi",
      }),
    ).toBe("baseline");
  });

  it("cai em 'baseline' quando o modo é 'periodo' mesmo com DRE Butantã selecionada", () => {
    expect(
      resolveSigEscolaScenario({ ...BASE, modo: "periodo", dre: "butanta" }),
    ).toBe("baseline");
  });
});
