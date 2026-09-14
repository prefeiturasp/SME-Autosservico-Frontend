import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./EscolhasStatusGeralCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="escolhas-status-geral-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./PercentualVagasPreenchidasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="percentual-vagas-preenchidas-card">
      {systemName ?? ""}
    </div>
  ),
}));

import EscolhasSection from "./EscolhasSection";

describe("<EscolhasSection />", () => {
  it("renderiza o título da seção e os 2 cards, propagando systemName", () => {
    render(<EscolhasSection systemName="Sigla" />);

    expect(
      screen.getByRole("heading", { name: "Escolhas" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("escolhas-status-geral-card"),
    ).toHaveTextContent("Sigla");
    expect(
      screen.getByTestId("percentual-vagas-preenchidas-card"),
    ).toHaveTextContent("Sigla");
  });
});
