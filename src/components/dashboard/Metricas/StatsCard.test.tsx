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

import StatsCard from "./StatsCard";

describe("<StatsCard />", () => {
  it("sem systemName mostra 'Selecione um projeto'", () => {
    render(<StatsCard title="Indicador" />);
    expect(screen.getByText("Indicador")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    render(<StatsCard title="Indicador" systemName="SigPAE" isLoading />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem custom e botão de retry", async () => {
    const onRetry = vi.fn();
    render(
      <StatsCard
        title="Indicador"
        systemName="SigPAE"
        isError
        onRetry={onRetry}
        errorMessage="Falhou ao carregar."
      />
    );

    expect(screen.getByText("Falhou ao carregar.")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("retry-button"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("não renderiza botão retry quando onRetry não é passado", () => {
    render(
      <StatsCard title="Indicador" systemName="SigPAE" isError errorMessage="Erro" />
    );
    expect(screen.getByText("Erro")).toBeInTheDocument();
    expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
  });

  it("sucesso renderiza os itens com valor formatado em pt-BR e label", () => {
    render(
      <StatsCard
        title="Medições iniciais"
        systemName="SigPAE"
        items={[
          { label: "Aguardando envio pelas UEs", value: 4890, variant: "warning" },
          { label: "Aprovadas pelas DREs", value: 4102, variant: "success" },
        ]}
      />
    );

    expect(screen.getByText("4.890")).toBeInTheDocument();
    expect(screen.getByText("Aguardando envio pelas UEs")).toBeInTheDocument();
    expect(screen.getByText("4.102")).toBeInTheDocument();
    expect(screen.getByText("Aprovadas pelas DREs")).toBeInTheDocument();
  });

  it("aplica a cor correspondente a cada variante", () => {
    render(
      <StatsCard
        title="Indicador"
        systemName="SigPAE"
        items={[
          { label: "Neutro", value: 1, variant: "neutral" },
          { label: "Sucesso", value: 2, variant: "success" },
          { label: "Alerta", value: 3, variant: "warning" },
          { label: "Erro", value: 4, variant: "danger" },
          { label: "Cancelado", value: 5, variant: "muted" },
        ]}
      />
    );

    expect(screen.getByText("1")).toHaveStyle({ color: "#3B82F6" });
    expect(screen.getByText("2")).toHaveStyle({ color: "#075A3E" });
    expect(screen.getByText("3")).toHaveStyle({ color: "#9C6507" });
    expect(screen.getByText("4")).toHaveStyle({ color: "#970C0C" });
    expect(screen.getByText("5")).toHaveStyle({ color: "#6B7280" });
  });

  it("renderiza o slot de action no header quando informado", () => {
    render(
      <StatsCard
        title="Indicador"
        systemName="SigPAE"
        items={[]}
        action={<button data-testid="period-switcher">Período</button>}
      />
    );

    expect(screen.getByTestId("period-switcher")).toBeInTheDocument();
  });

  it("renderiza os itens em layout flex", () => {
    render(
      <StatsCard
        title="Indicador"
        systemName="SigPAE"
        items={[{ label: "Neutro", value: 1, variant: "neutral" }]}
      />
    );

    const container = screen.getByTestId("stats-card-items");
    expect(container).toHaveClass("flex");
  });

  it("bare renderiza só o conteúdo, sem o card/título", () => {
    render(
      <StatsCard
        title="Indicador"
        systemName="SigPAE"
        bare
        items={[{ label: "Neutro", value: 1, variant: "neutral" }]}
      />
    );

    expect(screen.queryByText("Indicador")).not.toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
