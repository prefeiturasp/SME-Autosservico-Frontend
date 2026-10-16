import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./OrdemInscricaoStatusGeralCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ordem-inscricao-status-geral-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OrdemInscricaoPorTipoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ordem-inscricao-por-tipo-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OrdemInscricaoPorGanhadorCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ordem-inscricao-por-ganhador-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OrdemInscricaoPorDreCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ordem-inscricao-por-dre-card">{systemName ?? ""}</div>
  ),
}));

import OrdemInscricaoSection from "./OrdemInscricaoSection";

describe("<OrdemInscricaoSection />", () => {
  it("renderiza o título da seção e todos os cards, propagando systemName", () => {
    render(<OrdemInscricaoSection systemName="Intranet" />);

    expect(
      screen.getByRole("heading", { name: "Ordem de inscrição" })
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("ordem-inscricao-status-geral-card")
    ).toHaveTextContent("Intranet");
    expect(screen.getByTestId("ordem-inscricao-por-tipo-card")).toHaveTextContent(
      "Intranet"
    );
    expect(
      screen.getByTestId("ordem-inscricao-por-ganhador-card")
    ).toHaveTextContent("Intranet");
    expect(screen.getByTestId("ordem-inscricao-por-dre-card")).toHaveTextContent(
      "Intranet"
    );
  });
});
