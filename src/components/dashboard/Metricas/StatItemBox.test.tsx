import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatItemBox from "./StatItemBox";

describe("<StatItemBox />", () => {
  it("renderiza o valor formatado em pt-BR, o label e a cor da variante", () => {
    render(<StatItemBox item={{ label: "UPs cadastradas", value: 4890, variant: "warning" }} />);

    expect(screen.getByText("4.890")).toBeInTheDocument();
    expect(screen.getByText("UPs cadastradas")).toBeInTheDocument();
    expect(screen.getByText("4.890")).toHaveStyle({ color: "#9C6507" });
  });

  it("aceita className extra pra customizar a caixa em contextos específicos", () => {
    render(
      <StatItemBox
        item={{ label: "UPs cadastradas", value: 4890, variant: "warning" }}
        className="max-h-[74px]"
      />,
    );

    expect(screen.getByText("4.890").parentElement).toHaveClass(
      "max-h-[74px]",
      "rounded-md",
    );
  });
});
