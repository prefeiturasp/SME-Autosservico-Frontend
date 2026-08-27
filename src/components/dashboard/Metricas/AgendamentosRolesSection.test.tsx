import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./AgendamentosRolesIndicadoresCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="agendamentos-roles-indicadores-card">
      {systemName ?? ""}
    </div>
  ),
}));

import AgendamentosRolesSection from "./AgendamentosRolesSection";

describe("<AgendamentosRolesSection />", () => {
  it("renderiza o card propagando systemName", () => {
    render(<AgendamentosRolesSection systemName="Rolê Agroecológico" />);

    expect(
      screen.getByTestId("agendamentos-roles-indicadores-card"),
    ).toHaveTextContent("Rolê Agroecológico");
  });
});
