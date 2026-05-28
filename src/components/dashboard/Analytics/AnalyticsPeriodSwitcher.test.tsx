// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import AnalyticsPeriodSwitcher from "./AnalyticsPeriodSwitcher";

describe("AnalyticsPeriodSwitcher", () => {
    it("renderiza todos os períodos disponíveis", () => {
        render(<AnalyticsPeriodSwitcher value="hoje" onChange={vi.fn()} />);

        expect(screen.getByRole("radio", { name: "Hoje" })).toBeInTheDocument();
        expect(
            screen.getByRole("radio", { name: "7 dias" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("radio", { name: "30 dias" }),
        ).toBeInTheDocument();
    });

    it("marca o período selecionado como checked", () => {
        render(<AnalyticsPeriodSwitcher value="7-dias" onChange={vi.fn()} />);

        expect(screen.getByRole("radio", { name: "7 dias" })).toBeChecked();
        expect(screen.getByRole("radio", { name: "Hoje" })).not.toBeChecked();
        expect(
            screen.getByRole("radio", { name: "30 dias" }),
        ).not.toBeChecked();
    });

    it("exibe o fieldset com legend acessível", () => {
        render(<AnalyticsPeriodSwitcher value="hoje" onChange={vi.fn()} />);

        expect(
            screen.getByRole("group", { name: "Selecionar período" }),
        ).toBeInTheDocument();
    });

    it("chama onChange com o valor correto ao selecionar um período", async () => {
        const onChange = vi.fn();
        render(<AnalyticsPeriodSwitcher value="hoje" onChange={onChange} />);

        await userEvent
            .setup()
            .click(screen.getByRole("radio", { name: "30 dias" }));

        expect(onChange).toHaveBeenCalledWith("30-dias");
    });

    it("aceita name customizado para o grupo de rádios", () => {
        render(
            <AnalyticsPeriodSwitcher
                value="hoje"
                onChange={vi.fn()}
                name="custom-period"
            />,
        );

        const radios = screen.getAllByRole("radio");
        radios.forEach((radio) => {
            expect(radio).toHaveAttribute("name", "custom-period");
        });
    });
});
