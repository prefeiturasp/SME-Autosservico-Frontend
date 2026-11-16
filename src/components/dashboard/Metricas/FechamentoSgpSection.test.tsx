import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/hooks/usePeriodosSgp", async () => {
  const { useState } = await import("react");
  return {
    usePeriodoSgp: () => {
      const [periodo, setPeriodo] = useState("fundamental_medio:2026:0:4");
      return { periodo, setPeriodo, opcoes: [] };
    },
  };
});

vi.mock("./AcompanhamentoFechamentoCard", () => ({
  __esModule: true,
  default: ({
    periodo,
    onPeriodoChange,
  }: {
    periodo: string;
    onPeriodoChange: (next: string) => void;
  }) => (
    <button type="button" onClick={() => onPeriodoChange("eja:2026:2:1")}>
      fechamento {periodo}
    </button>
  ),
}));

vi.mock("./FechamentoPorDreCard", () => ({
  __esModule: true,
  default: ({ titulo, periodo }: { titulo: string; periodo: string }) => (
    <div data-testid="grafico-dre">
      {titulo} | {periodo}
    </div>
  ),
}));

import FechamentoSgpSection from "./FechamentoSgpSection";

describe("<FechamentoSgpSection />", () => {
  it("renderiza o card e os 4 gráficos por DRE com o mesmo período", async () => {
    render(<FechamentoSgpSection systemName="SGP" />);

    const graficos = screen.getAllByTestId("grafico-dre");
    expect(graficos).toHaveLength(4);
    expect(graficos[0]).toHaveTextContent(
      "Fechamentos Não iniciados por DRE | fundamental_medio:2026:0:4",
    );
    expect(graficos[3]).toHaveTextContent("Fechamentos Processados com erros por DRE");

    await userEvent.click(screen.getByRole("button", { name: /fechamento/ }));

    for (const grafico of screen.getAllByTestId("grafico-dre")) {
      expect(grafico).toHaveTextContent("eja:2026:2:1");
    }
  });
});
