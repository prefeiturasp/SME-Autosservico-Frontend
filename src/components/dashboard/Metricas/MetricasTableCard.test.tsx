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

import MetricasTableCard from "./MetricasTableCard";

describe("<MetricasTableCard />", () => {
  it("sem systemName mostra 'Selecione um projeto'", () => {
    render(
      <MetricasTableCard
        title="Indicador"
        firstColumnLabel="Tipo"
        secondColumnLabel="Quantidade"
      />
    );
    expect(screen.getByText("Indicador")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    render(
      <MetricasTableCard
        title="Indicador"
        systemName="Intranet"
        firstColumnLabel="Tipo"
        secondColumnLabel="Quantidade"
        isLoading
      />
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem custom e botão de retry", async () => {
    const onRetry = vi.fn();
    render(
      <MetricasTableCard
        title="Indicador"
        systemName="Intranet"
        firstColumnLabel="Tipo"
        secondColumnLabel="Quantidade"
        isError
        onRetry={onRetry}
        errorMessage="Falhou ao carregar."
      />
    );

    expect(screen.getByText("Falhou ao carregar.")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("retry-button"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza cabeçalho e linhas da tabela", () => {
    render(
      <MetricasTableCard
        title="Resultados de sorteios por tipo"
        systemName="Intranet"
        firstColumnLabel="Tipo de sorteio"
        secondColumnLabel="Quantidade"
        rows={[
          { label: "Premiação", value: 254 },
          { label: "Data específica", value: 124 },
          { label: "Período", value: 57 },
        ]}
      />
    );

    expect(screen.getByText("Tipo de sorteio")).toBeInTheDocument();
    expect(screen.getByText("Quantidade")).toBeInTheDocument();
    expect(screen.getByText("Premiação")).toBeInTheDocument();
    expect(screen.getByText("254")).toBeInTheDocument();
    expect(screen.getByText("124")).toBeInTheDocument();
    expect(screen.getByText("57")).toBeInTheDocument();
    expect(screen.queryByText("Ver mais")).not.toBeInTheDocument();
  });

  const DRE_ROWS = [
    { label: "Capela do Socorro", value: 15 },
    { label: "Freguesia/Brasilândia", value: 11 },
    { label: "Ipiranga", value: 12 },
    { label: "Butantã", value: 9 },
    { label: "Guaianases", value: 8 },
    { label: "Campo Limpo", value: 7 },
    { label: "Itaquera", value: 7 },
  ];

  it("com initialVisibleRows, trunca e mostra botão 'ver mais'", async () => {
    render(
      <MetricasTableCard
        title="Inscrições em sorteios por DRE"
        systemName="Intranet"
        firstColumnLabel="DRE"
        secondColumnLabel="Inscrições"
        rows={DRE_ROWS}
        initialVisibleRows={5}
        expandLabel="Ver mais DREs"
        collapseLabel="Ver menos DREs"
      />
    );

    expect(screen.getByText("Guaianases")).toBeInTheDocument();
    expect(screen.queryByText("Campo Limpo")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais DREs"));

    expect(screen.getByText("Campo Limpo")).toBeInTheDocument();
    expect(screen.getByText("Itaquera")).toBeInTheDocument();
    expect(screen.getByText("Ver menos DREs")).toBeInTheDocument();
  });

  it("não mostra botão de expandir quando rows cabe no initialVisibleRows", () => {
    render(
      <MetricasTableCard
        title="Indicador"
        systemName="Intranet"
        firstColumnLabel="Tipo"
        secondColumnLabel="Quantidade"
        rows={[{ label: "Único", value: 1 }]}
        initialVisibleRows={5}
      />
    );
    expect(screen.queryByText("Ver mais")).not.toBeInTheDocument();
  });

  it("renderiza o slot de action no header quando informado", () => {
    render(
      <MetricasTableCard
        title="Indicador"
        systemName="Intranet"
        firstColumnLabel="Tipo"
        secondColumnLabel="Quantidade"
        rows={[]}
        action={<button data-testid="period-switcher">Período</button>}
      />
    );

    expect(screen.getByTestId("period-switcher")).toBeInTheDocument();
  });

  it("bare renderiza sem o card externo, mas com o título dentro da caixa da tabela", () => {
    render(
      <MetricasTableCard
        title="Inscrições em sorteios por DRE"
        systemName="Intranet"
        firstColumnLabel="DRE"
        secondColumnLabel="Inscrições"
        rows={[{ label: "Ipiranga", value: 12 }]}
        bare
      />
    );

    expect(
      screen.getByText("Inscrições em sorteios por DRE"),
    ).toBeInTheDocument();
    expect(screen.getByText("Ipiranga")).toBeInTheDocument();
  });
});
