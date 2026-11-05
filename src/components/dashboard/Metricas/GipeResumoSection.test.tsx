import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useGipeFiltros } from "@/states/gipe";

vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: Readonly<{
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }>) => (
    <select
      data-testid="ano-letivo-select"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <>{children}</>
  ),
  SelectItem: ({
    value,
    children,
  }: Readonly<{ value: string; children: React.ReactNode }>) => (
    <option value={value}>{children}</option>
  ),
}));

let mockAmbienteDeTeste = true;
vi.mock("@/hooks/useAmbienteDeTeste", () => ({
  useAmbienteDeTeste: () => mockAmbienteDeTeste,
}));

vi.mock("./AcessoAtivoGipeCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="kpi-card">Usuários com acesso ativo {systemName}</div>
  ),
}));

vi.mock("./UsuariosUnicosGipeCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="kpi-card">Usuários únicos por dia {systemName}</div>
  ),
}));

vi.mock("./TotalAcessosHojeGipeCard", () => ({
  __esModule: true,
  default: ({ systemName }: { systemName?: string }) => (
    <div data-testid="kpi-card">
      Total de acessos ao sistema hoje {systemName}
    </div>
  ),
}));

import GipeResumoSection from "./GipeResumoSection";

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2027-03-10T12:00:00-03:00"));
  useGipeFiltros.setState({ anoLetivo: 2027 });
  mockAmbienteDeTeste = true;
});

afterEach(() => {
  vi.useRealTimers();
});

describe("<GipeResumoSection />", () => {
  it("lista os anos do primeiro até o corrente, do mais novo para o mais antigo", () => {
    render(<GipeResumoSection systemName="GIPE" />);

    expect(
      screen.getAllByRole("option").map((opcao) => opcao.textContent),
    ).toEqual(["Ano 2027", "Ano 2026", "Ano 2025"]);
    expect(screen.getByTestId("ano-letivo-select")).toHaveValue("2027");
  });

  it("troca o ano do filtro", async () => {
    render(<GipeResumoSection systemName="GIPE" />);

    await userEvent.selectOptions(
      screen.getByTestId("ano-letivo-select"),
      "2025",
    );

    expect(useGipeFiltros.getState().anoLetivo).toBe(2025);
  });

  it("mostra os três KPIs do GIPE e o aviso do recorte do ano em test e homolog", () => {
    render(<GipeResumoSection systemName="GIPE" />);

    expect(
      screen.getAllByTestId("kpi-card").map((card) => card.textContent),
    ).toEqual([
      "Usuários com acesso ativo GIPE",
      "Usuários únicos por dia GIPE",
      "Total de acessos ao sistema hoje GIPE",
    ]);
    expect(
      screen.getByText(
        "O ano filtra ocorrências e produtividade, exceto anexos enviados e ocorrências sem movimentação há 7 dias",
      ),
    ).toBeInTheDocument();
  });

  it("esconde os três KPIs de usuário em produção, mas mantém o filtro de ano", () => {
    mockAmbienteDeTeste = false;
    render(<GipeResumoSection systemName="GIPE" />);

    expect(screen.queryAllByTestId("kpi-card")).toHaveLength(0);
    expect(screen.getByTestId("ano-letivo-select")).toBeInTheDocument();
  });
});
