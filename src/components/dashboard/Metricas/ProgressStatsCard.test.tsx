import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
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

import ProgressStatsCard from "./ProgressStatsCard";

describe("<ProgressStatsCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("sem systemName mostra placeholder", () => {
    render(<ProgressStatsCard title="Frequências lançadas" />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("renderiza o título recebido", () => {
    render(<ProgressStatsCard title="Frequências lançadas" systemName="SGP" />);
    expect(screen.getByText("Frequências lançadas")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    render(
      <ProgressStatsCard title="Frequências lançadas" systemName="SGP" isLoading />,
    );
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const onRetry = vi.fn();
    render(
      <ProgressStatsCard
        title="Frequências lançadas"
        systemName="SGP"
        isError
        onRetry={onRetry}
        errorMessage="Não foi possível carregar as frequências lançadas."
      />,
    );

    expect(
      screen.getByText("Não foi possível carregar as frequências lançadas."),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("percentual <= 100 mostra só o segmento azul-marinho, sem o segmento laranja", () => {
    render(
      <ProgressStatsCard
        title="Sondagens realizadas"
        systemName="SGP"
        items={[
          { label: "Sondagens realizadas", value: 1243, variant: "neutral" },
          { label: "Sondagens esperadas", value: 2683, variant: "muted" },
        ]}
        progressPercentage={62.3}
      />,
    );

    expect(screen.getByText("1.243")).toBeInTheDocument();
    expect(screen.getByText("2.683")).toBeInTheDocument();
    expect(screen.getByText("62,3%")).toBeInTheDocument();
    expect(screen.getByTestId("progress-stats-fill")).toHaveStyle({
      width: "62.30%",
      backgroundColor: "#1E3A8A",
    });
    expect(screen.queryByTestId("progress-stats-fill-over")).not.toBeInTheDocument();
    expect(screen.getByText("62,3%")).toHaveStyle({ color: "#3B82F6" });
  });

  it("percentual > 100 mostra o segmento azul (100), o laranja (10) e sobra cinza (10), numa escala de 120", () => {
    render(
      <ProgressStatsCard
        title="Frequências lançadas"
        systemName="SGP"
        items={[
          { label: "Lançadas", value: 18432, variant: "neutral" },
          { label: "Esperadas", value: 21760, variant: "muted" },
        ]}
        progressPercentage={122.3}
      />,
    );

    expect(screen.getByText("122,3%")).toBeInTheDocument();
    expect(screen.getByTestId("progress-stats-fill")).toHaveStyle({
      width: "83.33%",
      backgroundColor: "#1E3A8A",
    });
    expect(screen.getByTestId("progress-stats-fill-over")).toHaveStyle({
      width: "8.33%",
      backgroundColor: "#F59E0B",
    });
    expect(screen.getByText("122,3%")).toHaveStyle({ color: "#F59E0B" });
  });

  it("bare renderiza só o conteúdo, sem o card/título", () => {
    render(
      <ProgressStatsCard
        title="Vivências com refeição"
        systemName="Rolê Agroecológico"
        bare
        items={[
          { label: "Vivências que incluíram refeição", value: 156, variant: "neutral" },
        ]}
        progressPercentage={84.8}
      />,
    );

    expect(screen.queryByText("Vivências com refeição")).not.toBeInTheDocument();
    expect(screen.getByText("156")).toBeInTheDocument();
    expect(screen.getByText("84,8%")).toBeInTheDocument();
  });
});
