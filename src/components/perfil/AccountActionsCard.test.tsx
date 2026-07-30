/* @vitest-environment jsdom */
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";

const signOutMock = vi.fn();

vi.mock("next-auth/react", () => ({
    signOut: (...args: unknown[]) => signOutMock(...args),
}));

import { AccountActionsCard } from "./AccountActionsCard";

describe("<AccountActionsCard />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza o botão de encerrar sessão", () => {
        render(<AccountActionsCard />);
        expect(screen.getByTestId("btn-encerrar-sessao")).toBeInTheDocument();
        expect(screen.getByText("Encerrar sessão")).toBeInTheDocument();
    });

    it("chama signOut com callbackUrl '/' ao clicar em encerrar sessão", () => {
        render(<AccountActionsCard />);
        fireEvent.click(screen.getByTestId("btn-encerrar-sessao"));
        expect(signOutMock).toHaveBeenCalledWith({ callbackUrl: "/" });
    });

    it("renderiza o botão de alterar senha", () => {
        render(<AccountActionsCard />);
        expect(screen.getByTestId("btn-alterar-senha")).toBeInTheDocument();
    });

    it("chama onAlterarSenha ao clicar no botão correspondente", () => {
        const onAlterarSenha = vi.fn();
        render(<AccountActionsCard onAlterarSenha={onAlterarSenha} />);
        fireEvent.click(screen.getByTestId("btn-alterar-senha"));
        expect(onAlterarSenha).toHaveBeenCalledTimes(1);
    });

    it("não quebra ao clicar em alterar senha sem onAlterarSenha informado", () => {
        render(<AccountActionsCard />);
        expect(() =>
            fireEvent.click(screen.getByTestId("btn-alterar-senha")),
        ).not.toThrow();
    });
});
