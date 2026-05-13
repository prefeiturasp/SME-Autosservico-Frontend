import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import QualityGateHeader from "./QualityGateHeader";

describe("<QualityGateHeader />", () => {
  it("status OK → mostra 'Aprovado' + badge 'Critérios sem falhas'", () => {
    render(
      <QualityGateHeader status="OK" failedCount={0} lastAnalysisAt="2026-05-12T10:00:00+0000" />,
    );
    expect(screen.getByText("Avaliação de qualidade")).toBeInTheDocument();
    expect(screen.getByText("Aprovado")).toBeInTheDocument();
    expect(screen.getByText("Critérios sem falhas")).toBeInTheDocument();
  });

  it("status ERROR + múltiplas falhas → mostra 'Reprovado' + badge plural", () => {
    render(<QualityGateHeader status="ERROR" failedCount={3} />);
    expect(screen.getByText("Reprovado")).toBeInTheDocument();
    expect(screen.getByText("3 critérios com falhas")).toBeInTheDocument();
  });

  it("status ERROR + 1 falha → badge singular", () => {
    render(<QualityGateHeader status="ERROR" failedCount={1} />);
    expect(screen.getByText("1 critério com falha")).toBeInTheDocument();
  });

  it("mostra '—' quando não há data de análise", () => {
    render(<QualityGateHeader status="OK" failedCount={0} />);
    expect(screen.getByText(/Última análise:/)).toBeInTheDocument();
    expect(screen.getByText(/—/)).toBeInTheDocument();
  });

  it("mostra última análise em formato relativo", () => {
    const longAgo = new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString();
    render(<QualityGateHeader status="OK" failedCount={0} lastAnalysisAt={longAgo} />);
    expect(screen.getByText(/há 14 horas/)).toBeInTheDocument();
  });

  it("mostra a branch consultada quando informada", () => {
    render(<QualityGateHeader status="OK" failedCount={0} branch="main" />);
    expect(screen.getByText("Branch: main")).toBeInTheDocument();
  });

  it("omite linha de branch quando não há branch", () => {
    render(<QualityGateHeader status="OK" failedCount={0} />);
    expect(screen.queryByText(/Branch:/)).not.toBeInTheDocument();
  });
});
