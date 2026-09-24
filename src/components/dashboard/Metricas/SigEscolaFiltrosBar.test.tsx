import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";

vi.mock("./FiltrarPorSwitcher", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (next: string) => void;
  }) => (
    <button
      type="button"
      data-testid="filtrar-por-switcher"
      onClick={() => onChange("intervalo")}
    >
      {value}
    </button>
  ),
}));

vi.mock("./PeriodoLetivoSelect", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (next: string) => void;
  }) => (
    <button
      type="button"
      data-testid="periodo-letivo-select"
      onClick={() => onChange("2025.1")}
    >
      {value}
    </button>
  ),
}));

vi.mock("./IntervaloDeDatasInput", () => ({
  __esModule: true,
  default: ({
    dataInicio,
    dataFim,
    onChangeDataInicio,
    onChangeDataFim,
  }: {
    dataInicio: string;
    dataFim: string;
    onChangeDataInicio: (next: string) => void;
    onChangeDataFim: (next: string) => void;
  }) => (
    <div data-testid="intervalo-de-datas-input">
      <span>{dataInicio}</span>
      <span>{dataFim}</span>
      <button type="button" onClick={() => onChangeDataInicio("2026-02-01")}>
        mudar data inicial
      </button>
      <button type="button" onClick={() => onChangeDataFim("2026-03-01")}>
        mudar data final
      </button>
    </div>
  ),
}));

vi.mock("./DreSelect", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (next: string) => void;
  }) => (
    <button
      type="button"
      data-testid="dre-select"
      onClick={() => onChange("butanta")}
    >
      {value}
    </button>
  ),
}));

vi.mock("./UeSelect", () => ({
  __esModule: true,
  default: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (next: string) => void;
  }) => (
    <button
      type="button"
      data-testid="ue-select"
      onClick={() => onChange("cemei-morumbi")}
    >
      {value}
    </button>
  ),
}));

import SigEscolaFiltrosBar from "./SigEscolaFiltrosBar";

const BASE_FILTROS: SigEscolaFiltros = {
  modo: "periodo",
  periodo: "2026.2",
  dataInicio: "2026-01-01",
  dataFim: "2026-09-22",
  dre: "all",
  ue: "all",
};

describe("<SigEscolaFiltrosBar />", () => {
  let onChange: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    onChange = vi.fn();
  });

  it("mostra o select de período quando modo é 'periodo'", () => {
    render(<SigEscolaFiltrosBar value={BASE_FILTROS} onChange={onChange} />);

    expect(screen.getByTestId("periodo-letivo-select")).toBeInTheDocument();
    expect(
      screen.queryByTestId("intervalo-de-datas-input"),
    ).not.toBeInTheDocument();
  });

  it("mostra os inputs de intervalo de datas quando modo é 'intervalo'", () => {
    render(
      <SigEscolaFiltrosBar
        value={{ ...BASE_FILTROS, modo: "intervalo" }}
        onChange={onChange}
      />,
    );

    expect(screen.getByTestId("intervalo-de-datas-input")).toBeInTheDocument();
    expect(
      screen.queryByTestId("periodo-letivo-select"),
    ).not.toBeInTheDocument();
  });

  it("propaga a troca de modo mesclando o restante dos filtros", async () => {
    render(<SigEscolaFiltrosBar value={BASE_FILTROS} onChange={onChange} />);

    await userEvent.click(screen.getByTestId("filtrar-por-switcher"));

    expect(onChange).toHaveBeenCalledTimes(1);
    const updater = onChange.mock.calls[0][0];
    expect(updater(BASE_FILTROS)).toEqual({ ...BASE_FILTROS, modo: "intervalo" });
  });

  it("propaga a troca de DRE mesclando o restante dos filtros", async () => {
    render(<SigEscolaFiltrosBar value={BASE_FILTROS} onChange={onChange} />);

    await userEvent.click(screen.getByTestId("dre-select"));

    const updater = onChange.mock.calls[0][0];
    expect(updater(BASE_FILTROS)).toEqual({ ...BASE_FILTROS, dre: "butanta" });
  });

  it("propaga a troca de UE mesclando o restante dos filtros", async () => {
    render(<SigEscolaFiltrosBar value={BASE_FILTROS} onChange={onChange} />);

    await userEvent.click(screen.getByTestId("ue-select"));

    const updater = onChange.mock.calls[0][0];
    expect(updater(BASE_FILTROS)).toEqual({
      ...BASE_FILTROS,
      ue: "cemei-morumbi",
    });
  });
});
