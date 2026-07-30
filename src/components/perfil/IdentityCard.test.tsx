/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { IdentityCard } from "./IdentityCard";

const baseProps = {
    nomeCompleto: "Fulano de Tal",
    cargo: "Analista",
    coordenadoria: "COTIC",
    ultimoAcesso: "20/07/2026 10:00",
    tempoSessao: "01:30",
};

describe("<IdentityCard />", () => {
    it("renderiza nome, cargo e coordenadoria", () => {
        render(<IdentityCard {...baseProps} contaAtiva={true} />);
        expect(screen.getByText("Fulano de Tal")).toBeInTheDocument();
        expect(screen.getByText("Analista")).toBeInTheDocument();
        expect(screen.getByText("COTIC")).toBeInTheDocument();
    });

    it("exibe 'Conta ativa' quando contaAtiva for true", () => {
        render(<IdentityCard {...baseProps} contaAtiva={true} />);
        expect(screen.getByText("Conta ativa")).toBeInTheDocument();
        expect(screen.queryByText("Conta inativa")).not.toBeInTheDocument();
    });

    it("exibe 'Conta inativa' quando contaAtiva for false", () => {
        render(<IdentityCard {...baseProps} contaAtiva={false} />);
        expect(screen.getByText("Conta inativa")).toBeInTheDocument();
        expect(screen.queryByText("Conta ativa")).not.toBeInTheDocument();
    });

    it("renderiza último acesso e tempo de sessão", () => {
        render(<IdentityCard {...baseProps} contaAtiva={true} />);
        expect(screen.getByText("Último acesso")).toBeInTheDocument();
        expect(screen.getByText("20/07/2026 10:00")).toBeInTheDocument();
        expect(screen.getByText("Tempo de sessão")).toBeInTheDocument();
        expect(screen.getByText("01:30")).toBeInTheDocument();
    });
});
