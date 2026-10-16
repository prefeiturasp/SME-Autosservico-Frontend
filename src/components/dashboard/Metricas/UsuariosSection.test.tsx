import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";

vi.mock("./TotalDeUsuariosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="total-de-usuarios-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./UsuariosPorTipoDePerfilCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="usuarios-por-tipo-de-perfil-card">
      {systemName ?? ""}
    </div>
  ),
}));

vi.mock("./PerfisMaisUtilizadosCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="perfis-mais-utilizados-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./UsuariosPorDreCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="usuarios-por-dre-card">{systemName ?? ""}</div>
  ),
}));

vi.mock("./UsuariosPorUnidadeEducacionalCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="usuarios-por-unidade-educacional-card">
      {systemName ?? ""}
    </div>
  ),
}));

import UsuariosSection from "./UsuariosSection";

describe("<UsuariosSection />", () => {
  it("renderiza o título da seção e os 5 cards, propagando systemName", () => {
    render(<UsuariosSection systemName="GIPE" />);

    expect(
      screen.getByRole("heading", { name: "Usuários" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("total-de-usuarios-card")).toHaveTextContent(
      "GIPE",
    );
    expect(
      screen.getByTestId("usuarios-por-tipo-de-perfil-card"),
    ).toHaveTextContent("GIPE");
    expect(
      screen.getByTestId("perfis-mais-utilizados-card"),
    ).toHaveTextContent("GIPE");
    expect(screen.getByTestId("usuarios-por-dre-card")).toHaveTextContent(
      "GIPE",
    );
    expect(
      screen.getByTestId("usuarios-por-unidade-educacional-card"),
    ).toHaveTextContent("GIPE");
  });
});
