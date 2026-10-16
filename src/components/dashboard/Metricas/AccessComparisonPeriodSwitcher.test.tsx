// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";

describe("AccessComparisonPeriodSwitcher", () => {
  it("renderiza todos os períodos disponíveis", () => {
    render(<AccessComparisonPeriodSwitcher value="dia" onChange={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "Dia" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Quinzena" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Mês" })).toBeInTheDocument();
    expect(screen.getByRole("radio", { name: "Trimestre" })).toBeInTheDocument();
  });

  it("marca o período selecionado como checked", () => {
    render(
      <AccessComparisonPeriodSwitcher value="trimestre" onChange={vi.fn()} />
    );

    expect(screen.getByRole("radio", { name: "Trimestre" })).toBeChecked();
    expect(screen.getByRole("radio", { name: "Dia" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Quinzena" })).not.toBeChecked();
    expect(screen.getByRole("radio", { name: "Mês" })).not.toBeChecked();
  });

  it("exibe o fieldset com legend acessível", () => {
    render(<AccessComparisonPeriodSwitcher value="dia" onChange={vi.fn()} />);

    expect(
      screen.getByRole("group", { name: "Selecionar período de comparação" })
    ).toBeInTheDocument();
  });

  it("chama onChange com o valor correto ao selecionar um período", async () => {
    const onChange = vi.fn();
    render(<AccessComparisonPeriodSwitcher value="dia" onChange={onChange} />);

    await userEvent.setup().click(screen.getByRole("radio", { name: "Mês" }));

    expect(onChange).toHaveBeenCalledWith("mes");
  });

  it("aceita name customizado para o grupo de rádios", () => {
    render(
      <AccessComparisonPeriodSwitcher
        value="dia"
        onChange={vi.fn()}
        name="custom-period"
      />
    );

    const radios = screen.getAllByRole("radio");
    radios.forEach((radio) => {
      expect(radio).toHaveAttribute("name", "custom-period");
    });
  });
});
