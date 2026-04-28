import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PeakStatusBadge } from "./PeakStatusBadge";

describe("<PeakStatusBadge />", () => {
  it("renderiza rótulo 'Em pico' com cores verdes para status = peak", () => {
    render(<PeakStatusBadge status="peak" />);
    const badge = screen.getByText("Em pico");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("aria-label", "Status de pico: Em pico");
    expect(badge.className).toContain("#D1FAE5");
    expect(badge.className).toContain("#065F46");
  });

  it("renderiza rótulo 'Fora de pico' com cores âmbar para status = off-peak", () => {
    render(<PeakStatusBadge status="off-peak" />);
    const badge = screen.getByText("Fora de pico");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveAttribute("aria-label", "Status de pico: Fora de pico");
    expect(badge.className).toContain("#FEF3C7");
    expect(badge.className).toContain("#92400E");
  });
});
