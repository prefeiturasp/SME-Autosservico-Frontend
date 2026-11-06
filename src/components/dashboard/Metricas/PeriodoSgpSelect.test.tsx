import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PeriodoSgpOption } from "@/types/sgpMetricas";

vi.mock("@/components/ui/select", async () => {
  const { selectNativo } = await import("@/__mocks__/selectNativo");
  return selectNativo;
});

import PeriodoSgpSelect from "./PeriodoSgpSelect";

const OPCOES: PeriodoSgpOption[] = [
  { value: "fundamental_medio:2026:0:3", label: "3º Bimestre de 2026", segmento: "fundamental_medio" },
  { value: "fundamental_medio:2026:0:4", label: "4º Bimestre de 2026", segmento: "fundamental_medio" },
  { value: "eja:2026:2:1", label: "EJA - 1º Bim. do 2º Sem. 2026", segmento: "eja" },
];

describe("<PeriodoSgpSelect />", () => {
  it("lista Fund./Médio e depois a EJA, mais recentes primeiro", () => {
    render(
      <PeriodoSgpSelect
        value="fundamental_medio:2026:0:4"
        onChange={vi.fn()}
        options={OPCOES}
      />,
    );

    expect(screen.getAllByRole("option").map((o) => o.textContent)).toEqual([
      "4º Bimestre de 2026",
      "3º Bimestre de 2026",
      "EJA - 1º Bim. do 2º Sem. 2026",
    ]);
  });

  it("omite o grupo sem opções e avisa a troca", async () => {
    const onChange = vi.fn();
    render(
      <PeriodoSgpSelect
        value="fundamental_medio:2026:0:4"
        onChange={onChange}
        options={OPCOES.slice(0, 2)}
      />,
    );

    await userEvent.selectOptions(
      screen.getByTestId("select-native"),
      "fundamental_medio:2026:0:3",
    );

    expect(onChange).toHaveBeenCalledWith("fundamental_medio:2026:0:3");
    expect(screen.queryByText(/EJA/)).not.toBeInTheDocument();
  });
});
