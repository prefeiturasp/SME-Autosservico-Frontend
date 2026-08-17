import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./MedicoesIniciaisCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="medicoes-iniciais-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./ProdutosHomologadosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="produtos-homologados-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./EmpresasTerceirizadasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="empresas-terceirizadas-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./SolicitacoesAlimentacoesCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="solicitacoes-alimentacoes-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./SolicitacoesDietasEspeciaisCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="solicitacoes-dietas-especiais-card">{systemName ?? ""}</div>
  ),
}));

import AlimentacaoTerceirizadaSection from "./AlimentacaoTerceirizadaSection";

describe("<AlimentacaoTerceirizadaSection />", () => {
  it("renderiza o título da seção e todos os cards, propagando systemName", () => {
    render(<AlimentacaoTerceirizadaSection systemName="SigPAE" />);

    expect(
      screen.getByRole("heading", { name: "Alimentação Terceirizada" })
    ).toBeInTheDocument();

    expect(screen.getByTestId("medicoes-iniciais-card")).toHaveTextContent("SigPAE");
    expect(screen.getByTestId("produtos-homologados-card")).toHaveTextContent(
      "SigPAE"
    );
    expect(screen.getByTestId("empresas-terceirizadas-card")).toHaveTextContent(
      "SigPAE"
    );
    expect(
      screen.getByTestId("solicitacoes-alimentacoes-card")
    ).toHaveTextContent("SigPAE");
    expect(
      screen.getByTestId("solicitacoes-dietas-especiais-card")
    ).toHaveTextContent("SigPAE");
  });
});
