import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./SorteiosStatusGeralCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="sorteios-status-geral-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./SorteiosPorTipoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="sorteios-por-tipo-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./SorteiosPorGanhadorCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="sorteios-por-ganhador-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./SorteiosPorDreCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="sorteios-por-dre-card">{systemName ?? ""}</div>
  ),
}));

import SorteiosSection from "./SorteiosSection";

describe("<SorteiosSection />", () => {
  it("renderiza o título da seção e todos os cards, propagando systemName", () => {
    render(<SorteiosSection systemName="Intranet" />);

    expect(screen.getByRole("heading", { name: "Sorteios" })).toBeInTheDocument();

    expect(screen.getByTestId("sorteios-status-geral-card")).toHaveTextContent(
      "Intranet"
    );
    expect(screen.getByTestId("sorteios-por-tipo-card")).toHaveTextContent(
      "Intranet"
    );
    expect(screen.getByTestId("sorteios-por-ganhador-card")).toHaveTextContent(
      "Intranet"
    );
    expect(screen.getByTestId("sorteios-por-dre-card")).toHaveTextContent(
      "Intranet"
    );
  });
});
