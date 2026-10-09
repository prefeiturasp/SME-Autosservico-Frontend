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

import UeSelect from "./UeSelect";

const UNIDADES = [
  { value: "019715", label: "EMEF ADALGIZA SEGURADO DA SILVEIRA, PROFA." },
  { value: "019749", label: "EMEF ADOLFINO DE ARRUDA CASTANHO, PROF." },
];

describe("<UeSelect />", () => {
  it("renderiza a opção 'Todas as UEs' e as UEs recebidas", () => {
    render(<UeSelect value="all" options={UNIDADES} onChange={vi.fn()} />);

    expect(
      screen.getByRole("option", { name: "Todas as UEs" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("option", {
        name: "EMEF ADALGIZA SEGURADO DA SILVEIRA, PROFA.",
      }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("mostra o valor selecionado", () => {
    render(<UeSelect value="019715" options={UNIDADES} onChange={vi.fn()} />);
    expect(screen.getByTestId("select-native")).toHaveValue("019715");
  });

  it("chama onChange com o valor correto ao selecionar outra UE", async () => {
    const onChange = vi.fn();
    render(<UeSelect value="all" options={UNIDADES} onChange={onChange} />);

    await userEvent.selectOptions(screen.getByTestId("select-native"), "019749");

    expect(onChange).toHaveBeenCalledWith("019749");
  });
});
