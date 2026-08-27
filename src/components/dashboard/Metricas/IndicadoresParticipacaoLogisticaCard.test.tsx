import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { StatsCardResponse } from "@/types/metricas";

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

vi.mock("./VivenciasComRefeicaoCard", () => ({
  __esModule: true,
  default: ({
    systemName,
    bare,
  }: {
    systemName?: string;
    bare?: boolean;
  }) => (
    <div data-testid="vivencias-com-refeicao-card">
      {systemName ?? ""}::{bare ? "bare" : "full"}
    </div>
  ),
}));

vi.mock("./UesParticipantesPorDreCard", () => ({
  __esModule: true,
  default: ({
    systemName,
    bare,
  }: {
    systemName?: string;
    bare?: boolean;
  }) => (
    <div data-testid="ues-participantes-por-dre-card">
      {systemName ?? ""}::{bare ? "bare" : "full"}
    </div>
  ),
}));

type MockQueryResult = {
  data?: StatsCardResponse;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
};

let mockQueryResult: MockQueryResult = {
  data: undefined,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: vi.fn(),
};

vi.mock("@/hooks/useIndicadoresParticipacaoLogistica", () => ({
  useIndicadoresParticipacaoLogistica: () => mockQueryResult,
}));

import IndicadoresParticipacaoLogisticaCard from "./IndicadoresParticipacaoLogisticaCard";

const SEVEN_ITEMS: StatsCardResponse["items"] = [
  { label: "Vivências realizadas", value: 184, variant: "neutral" },
  { label: "Estudantes que participaram das vivências", value: 4453, variant: "neutral" },
  { label: "Estudantes inscritos nas vivências", value: 5862, variant: "neutral" },
  { label: "Participantes que participam das vivências", value: 12398, variant: "success" },
  { label: "Educadores que participaram das vivências", value: 6853, variant: "success" },
  { label: "Refeições para estudantes", value: 6853, variant: "neutral" },
  { label: "Kits distribuídos", value: 12398, variant: "neutral" },
];

describe("<IndicadoresParticipacaoLogisticaCard />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockQueryResult = {
      data: undefined,
      isLoading: false,
      isFetching: false,
      isError: false,
      refetch: vi.fn(),
    };
  });

  it("sem systemName mostra um único placeholder", () => {
    render(<IndicadoresParticipacaoLogisticaCard />);
    expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    expect(
      screen.queryByTestId("vivencias-com-refeicao-card"),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByTestId("ues-participantes-por-dre-card"),
    ).not.toBeInTheDocument();
  });

  it("loading mostra skeletons dos indicadores", () => {
    mockQueryResult = { ...mockQueryResult, isLoading: true };
    render(<IndicadoresParticipacaoLogisticaCard systemName="Rolê Agroecológico" />);
    expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(1);
  });

  it("erro mostra mensagem e botão de retry", async () => {
    const refetch = vi.fn();
    mockQueryResult = { ...mockQueryResult, isError: true, refetch };
    render(<IndicadoresParticipacaoLogisticaCard systemName="Rolê Agroecológico" />);

    expect(
      screen.getByText(
        "Não foi possível carregar os indicadores de participação e logística.",
      ),
    ).toBeInTheDocument();

    await userEvent.click(screen.getByTestId("retry-button"));
    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("sucesso divide os 7 indicadores em 2 fileiras full-width (4 + 3) com as cores certas", () => {
    mockQueryResult = { ...mockQueryResult, data: { items: SEVEN_ITEMS } };
    render(<IndicadoresParticipacaoLogisticaCard systemName="Rolê Agroecológico" />);

    const firstRow = screen.getByText("184").closest(".grid");
    expect(firstRow).toHaveClass("grid-cols-4");
    expect(firstRow).toHaveTextContent("184");
    expect(firstRow).toHaveTextContent("4.453");
    expect(firstRow).toHaveTextContent("5.862");
    expect(firstRow).toHaveTextContent("12.398");

    const secondRow = screen.getAllByText("6.853")[0].closest(".grid");
    expect(secondRow).toHaveClass("grid-cols-3");
    expect(secondRow).not.toBe(firstRow);

    // "Participantes..." (row 1) e "Educadores..." (row 2) são success (verde);
    // "Kits distribuídos" (row 2, também 12.398) e "Refeições..." (row 2, também 6.853) são neutral (azul).
    expect(screen.getAllByText("12.398")[0]).toHaveStyle({ color: "#075A3E" });
    expect(screen.getAllByText("12.398")[1]).toHaveStyle({ color: "#3B82F6" });
    expect(screen.getAllByText("6.853")[0]).toHaveStyle({ color: "#075A3E" });
    expect(screen.getAllByText("6.853")[1]).toHaveStyle({ color: "#3B82F6" });
    expect(screen.getByText("184")).toHaveStyle({ color: "#3B82F6" });
  });

  it("propaga systemName em modo bare pros sub-cards de vivências e DRE", () => {
    mockQueryResult = { ...mockQueryResult, data: { items: SEVEN_ITEMS } };
    render(<IndicadoresParticipacaoLogisticaCard systemName="Rolê Agroecológico" />);

    expect(screen.getByTestId("vivencias-com-refeicao-card")).toHaveTextContent(
      "Rolê Agroecológico::bare",
    );
    expect(
      screen.getByTestId("ues-participantes-por-dre-card"),
    ).toHaveTextContent("Rolê Agroecológico::bare");
  });
});
