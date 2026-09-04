import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./RelatoriosGeradosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="relatorios-gerados-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./RelatoriosTotaisCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="relatorios-totais-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./RelatoriosExportadosPorFormatoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="relatorios-exportados-por-formato-card">
      {systemName ?? ""}
    </div>
  ),
}));

import RelatoriosSection from "./RelatoriosSection";

describe("<RelatoriosSection />", () => {
  it("renderiza o título da seção e os 3 cards, propagando systemName", () => {
    render(<RelatoriosSection systemName="Sigla" />);

    expect(
      screen.getByRole("heading", { name: "Relatórios" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("relatorios-gerados-card")).toHaveTextContent(
      "Sigla",
    );
    expect(screen.getByTestId("relatorios-totais-card")).toHaveTextContent(
      "Sigla",
    );
    expect(
      screen.getByTestId("relatorios-exportados-por-formato-card"),
    ).toHaveTextContent("Sigla");
  });
});
