import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TrendBadge } from "./TrendBadge";

describe("<TrendBadge />", () => {
  it("renderiza label e aria-label", () => {
    render(<TrendBadge trend="on-average" label="Na média" />);
    const badge = screen.getByText("Na média");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("aria-label", "Tendência: Na média");
  });

  it("aplica estilo verde para trend = above", () => {
    render(<TrendBadge trend="above" label="18% acima da média" />);
    const badge = screen.getByText("18% acima da média");
    expect(badge.className).toContain("#D1FAE5");
    expect(badge.className).toContain("#075A3E");
  });

  it("aplica estilo vermelho para trend = below", () => {
    render(<TrendBadge trend="below" label="12% abaixo da média" />);
    const badge = screen.getByText("12% abaixo da média");
    expect(badge.className).toContain("#FCE7E7");
    expect(badge.className).toContain("#970C0C");
  });

  it("aplica estilo neutro para trend = on-average", () => {
    render(<TrendBadge trend="on-average" label="Na média" />);
    const badge = screen.getByText("Na média");
    expect(badge.className).toContain("#F3F4F6");
    expect(badge.className).toContain("#6B7280");
  });
});
