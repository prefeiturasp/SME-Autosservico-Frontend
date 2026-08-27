import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./IndicadoresParticipacaoLogisticaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="indicadores-participacao-logistica-card">
      {systemName ?? ""}
    </div>
  ),
}));

import IndicadoresParticipacaoLogisticaSection from "./IndicadoresParticipacaoLogisticaSection";

describe("<IndicadoresParticipacaoLogisticaSection />", () => {
  it("renderiza o card propagando systemName", () => {
    render(
      <IndicadoresParticipacaoLogisticaSection systemName="Rolê Agroecológico" />,
    );

    expect(
      screen.getByTestId("indicadores-participacao-logistica-card"),
    ).toHaveTextContent("Rolê Agroecológico");
  });
});
