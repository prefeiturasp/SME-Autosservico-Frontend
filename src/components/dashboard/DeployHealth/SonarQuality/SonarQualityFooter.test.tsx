import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SonarQualityFooter from "./SonarQualityFooter";

describe("<SonarQualityFooter />", () => {
  it("formata problemas aceitos e linhas sem cobertura abaixo de 1000", () => {
    render(<SonarQualityFooter acceptedIssues={42} uncoveredLines={500} />);
    expect(screen.getByText("42 problemas aceitos")).toBeInTheDocument();
    expect(screen.getByText(/500 linhas sem cobertura/)).toBeInTheDocument();
  });

  it("formata linhas sem cobertura em 'k' quando >= 1000", () => {
    render(<SonarQualityFooter acceptedIssues={0} uncoveredLines={12345} />);
    expect(screen.getByText(/12,3k linhas sem cobertura/)).toBeInTheDocument();
  });

  it("formata exatamente 1000 como 1k", () => {
    render(<SonarQualityFooter acceptedIssues={0} uncoveredLines={1000} />);
    expect(screen.getByText(/1k linhas sem cobertura/)).toBeInTheDocument();
  });
});
