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

import DreSelect from "./DreSelect";

describe("<DreSelect />", () => {
  it("renderiza a opção 'Todas as DREs' e as 13 DREs", () => {
    render(<DreSelect value="all" onChange={vi.fn()} />);

    expect(
      screen.getByRole("option", { name: "Todas as DREs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", { name: "DRE Butantã" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(14);
  });

  it("mostra o valor selecionado", () => {
    render(<DreSelect value="butanta" onChange={vi.fn()} />);
    expect(screen.getByTestId("select-native")).toHaveValue("butanta");
  });

  it("chama onChange com o valor correto ao selecionar outra DRE", async () => {
    const onChange = vi.fn();
    render(<DreSelect value="all" onChange={onChange} />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "ipiranga");

    expect(onChange).toHaveBeenCalledWith("ipiranga");
  });
});
