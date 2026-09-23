import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";

vi.mock("./SigEscolaFiltrosBar", () => ({
  __esModule: true,
  default: ({ value }: { value: SigEscolaFiltros }) => (
    <div data-testid="sig-escola-filtros-bar">{value.modo}</div>
  ),
}));

vi.mock("./AcessoAtivoSigEscolaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="acesso-ativo-sig-escola-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./UsuariosUnicosSigEscolaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="usuarios-unicos-sig-escola-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./TotalAcessosHojeSigEscolaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="total-acessos-hoje-sig-escola-card">
      {systemName ?? ""}
    </div>
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
  it("renderiza a barra de filtros e os 6 cards propagando systemName", () => {
    render(
      <SigEscolaSection
        systemName="SigEscola"
        filtros={BASE_FILTROS}
        onFiltrosChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId("sig-escola-filtros-bar")).toHaveTextContent(
      "periodo",
    );
    expect(
      screen.getByTestId("acesso-ativo-sig-escola-card"),
    ).toHaveTextContent("SigEscola");
    expect(
      screen.getByTestId("usuarios-unicos-sig-escola-card"),
    ).toHaveTextContent("SigEscola");
    expect(
      screen.getByTestId("total-acessos-hoje-sig-escola-card"),
    ).toHaveTextContent("SigEscola");
    expect(
      screen.getByTestId("plano-anual-de-atividades-card"),
    ).toHaveTextContent("SigEscola");
    expect(screen.getByTestId("prestacao-de-contas-card")).toHaveTextContent(
      "SigEscola",
    );
    expect(
      screen.getByTestId("situacao-patrimonial-card"),
    ).toHaveTextContent("SigEscola");
  });
});
