/* @vitest-environment jsdom */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DadosPessoaisCard } from "./DadosPessoaisCard";

const baseProps = {
    nomeCompleto: "Fulano de Tal",
    cpf: "123.456.xxx-xx",
    email: "fulano@sme.sp.gov.br",
    cargo: "Analista",
    coordenadoria: "COTIC",
};

describe("<DadosPessoaisCard />", () => {
    it("renderiza o título e todos os campos informados", () => {
        render(<DadosPessoaisCard {...baseProps} />);

        expect(screen.getByText("Dados pessoais")).toBeInTheDocument();
        expect(screen.getByText("Nome completo")).toBeInTheDocument();
        expect(screen.getByText("Fulano de Tal")).toBeInTheDocument();
        expect(screen.getByText("CPF")).toBeInTheDocument();
        expect(screen.getByText("123.456.xxx-xx")).toBeInTheDocument();
        expect(screen.getByText("E-mail")).toBeInTheDocument();
        expect(screen.getByText("fulano@sme.sp.gov.br")).toBeInTheDocument();
        expect(screen.getByText("Cargo")).toBeInTheDocument();
        expect(screen.getByText("Analista")).toBeInTheDocument();
        expect(screen.getByText("Coordenadoria")).toBeInTheDocument();
        expect(screen.getByText("COTIC")).toBeInTheDocument();
    });

    it("renderiza o botão de editar dados", () => {
        render(<DadosPessoaisCard {...baseProps} />);
        expect(screen.getByTestId("btn-editar-dados")).toBeInTheDocument();
    });

    it("chama onEditar ao clicar no botão de editar", () => {
        const onEditar = vi.fn();
        render(<DadosPessoaisCard {...baseProps} onEditar={onEditar} />);
        fireEvent.click(screen.getByTestId("btn-editar-dados"));
        expect(onEditar).toHaveBeenCalledTimes(1);
    });

    it("não quebra ao clicar em editar sem onEditar informado", () => {
        render(<DadosPessoaisCard {...baseProps} />);
        expect(() =>
            fireEvent.click(screen.getByTestId("btn-editar-dados")),
        ).not.toThrow();
    });
});
