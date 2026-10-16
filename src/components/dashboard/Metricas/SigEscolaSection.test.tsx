import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";

vi.mock("@/hooks/_helpers/sigEscolaMetricasQuery", () => ({
  useSigEscolaOpcoes: () => ({
    data: { periodo: "2026.3", periodos: ["2026.3"], unidades: [] },
  }),
}));

vi.mock("./SigEscolaFiltrosBar", () => ({
  __esModule: true,
  default: ({
    value,
    opcoes,
  }: {
    value: SigEscolaFiltros;
    opcoes?: { periodo: string | null };
  }) => (
    <div data-testid="sig-escola-filtros-bar">
      {value.modo} {opcoes?.periodo}
    </div>
  ),
}));

vi.mock("./AcessoAtivoSigEscolaCard", () => ({
  __esModule: true,
  default: () => <div data-testid="kpi-card">Usuários com acesso ativo</div>,
}));

vi.mock("./UsuariosUnicosSigEscolaCard", () => ({
  __esModule: true,
  default: () => <div data-testid="kpi-card">Usuários únicos por dia</div>,
}));

vi.mock("./TotalAcessosHojeSigEscolaCard", () => ({
  __esModule: true,
  default: () => (
    <div data-testid="kpi-card">Total de acessos ao sistema hoje</div>
  ),
}));

vi.mock("./PlanoAnualDeAtividadesCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="plano-anual-de-atividades-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./PrestacaoDeContasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="prestacao-de-contas-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./SituacaoPatrimonialCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="situacao-patrimonial-card">{systemName ?? ""}</div>
  ),
}));

import SigEscolaSection from "./SigEscolaSection";

const BASE_FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "2026.2",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

describe("<SigEscolaSection />", () => {
  it("renderiza a barra de filtros e os 3 cards propagando systemName", () => {
    render(
      <SigEscolaSection
        systemName="SigEscola"
        filtros={BASE_FILTROS}
        onFiltrosChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("sig-escola-filtros-bar")).toHaveTextContent(
      "periodo 2026.3",
    );
    expect(
      screen.getByTestId("plano-anual-de-atividades-card"),
    ).toHaveTextContent("SigEscola");
    expect(screen.getByTestId("prestacao-de-contas-card")).toHaveTextContent(
      "SigEscola",
    );
    expect(
      screen.getByTestId("situacao-patrimonial-card"),
    ).toHaveTextContent("SigEscola");

    // Os três KPIs do Figma, na ordem, antes do bloco do PAA.
    const kpis = screen.getAllByTestId("kpi-card");
    expect(kpis.map((kpi) => kpi.textContent)).toEqual([
      "Usuários com acesso ativo",
      "Usuários únicos por dia",
      "Total de acessos ao sistema hoje",
    ]);
    expect(
      kpis[2].compareDocumentPosition(
        screen.getByTestId("plano-anual-de-atividades-card"),
      ) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
