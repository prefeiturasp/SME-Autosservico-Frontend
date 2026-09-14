import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./FluxoDeVagasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="fluxo-de-vagas-card">{systemName ?? ""}</div>
  ),
}));

import VagasSection from "./VagasSection";

describe("<VagasSection />", () => {
  it("renderiza o título da seção e o card, propagando systemName", () => {
    render(<VagasSection systemName="Sigla" />);

    expect(screen.getByRole("heading", { name: "Vagas" })).toBeInTheDocument();
    expect(screen.getByTestId("fluxo-de-vagas-card")).toHaveTextContent(
      "Sigla",
    );
  });
});
