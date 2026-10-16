// @vitest-environment jsdom
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import IntervaloDeDatasInput from "./IntervaloDeDatasInput";

describe("IntervaloDeDatasInput", () => {
  it("renderiza os inputs De/Até com os valores informados", () => {
    render(
      <IntervaloDeDatasInput
        dataInicio="2026-01-01"
        dataFim="2026-09-22"
        onChangeDataInicio={vi.fn()}
        onChangeDataFim={vi.fn()}
      />,
    );

    expect(screen.getByLabelText("Data inicial")).toHaveValue("2026-01-01");
    expect(screen.getByLabelText("Data final")).toHaveValue("2026-09-22");
  });

  it("chama onChangeDataInicio ao alterar a data inicial", async () => {
    const onChangeDataInicio = vi.fn();
    render(
      <IntervaloDeDatasInput
        dataInicio="2026-01-01"
        dataFim="2026-09-22"
        onChangeDataInicio={onChangeDataInicio}
        onChangeDataFim={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText("Data inicial"), {
      target: { value: "2025-01-15" },
    });

    expect(onChangeDataInicio).toHaveBeenCalledWith("2025-01-15");
  });

  it("chama onChangeDataFim ao alterar a data final", async () => {
    const onChangeDataFim = vi.fn();
    render(
      <IntervaloDeDatasInput
        dataInicio="2026-01-01"
        dataFim="2026-09-22"
        onChangeDataInicio={vi.fn()}
        onChangeDataFim={onChangeDataFim}
      />,
    );

    fireEvent.change(screen.getByLabelText("Data final"), {
      target: { value: "2025-01-15" },
    });

    expect(onChangeDataFim).toHaveBeenCalledWith("2025-01-15");
  });
});
