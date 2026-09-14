import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./AcessoAtivoSigEscolaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="acesso-ativo-sig-escola-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./UsuariosUnicosSigEscolaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="usuarios-unicos-sig-escola-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./UesAptasPrestarContasSigEscolaCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="ues-aptas-prestar-contas-sig-escola-card">
      {systemName ?? ""}
    </div>
  ),
}));

vi.mock("./PrestacaoDeContasCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="prestacao-de-contas-card">{systemName ?? ""}</div>
  ),
}));

import SigEscolaSection from "./SigEscolaSection";

describe("<SigEscolaSection />", () => {
  it("renderiza os 4 cards propagando systemName", () => {
    render(<SigEscolaSection systemName="SigEscola" />);

    expect(
      screen.getByTestId("acesso-ativo-sig-escola-card"),
    ).toHaveTextContent("SigEscola");
    expect(
      screen.getByTestId("usuarios-unicos-sig-escola-card"),
    ).toHaveTextContent("SigEscola");
    expect(
      screen.getByTestId("ues-aptas-prestar-contas-sig-escola-card"),
    ).toHaveTextContent("SigEscola");
    expect(screen.getByTestId("prestacao-de-contas-card")).toHaveTextContent(
      "SigEscola",
    );
  });
});
