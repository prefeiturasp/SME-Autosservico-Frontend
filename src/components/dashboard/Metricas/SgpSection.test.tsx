import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const { cardFalso } = vi.hoisted(() => ({
  cardFalso: (testId: string) => ({
    __esModule: true,
    default: ({ systemName }: { systemName?: string }) => (
      <div data-testid={testId}>{systemName ?? ""}</div>
    ),
  }),
}));

vi.mock("./FrequenciasLancadasCard", () => cardFalso("frequencias-lancadas-card"));
vi.mock("./SondagensRealizadasCard", () => cardFalso("sondagens-realizadas-card"));
vi.mock("./ConselhoDeClasseCard", () => cardFalso("conselho-de-classe-card"));
vi.mock("./ControleAcessosKpis", () => cardFalso("controle-acessos-kpis"));
vi.mock("./AcompanhamentoAcessosCard", () => cardFalso("acompanhamento-acessos-card"));
vi.mock("./FechamentoSgpSection", () => cardFalso("fechamento-sgp-section"));

import SgpSection from "./SgpSection";

describe("<SgpSection />", () => {
  it("renderiza as seções do protótipo propagando systemName", () => {
    render(<SgpSection systemName="SGP" />);

    for (const testId of [
      "controle-acessos-kpis",
      "acompanhamento-acessos-card",
      "fechamento-sgp-section",
      "conselho-de-classe-card",
      "frequencias-lancadas-card",
      "sondagens-realizadas-card",
    ]) {
      expect(screen.getByTestId(testId)).toHaveTextContent("SGP");
    }
    expect(screen.getByRole("button", { name: "Controle de Acessos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechamento" })).toBeInTheDocument();
  });

  it("recolhe uma seção pelo título", async () => {
    render(<SgpSection systemName="SGP" />);

    await userEvent.click(screen.getByRole("button", { name: "Controle de Acessos" }));

    expect(screen.getByTestId("controle-acessos-kpis")).not.toBeVisible();
    expect(screen.getByTestId("fechamento-sgp-section")).toBeVisible();
  });
});
