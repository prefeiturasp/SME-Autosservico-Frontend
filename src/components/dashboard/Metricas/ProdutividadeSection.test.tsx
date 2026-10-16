import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./ProdutividadeTotaisCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="produtividade-totais-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OcorrenciasTratadasPorAnalistaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-tratadas-por-analista-card">
      {systemName ?? ""}
    </div>
  ),
}));

vi.mock("./OcorrenciasTratadasPorDreCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-tratadas-por-dre-card">
      {systemName ?? ""}
    </div>
  ),
}));

import ProdutividadeSection from "./ProdutividadeSection";

describe("<ProdutividadeSection />", () => {
  it("renderiza o título da seção e os 3 cards, propagando systemName", () => {
    render(<ProdutividadeSection systemName="GIPE" />);

    expect(
      screen.getByRole("heading", { name: "Produtividade" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("produtividade-totais-card"),
    ).toHaveTextContent("GIPE");
    expect(
      screen.getByTestId("ocorrencias-tratadas-por-analista-card"),
    ).toHaveTextContent("GIPE");
    expect(
      screen.getByTestId("ocorrencias-tratadas-por-dre-card"),
    ).toHaveTextContent("GIPE");
  });
});
