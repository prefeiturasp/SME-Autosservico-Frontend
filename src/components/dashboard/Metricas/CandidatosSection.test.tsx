import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./CandidatosStatusGeralCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="candidatos-status-geral-card">{systemName ?? ""}</div>
  ),
}));

import CandidatosSection from "./CandidatosSection";

describe("<CandidatosSection />", () => {
  it("renderiza o título da seção e o card, propagando systemName", () => {
    render(<CandidatosSection systemName="Sigla" />);

    expect(
      screen.getByRole("heading", { name: "Candidatos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("candidatos-status-geral-card"),
    ).toHaveTextContent("Sigla");
  });
});
