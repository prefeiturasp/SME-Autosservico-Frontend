import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./ConvocacoesPorConcursoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="convocacoes-por-concurso-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./ConvocacoesPorCargoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="convocacoes-por-cargo-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./ConvocacoesPorAnoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="convocacoes-por-ano-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./ConvocacoesPorDreCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="convocacoes-por-dre-card">{systemName ?? ""}</div>
  ),
}));

import GestaoSection from "./GestaoSection";

describe("<GestaoSection />", () => {
  it("renderiza o título da seção e os 4 cards, propagando systemName", () => {
    render(<GestaoSection systemName="Sigla" />);

    expect(screen.getByRole("heading", { name: "Gestão" })).toBeInTheDocument();
    expect(
      screen.getByTestId("convocacoes-por-concurso-card"),
    ).toHaveTextContent("Sigla");
    expect(
      screen.getByTestId("convocacoes-por-cargo-card"),
    ).toHaveTextContent("Sigla");
    expect(screen.getByTestId("convocacoes-por-ano-card")).toHaveTextContent(
      "Sigla",
    );
    expect(screen.getByTestId("convocacoes-por-dre-card")).toHaveTextContent(
      "Sigla",
    );
  });
});
