import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import MetricasSectionHeader from "./MetricasSectionHeader";

describe("<MetricasSectionHeader />", () => {
  it("renderiza o título como heading", () => {
    render(<MetricasSectionHeader title="Alimentação Terceirizada" />);
    expect(
      screen.getByRole("heading", { name: "Alimentação Terceirizada" })
    ).toBeInTheDocument();
  });
});
