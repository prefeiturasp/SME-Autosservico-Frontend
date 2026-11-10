import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./AcessoAtivoBensFisicosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="acesso-ativo-bens-fisicos-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./UsuariosUnicosBensFisicosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="usuarios-unicos-bens-fisicos-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./CadastroDeBensCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="cadastro-de-bens-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./BaixasFisicasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="baixas-fisicas-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./MovimentacoesTransferenciasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="movimentacoes-transferencias-card">{systemName ?? ""}</div>
  ),
}));

import BensFisicosSection from "./BensFisicosSection";

describe("<BensFisicosSection />", () => {
  it("renderiza os 5 cards propagando systemName", () => {
    render(<BensFisicosSection systemName="Bens Físicos" />);

    expect(
      screen.getByTestId("acesso-ativo-bens-fisicos-card"),
    ).toHaveTextContent("Bens Físicos");
    expect(
      screen.getByTestId("usuarios-unicos-bens-fisicos-card"),
    ).toHaveTextContent("Bens Físicos");
    expect(screen.getByTestId("cadastro-de-bens-card")).toHaveTextContent(
      "Bens Físicos",
    );
    expect(screen.getByTestId("baixas-fisicas-card")).toHaveTextContent(
      "Bens Físicos",
    );
    expect(
      screen.getByTestId("movimentacoes-transferencias-card"),
    ).toHaveTextContent("Bens Físicos");
  });

  it("não exibe o card de UEs aptas a prestar contas", () => {
    render(<BensFisicosSection systemName="Bens Físicos" />);

    expect(
      screen.queryByText("UEs aptas a prestar contas pelo sistema"),
    ).not.toBeInTheDocument();
    expect(screen.getAllByTestId(/-card$/)).toHaveLength(5);
  });
});
