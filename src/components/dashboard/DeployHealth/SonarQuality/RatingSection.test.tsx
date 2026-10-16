import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RatingSection from "./RatingSection";

describe("<RatingSection />", () => {
  it("renderiza todos os itens com labels e ratings", () => {
    render(
      <RatingSection
        items={[
          { label: "Confiabilidade", rating: "A" },
          { label: "Segurança", rating: "C" },
          { label: "Manutenção", rating: "B" },
        ]}
      />,
    );

    expect(screen.getByText("Confiabilidade")).toBeInTheDocument();
    expect(screen.getByText("Segurança")).toBeInTheDocument();
    expect(screen.getByText("Manutenção")).toBeInTheDocument();
    expect(screen.getByLabelText("Confiabilidade: A")).toBeInTheDocument();
    expect(screen.getByLabelText("Segurança: C")).toBeInTheDocument();
    expect(screen.getByLabelText("Manutenção: B")).toBeInTheDocument();
  });

  it("renderiza lista vazia sem quebrar", () => {
    const { container } = render(<RatingSection items={[]} />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
