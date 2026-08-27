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

import SimpleListCard from "./SimpleListCard";

describe("<SimpleListCard />", () => {
  it("sem systemName mostra 'Selecione um projeto'", () => {
    render(<SimpleListCard title="Indicador" />);
    expect(screen.getByText("Indicador")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    render(
      <SimpleListCard title="Indicador" systemName="Rolê Agroecológico" isLoading />
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem custom e botão de retry", async () => {
    const onRetry = vi.fn();
    render(
      <SimpleListCard
        title="Indicador"
        systemName="Rolê Agroecológico"
        isError
        onRetry={onRetry}
        errorMessage="Falhou ao carregar."
      />
    );

    expect(screen.getByText("Falhou ao carregar.")).toBeInTheDocument();
    await userEvent.click(screen.getByTestId("retry-button"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("sucesso renderiza todos os itens sem truncar quando initialVisibleItems não é informado", () => {
    render(
      <SimpleListCard
        title="Lista de UPs que receberam visita"
        systemName="Rolê Agroecológico"
        items={["Sítio Boa Esperança", "Horta Comunitária Jardim das Rosas"]}
      />
    );

    expect(screen.getByText("Sítio Boa Esperança")).toBeInTheDocument();
    expect(screen.getByText("Horta Comunitária Jardim das Rosas")).toBeInTheDocument();
    expect(screen.queryByText("Ver mais")).not.toBeInTheDocument();
  });

  const UPS = [
    "Sítio Boa Esperança",
    "Horta Comunitária Jardim das Rosas",
    "Fazenda Escola Vale Verde",
    "Sítio Recanto Agroecológico",
    "Horta Comunitária Parque Novo Mundo",
    "Chácara Sementes do Amanhã",
    "Horta Escolar Vila Nova",
  ];

  it("com initialVisibleItems, trunca e mostra botão 'ver mais'", async () => {
    render(
      <SimpleListCard
        title="Lista de UPs que receberam visita"
        systemName="Rolê Agroecológico"
        items={UPS}
        initialVisibleItems={5}
        expandLabel="Ver mais UPs"
        collapseLabel="Ver menos UPs"
      />
    );

    expect(screen.getByText("Horta Comunitária Parque Novo Mundo")).toBeInTheDocument();
    expect(screen.queryByText("Chácara Sementes do Amanhã")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Ver mais UPs"));

    expect(screen.getByText("Chácara Sementes do Amanhã")).toBeInTheDocument();
    expect(screen.getByText("Horta Escolar Vila Nova")).toBeInTheDocument();
    expect(screen.getByText("Ver menos UPs")).toBeInTheDocument();
  });

  it("não mostra botão de expandir quando items cabe no initialVisibleItems", () => {
    render(
      <SimpleListCard
        title="Indicador"
        systemName="Rolê Agroecológico"
        items={["Único"]}
        initialVisibleItems={5}
      />
    );
    expect(screen.queryByText("Ver mais")).not.toBeInTheDocument();
  });

  it("renderiza o slot de action no header quando informado", () => {
    render(
      <SimpleListCard
        title="Indicador"
        systemName="Rolê Agroecológico"
        items={[]}
        action={<button data-testid="period-switcher">Período</button>}
      />
    );

    expect(screen.getByTestId("period-switcher")).toBeInTheDocument();
  });

  it("bare renderiza sem o card externo, mas com o título dentro da caixa da lista", () => {
    render(
      <SimpleListCard
        title="Lista de UPs que receberam visita"
        systemName="Rolê Agroecológico"
        items={["Sítio Boa Esperança"]}
        bare
      />
    );

    expect(
      screen.getByText("Lista de UPs que receberam visita"),
    ).toBeInTheDocument();
    expect(screen.getByText("Sítio Boa Esperança")).toBeInTheDocument();
  });
});
