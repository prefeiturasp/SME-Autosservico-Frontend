// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import EnvironmentSwitcher from "./EnvironmentSwitcher";

describe("EnvironmentSwitcher", () => {
    it("renderiza todos os ambientes disponíveis", () => {
        render(<EnvironmentSwitcher value="producao" onChange={vi.fn()} />);

        expect(
            screen.getByRole("radio", { name: "Produção" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("radio", { name: "Homologação" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("radio", { name: "QA" })).toBeInTheDocument();
    });

    it("marca o ambiente selecionado como checked", () => {
        render(<EnvironmentSwitcher value="homologacao" onChange={vi.fn()} />);

        expect(
            screen.getByRole("radio", { name: "Homologação" }),
        ).toBeChecked();
        expect(
            screen.getByRole("radio", { name: "Produção" }),
        ).not.toBeChecked();
        expect(screen.getByRole("radio", { name: "QA" })).not.toBeChecked();
    });

    it("exibe o fieldset com legend acessível", () => {
        render(<EnvironmentSwitcher value="producao" onChange={vi.fn()} />);

        expect(
            screen.getByRole("group", { name: "Selecionar ambiente" }),
        ).toBeInTheDocument();
    });

    it("chama onChange com o valor correto ao selecionar um ambiente", async () => {
        const onChange = vi.fn();
        render(<EnvironmentSwitcher value="producao" onChange={onChange} />);

        await userEvent
            .setup()
            .click(screen.getByRole("radio", { name: "QA" }));

        expect(onChange).toHaveBeenCalledWith("qa");
    });

    it("aceita name customizado para o grupo de rádios", () => {
        render(
            <EnvironmentSwitcher
                value="producao"
                onChange={vi.fn()}
                name="custom-env"
            />,
        );

        const radios = screen.getAllByRole("radio");
        radios.forEach((radio) => {
            expect(radio).toHaveAttribute("name", "custom-env");
        });
    });
});
