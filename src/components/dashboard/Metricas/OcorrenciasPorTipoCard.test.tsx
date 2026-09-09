import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("./OcorrenciaPatrimonialCard", () => ({
  __esModule: true,
  default: ({
    systemName,
    bare,
  }: {
    systemName?: string;
    bare?: boolean;
  }) => (
    <div data-testid="ocorrencia-patrimonial-card">
      {systemName ?? ""}::{bare ? "bare" : "full"}
    </div>
  ),
}));

vi.mock("./OcorrenciaInterpessoalCard", () => ({
  __esModule: true,
  default: ({
    systemName,
    bare,
  }: {
    systemName?: string;
    bare?: boolean;
  }) => (
    <div data-testid="ocorrencia-interpessoal-card">
      {systemName ?? ""}::{bare ? "bare" : "full"}
    </div>
  ),
}));

import OcorrenciasPorTipoCard from "./OcorrenciasPorTipoCard";

describe("<OcorrenciasPorTipoCard />", () => {
  it("sem systemName mostra um único placeholder", () => {
    render(<OcorrenciasPorTipoCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    expect(
      screen.queryByTestId("ocorrencia-patrimonial-card"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("ocorrencia-interpessoal-card"),
    ).not.toBeInTheDocument();
  });

  it("renderiza o título e os 2 cards filhos em modo bare, propagando systemName", () => {
    render(<OcorrenciasPorTipoCard systemName="GIPE" />);

    expect(screen.getByText("Ocorrências por tipo")).toBeInTheDocument();
    expect(
      screen.getByTestId("ocorrencia-patrimonial-card"),
    ).toHaveTextContent("GIPE::bare");
    expect(
      screen.getByTestId("ocorrencia-interpessoal-card"),
    ).toHaveTextContent("GIPE::bare");
  });
});
