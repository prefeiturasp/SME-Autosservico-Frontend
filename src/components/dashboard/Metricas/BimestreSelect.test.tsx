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

import BimestreSelect from "./BimestreSelect";

describe("<BimestreSelect />", () => {
  it("renderiza todas as opções de bimestre", () => {
    render(<BimestreSelect value="2026-2" onChange={vi.fn()} />);

    expect(
      screen.getByRole("option", { name: "2º Bimestre de 2026" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "1º Bimestre de 2026" })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(4);
  });

  it("mostra o valor selecionado", () => {
    render(<BimestreSelect value="2026-1" onChange={vi.fn()} />);
    expect(screen.getByTestId("select-native")).toHaveValue("2026-1");
  });

  it("chama onChange com o valor correto ao selecionar outro bimestre", async () => {
    const onChange = vi.fn();
    render(<BimestreSelect value="2026-2" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "2025-4");

    expect(onChange).toHaveBeenCalledWith("2025-4");
  });
});
