import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./TempoDeRespostaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="tempo-de-resposta-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./PrazosMovimentacoesCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="prazos-movimentacoes-card">{systemName ?? ""}</div>
  ),
}));

import FluxoDeAtendimentoSection from "./FluxoDeAtendimentoSection";

describe("<FluxoDeAtendimentoSection />", () => {
  it("renderiza o título da seção e os 2 cards, propagando systemName", () => {
    render(<FluxoDeAtendimentoSection systemName="GIPE" />);

    expect(
      screen.getByRole("heading", { name: "Fluxo de atendimento" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("tempo-de-resposta-card")).toHaveTextContent(
      "GIPE",
    );
    expect(
      screen.getByTestId("prazos-movimentacoes-card"),
    ).toHaveTextContent("GIPE");
  });
});
