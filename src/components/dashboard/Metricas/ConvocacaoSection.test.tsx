import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./ConvocacaoStatusGeralCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="convocacao-status-geral-card">{systemName ?? ""}</div>
  ),
}));

import ConvocacaoSection from "./ConvocacaoSection";

describe("<ConvocacaoSection />", () => {
  it("renderiza o título da seção e o card, propagando systemName", () => {
    render(<ConvocacaoSection systemName="Sigla" />);

    expect(
      screen.getByRole("heading", { name: "Convocação" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("convocacao-status-geral-card"),
    ).toHaveTextContent("Sigla");
  });
});
