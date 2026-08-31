import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./UnidadesProdutivasIndicadoresCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="unidades-produtivas-indicadores-card">
      {systemName ?? ""}
    </div>
  ),
}));

import UnidadesProdutivasSection from "./UnidadesProdutivasSection";

describe("<UnidadesProdutivasSection />", () => {
  it("renderiza o card propagando systemName", () => {
    render(<UnidadesProdutivasSection systemName="Rolê Agroecológico" />);

    expect(
      screen.getByTestId("unidades-produtivas-indicadores-card"),
    ).toHaveTextContent("Rolê Agroecológico");
  });
});
