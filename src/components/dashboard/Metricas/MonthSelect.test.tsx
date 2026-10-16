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

import MonthSelect from "./MonthSelect";

describe("<MonthSelect />", () => {
  it("renderiza todas as opções de mês", () => {
    render(<MonthSelect value="2026-07" onChange={vi.fn()} />);

    expect(
      screen.getByRole("option", { name: "Julho/2026" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "Fevereiro/2026" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(6);
  });

  it("mostra o valor selecionado", () => {
    render(<MonthSelect value="2026-05" onChange={vi.fn()} />);
    expect(screen.getByTestId("select-native")).toHaveValue("2026-05");
  });

  it("chama onChange com o valor correto ao selecionar outro mês", async () => {
    const onChange = vi.fn();
    render(<MonthSelect value="2026-07" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2026-03");

    expect(onChange).toHaveBeenCalledWith("2026-03");
  });
});
