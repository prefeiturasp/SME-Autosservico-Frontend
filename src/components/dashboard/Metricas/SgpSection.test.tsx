import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./FrequenciasLancadasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="frequencias-lancadas-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./SondagensRealizadasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="sondagens-realizadas-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./AcompanhamentoFechamentoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="acompanhamento-fechamento-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./ConselhoDeClasseCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="conselho-de-classe-card">{systemName ?? ""}</div>
  ),
}));

import SgpSection from "./SgpSection";

describe("<SgpSection />", () => {
  it("renderiza os 4 cards propagando systemName", () => {
    render(<SgpSection systemName="SGP" />);

    expect(screen.getByTestId("frequencias-lancadas-card")).toHaveTextContent("SGP");
    expect(screen.getByTestId("sondagens-realizadas-card")).toHaveTextContent("SGP");
    expect(screen.getByTestId("acompanhamento-fechamento-card")).toHaveTextContent(
      "SGP",
    );
    expect(screen.getByTestId("conselho-de-classe-card")).toHaveTextContent("SGP");
  });
});
