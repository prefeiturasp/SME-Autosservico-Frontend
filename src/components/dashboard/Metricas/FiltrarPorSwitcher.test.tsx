// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import FiltrarPorSwitcher from "./FiltrarPorSwitcher";

describe("FiltrarPorSwitcher", () => {
  it("renderiza as 2 opções disponíveis", () => {
    render(<FiltrarPorSwitcher value="periodo" onChange={vi.fn()} />);

    expect(screen.getByRole("radio", { name: "Período" })).toBeInTheDocument();
    expect(
      screen.getByRole("radio", { name: "Intervalo de datas" }),
    ).toBeInTheDocument();
  });

  it("marca a opção selecionada como checked", () => {
    render(<FiltrarPorSwitcher value="intervalo" onChange={vi.fn()} />);

    expect(
      screen.getByRole("radio", { name: "Intervalo de datas" }),
    ).toBeChecked();
    expect(screen.getByRole("radio", { name: "Período" })).not.toBeChecked();
  });

  it("chama onChange com o valor correto ao selecionar uma opção", async () => {
    const onChange = vi.fn();
    render(<FiltrarPorSwitcher value="periodo" onChange={onChange} />);

    await userEvent
      .setup()
      .click(screen.getByRole("radio", { name: "Intervalo de datas" }));

    expect(onChange).toHaveBeenCalledWith("intervalo");
  });
});
