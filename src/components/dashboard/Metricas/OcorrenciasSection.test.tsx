import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./OcorrenciasStatusGeralCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-status-geral-card">{systemName ?? ""}</div>
  ),
}));

import OcorrenciasSection from "./OcorrenciasSection";

describe("<OcorrenciasSection />", () => {
  it("renderiza o título da seção e o card, propagando systemName", () => {
    render(<OcorrenciasSection systemName="GIPE" />);

    expect(
      screen.getByRole("heading", { name: "Ocorrências" }),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("ocorrencias-status-geral-card"),
    ).toHaveTextContent("GIPE");
  });
});
