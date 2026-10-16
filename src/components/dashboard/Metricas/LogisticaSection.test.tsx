import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./CronogramasEntregasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="cronogramas-entregas-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./FichasTecnicasProdutosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="fichas-tecnicas-produtos-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./FornecedoresDistribuidoresCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="fornecedores-distribuidores-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./LayoutsEmbalagensCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="layouts-embalagens-card">{systemName ?? ""}</div>
  ),
}));

import LogisticaSection from "./LogisticaSection";

describe("<LogisticaSection />", () => {
  it("renderiza o título da seção e todos os cards, propagando systemName", () => {
    render(<LogisticaSection systemName="SigPAE" />);

    expect(screen.getByRole("heading", { name: "Logística" })).toBeInTheDocument();

    expect(screen.getByTestId("cronogramas-entregas-card")).toHaveTextContent(
      "SigPAE"
    );
    expect(screen.getByTestId("fichas-tecnicas-produtos-card")).toHaveTextContent(
      "SigPAE"
    );
    expect(
      screen.getByTestId("fornecedores-distribuidores-card")
    ).toHaveTextContent("SigPAE");
    expect(screen.getByTestId("layouts-embalagens-card")).toHaveTextContent(
      "SigPAE"
    );
  });
});
