import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: Readonly<{
    children: React.ReactNode;
    value: string;
    onValueChange: (value: string) => void;
  }>) => (
    <select
      data-testid="select-native"
      value={value}
      onChange={(event) => onValueChange(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: () => null,
  SelectValue: () => null,
  SelectContent: ({ children }: Readonly<{ children: React.ReactNode }>) => (
    <>{children}</>
  ),
  SelectItem: ({
    value,
    children,
  }: Readonly<{ value: string; children: React.ReactNode }>) => (
    <option value={value}>{children}</option>
  ),
}));

import PeriodoLetivoSelect from "./PeriodoLetivoSelect";

describe("<PeriodoLetivoSelect />", () => {
  it("renderiza os períodos recebidos", () => {
    render(
      <PeriodoLetivoSelect
        value="2026.3"
        options={["2026.3", "2026.2"]}
        onChange={vi.fn()}
      />,
    );

    expect(
      screen.getByRole("option", { name: "Período 2026.3" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(2);
  });

  it("mostra o valor selecionado", () => {
    render(
      <PeriodoLetivoSelect
        value="2026.2"
        options={["2026.3", "2026.2"]}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByTestId("select-native")).toHaveValue("2026.2");
  });

  it("chama onChange com o valor correto ao selecionar outro período", async () => {
    const onChange = vi.fn();
    render(
      <PeriodoLetivoSelect
        value="2026.3"
        options={["2026.3", "2026.2"]}
        onChange={onChange}
      />,
    );

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2026.2");

    expect(onChange).toHaveBeenCalledWith("2026.2");
  });
});
