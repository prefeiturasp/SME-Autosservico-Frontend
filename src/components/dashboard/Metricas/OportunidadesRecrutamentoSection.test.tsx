import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./OportunidadesStatusGeralCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="oportunidades-status-geral-card">{systemName ?? ""}</div>
  ),
}));

import OportunidadesRecrutamentoSection from "./OportunidadesRecrutamentoSection";

describe("<OportunidadesRecrutamentoSection />", () => {
  it("renderiza o título da seção e o card, propagando systemName", () => {
    render(<OportunidadesRecrutamentoSection systemName="Intranet" />);

    expect(
      screen.getByRole("heading", { name: "Oportunidades e recrutamento" })
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("oportunidades-status-geral-card")
    ).toHaveTextContent("Intranet");
  });
});
