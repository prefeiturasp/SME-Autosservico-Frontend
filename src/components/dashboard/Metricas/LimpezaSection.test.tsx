import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./FechamentosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="fechamentos-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OcorrenciasPorPrestadorCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-por-prestador-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./ValoresPagosPorPrestadorCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="valores-pagos-por-prestador-card">
      {systemName ?? ""}
    </div>
  ),
}));

vi.mock("./ContratosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="contratos-card">{systemName ?? ""}</div>
  ),
}));

import LimpezaSection from "./LimpezaSection";

describe("<LimpezaSection />", () => {
  it("renderiza os 4 cards propagando systemName", () => {
    render(<LimpezaSection systemName="Limpeza" />);

    expect(screen.getByTestId("fechamentos-card")).toHaveTextContent(
      "Limpeza",
    );
    expect(
      screen.getByTestId("ocorrencias-por-prestador-card"),
    ).toHaveTextContent("Limpeza");
    expect(
      screen.getByTestId("valores-pagos-por-prestador-card"),
    ).toHaveTextContent("Limpeza");
    expect(screen.getByTestId("contratos-card")).toHaveTextContent("Limpeza");
  });
});
