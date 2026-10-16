import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import SonarMetricCard from "./SonarMetricCard";

describe("<SonarMetricCard />", () => {
  it("renderiza label e valor", () => {
    render(<SonarMetricCard label="Bugs" value="12" />);
    expect(screen.getByText("Bugs")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("renderiza helperText quando fornecido", () => {
    render(<SonarMetricCard label="Cobertura" value="80%" helperText="Mínimo: 80%" />);
    expect(screen.getByText("Mínimo: 80%")).toBeInTheDocument();
  });

  it("renderiza RatingBadge quando rating é fornecido", () => {
    render(<SonarMetricCard label="Bugs" value="0" rating="A" />);
    expect(screen.getByLabelText("Rating A")).toBeInTheDocument();
  });

  it("não renderiza RatingBadge quando rating é omitido", () => {
    render(<SonarMetricCard label="Bugs" value="0" />);
    expect(screen.queryByLabelText(/Rating/)).not.toBeInTheDocument();
  });
});
