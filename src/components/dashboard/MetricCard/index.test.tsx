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

import MetricCard from "./index";

describe("<MetricCard />", () => {
  it("sem systemName mostra 'Selecione um projeto'", () => {
    render(<MetricCard title="Indicador" />);
    expect(screen.getByText("Indicador")).toBeInTheDocument();
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
  });

  it("loading mostra skeletons", () => {
    render(<MetricCard title="Indicador" systemName="SigPAE" isLoading />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem custom e botão de retry", async () => {
    const onRetry = vi.fn();
    render(
      <MetricCard
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

  it("sucesso renderiza value, trend e comparison", () => {
    render(
      <MetricCard
        title="Indicador"
        systemName="SigPAE"
        value="8.398"
        trend="above"
        trendLabel="18% acima da média"
        comparison="média: 7.563"
      />
    );

    expect(screen.getByText("8.398")).toBeInTheDocument();
    expect(screen.getByText("18% acima da média")).toBeInTheDocument();
    expect(screen.getByText("média: 7.563")).toBeInTheDocument();
  });

  it("omite TrendBadge quando trend não for informado", () => {
    render(
      <MetricCard
        title="Indicador"
        systemName="SigPAE"
        value="8.398"
        comparison="média: 7.563"
      />
    );
    expect(screen.getByText("8.398")).toBeInTheDocument();
    expect(screen.queryByLabelText(/Tendência:/)).not.toBeInTheDocument();
  });

  it("não renderiza botão retry quando onRetry não é passado", () => {
    render(
      <MetricCard
        title="Indicador"
        systemName="SigPAE"
        isError
        errorMessage="Erro"
      />
    );
    expect(screen.getByText("Erro")).toBeInTheDocument();
    expect(screen.queryByTestId("retry-button")).not.toBeInTheDocument();
  });
});
