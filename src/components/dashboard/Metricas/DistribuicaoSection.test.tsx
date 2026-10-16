import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./OcorrenciasPorDreCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-por-dre-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OcorrenciasPorUnidadeEducacionalCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-por-unidade-educacional-card">
      {systemName ?? ""}
    </div>
  ),
}));

vi.mock("./OcorrenciasPorCategoriaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-por-categoria-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OcorrenciasPorTipoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-por-tipo-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OcorrenciasPorMesCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-por-mes-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./OcorrenciasPorPeriodoLetivoCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ocorrencias-por-periodo-letivo-card">
      {systemName ?? ""}
    </div>
  ),
}));

import DistribuicaoSection from "./DistribuicaoSection";

describe("<DistribuicaoSection />", () => {
  it("renderiza o título da seção e os 6 cards, propagando systemName", () => {
    render(<DistribuicaoSection systemName="GIPE" />);

    expect(
      screen.getByRole("heading", { name: "Distribuição" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("ocorrencias-por-dre-card")).toHaveTextContent(
      "GIPE",
    );
    expect(
      screen.getByTestId("ocorrencias-por-unidade-educacional-card"),
    ).toHaveTextContent("GIPE");
    expect(
      screen.getByTestId("ocorrencias-por-categoria-card"),
    ).toHaveTextContent("GIPE");
    expect(
      screen.getByTestId("ocorrencias-por-tipo-card"),
    ).toHaveTextContent("GIPE");
    expect(screen.getByTestId("ocorrencias-por-mes-card")).toHaveTextContent(
      "GIPE",
    );
    expect(
      screen.getByTestId("ocorrencias-por-periodo-letivo-card"),
    ).toHaveTextContent("GIPE");
  });
});
