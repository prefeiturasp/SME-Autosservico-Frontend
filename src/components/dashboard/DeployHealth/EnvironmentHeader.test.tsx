// @vitest-environment jsdom
import type { DeployEnvironment } from "@/types/deployEnvironment";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import EnvironmentHeader from "./EnvironmentHeader";

describe("EnvironmentHeader", () => {
    it("renderiza o ambiente padrão (produção) sem props", () => {
        render(<EnvironmentHeader />);

        expect(screen.getByText("Produção - Master")).toBeInTheDocument();
        expect(screen.getByRole("radio", { name: "Produção" })).toBeChecked();
    });

    it("renderiza o ambiente fornecido via defaultEnvironment", () => {
        render(<EnvironmentHeader defaultEnvironment="homologacao" />);

        expect(screen.getByText("Homologação - Homolog")).toBeInTheDocument();
    });

    it("usa o valor controlado quando value é fornecido", () => {
        render(<EnvironmentHeader value="qa" />);

        expect(screen.getByText("QA - QA")).toBeInTheDocument();
        expect(screen.getByRole("radio", { name: "QA" })).toBeChecked();
    });

    it("usa DEPLOY_ENVIRONMENTS[0] como fallback para value não reconhecido", () => {
        const invalid = "desconhecido" as unknown as DeployEnvironment;
        render(<EnvironmentHeader value={invalid} />);

        expect(screen.getByText("Produção - Master")).toBeInTheDocument();
    });

    it("atualiza o estado interno ao mudar ambiente no modo não controlado", async () => {
        render(<EnvironmentHeader />);

        await userEvent
            .setup()
            .click(screen.getByRole("radio", { name: "Homologação" }));

        expect(screen.getByText("Homologação - Homolog")).toBeInTheDocument();
    });

    it("chama onChange ao mudar ambiente no modo não controlado", async () => {
        const onChange = vi.fn();
        render(<EnvironmentHeader onChange={onChange} />);

        await userEvent
            .setup()
            .click(screen.getByRole("radio", { name: "QA" }));

        expect(onChange).toHaveBeenCalledWith("qa");
    });

    it("chama onChange mas preserva o valor controlado externo", async () => {
        const onChange = vi.fn();
        render(<EnvironmentHeader value="producao" onChange={onChange} />);

        await userEvent
            .setup()
            .click(screen.getByRole("radio", { name: "Homologação" }));

        expect(onChange).toHaveBeenCalledWith("homologacao");
        expect(screen.getByText("Produção - Master")).toBeInTheDocument();
    });

    it("não lança erro ao mudar ambiente sem onChange fornecido", async () => {
        render(<EnvironmentHeader />);

        await expect(
            userEvent.setup().click(screen.getByRole("radio", { name: "QA" })),
        ).resolves.not.toThrow();
        expect(screen.getByText("QA - QA")).toBeInTheDocument();
    });
});
