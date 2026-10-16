import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import RatingBadge from "./RatingBadge";

describe("<RatingBadge />", () => {
  it("renderiza letra do rating", () => {
    render(<RatingBadge rating="A" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it.each(["A", "B", "C", "D", "E"] as const)(
    "renderiza rating %s com aria-label padrão",
    (rating) => {
      render(<RatingBadge rating={rating} />);
      expect(screen.getByLabelText(`Rating ${rating}`)).toBeInTheDocument();
    },
  );

  it("usa aria-label customizado quando fornecido", () => {
    render(<RatingBadge rating="B" ariaLabel="Confiabilidade: B" />);
    expect(screen.getByLabelText("Confiabilidade: B")).toBeInTheDocument();
  });
});
