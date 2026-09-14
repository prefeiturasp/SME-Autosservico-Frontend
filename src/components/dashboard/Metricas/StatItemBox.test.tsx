import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatItemBox from "./StatItemBox";

describe("<StatItemBox />", () => {
  it("renderiza o valor formatado em pt-BR, o label e a cor da variante", () => {
    render(<StatItemBox item={{ label: "UPs cadastradas", value: 4890, variant: "warning" }} />);

    expect(screen.getByText("4.890")).toBeInTheDocument();
    expect(screen.getByText("UPs cadastradas")).toBeInTheDocument();
    expect(screen.getByText("4.890")).toHaveStyle({ color: "#9C6507" });
  });

  it("com format 'currency', formata o valor como moeda em pt-BR", () => {
    render(
      <StatItemBox
        item={{
          label: "Créditos disponíveis para as UEs",
          value: 197248412.27,
          variant: "success",
          format: "currency",
        }}
      />,
    );

    expect(screen.getByText("R$ 197.248.412,27")).toBeInTheDocument();
  });

  it("com format 'days', formata o valor com o sufixo 'dias'", () => {
    render(
      <StatItemBox
        item={{
          label: "Tempo médio de resolução",
          value: 6.4,
          variant: "neutral",
          format: "days",
        }}
      />,
    );

    expect(screen.getByText("6,4 dias")).toBeInTheDocument();
  });

  it("com trend e trendLabel, renderiza o selo de tendência", () => {
    render(
      <StatItemBox
        item={{
          label: "Tempo médio de resolução",
          value: 6.4,
          variant: "neutral",
          format: "days",
          trend: "above",
          trendLabel: "14% mais rápido nos últimos 30 dias",
        }}
      />,
    );

    expect(
      screen.getByText("14% mais rápido nos últimos 30 dias"),
    ).toBeInTheDocument();
  });

  it("sem trend/trendLabel, não renderiza o selo de tendência", () => {
    render(
      <StatItemBox
        item={{ label: "UPs cadastradas", value: 4890, variant: "warning" }}
      />,
    );

    expect(screen.queryByLabelText(/Tendência/)).not.toBeInTheDocument();
  });

  it("aceita className extra pra customizar a caixa em contextos específicos", () => {
    render(
      <StatItemBox
        item={{ label: "UPs cadastradas", value: 4890, variant: "warning" }}
        className="max-h-[74px]"
      />,
    );

    expect(screen.getByText("4.890").parentElement).toHaveClass(
      "max-h-[74px]",
      "rounded-md",
    );
  });
});
