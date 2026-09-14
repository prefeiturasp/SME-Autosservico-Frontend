import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/ui/skeleton", () => ({
  Skeleton: (props: Readonly<React.HTMLAttributes<HTMLDivElement>>) => (
    <div data-testid="skeleton" {...props} />
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...rest
  }: Readonly<React.ButtonHTMLAttributes<HTMLButtonElement>>) => (
    <button data-testid="retry-button" {...rest}>
      {children}
    </button>
  ),
}));

import StatsGridCard from "./StatsGridCard";

describe("<StatsGridCard />", () => {
  it("sem systemName mostra 'Selecione um projeto'", () => {
    render(<StatsGridCard title="Indicador" columns={4} />);
    expect(screen.getByText("Indicador")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    render(
      <StatsGridCard title="Indicador" systemName="Sigla" columns={4} isLoading />,
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem custom e botão de retry", async () => {
    const onRetry = vi.fn();
    render(
      <StatsGridCard
        title="Indicador"
        systemName="Sigla"
        columns={4}
        isError
        onRetry={onRetry}
        errorMessage="Falhou ao carregar."
      />,
    );

    expect(screen.getByText("Falhou ao carregar.")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("retry-button"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza os itens com valor formatado em pt-BR e label", () => {
    render(
      <StatsGridCard
        title="Status geral"
        systemName="Sigla"
        columns={4}
        items={[
          { label: "Candidatos habilitados", value: 3240, variant: "neutral" },
          { label: "Candidatos convocados", value: 1980, variant: "neutral" },
        ]}
      />,
    );

    expect(screen.getByText("3.240")).toBeInTheDocument();
    expect(screen.getByText("Candidatos habilitados")).toBeInTheDocument();
    expect(screen.getByText("1.980")).toBeInTheDocument();
  });

  it("renderiza os itens num grid com a classe correspondente às colunas informadas", () => {
    render(
      <StatsGridCard
        title="Indicador"
        systemName="Sigla"
        columns={4}
        items={[{ label: "Item", value: 1, variant: "neutral" }]}
      />,
    );

    expect(screen.getByText("1").closest("div.grid")).toHaveClass(
      "grid-cols-4",
    );
  });

  it("renderiza o slot de action no header quando informado", () => {
    render(
      <StatsGridCard
        title="Indicador"
        systemName="Sigla"
        columns={4}
        items={[]}
        action={<button data-testid="period-switcher">Período</button>}
      />,
    );

    expect(screen.getByTestId("period-switcher")).toBeInTheDocument();
  });
});
