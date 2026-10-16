/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const signOutMock = vi.fn();

vi.mock("next-auth/react", () => ({
    useSession: vi.fn(),
    signOut: (...args: unknown[]) => signOutMock(...args),
}));

import { useSession } from "next-auth/react";
import { SessionGuard } from "./SessionGuard";

const mockUseSession = vi.mocked(useSession);

describe("<SessionGuard />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renderiza filhos quando status é 'authenticated'", () => {
        mockUseSession.mockReturnValue({
            status: "authenticated",
            data: { user: { rf: "" }, expires: "" },
            update: vi.fn(),
        });

        render(
            <SessionGuard>
                <div>Conteúdo protegido</div>
            </SessionGuard>,
        );

        expect(screen.getByText("Conteúdo protegido")).toBeInTheDocument();
        expect(screen.queryByText("Carregando...")).not.toBeInTheDocument();
    });

    it("mostra tela de carregamento quando status é 'loading'", () => {
        mockUseSession.mockReturnValue({
            status: "loading",
            data: null,
            update: vi.fn(),
        });

        render(
            <SessionGuard>
                <div>Conteúdo protegido</div>
            </SessionGuard>,
        );

        expect(screen.getByText("Carregando...")).toBeInTheDocument();
        expect(
            screen.queryByText("Conteúdo protegido"),
        ).not.toBeInTheDocument();
        expect(signOutMock).not.toHaveBeenCalled();
    });

    it("chama signOut e mostra carregamento quando status é 'unauthenticated'", () => {
        mockUseSession.mockReturnValue({
            status: "unauthenticated",
            data: null,
            update: vi.fn(),
        });

        render(
            <SessionGuard>
                <div>Conteúdo protegido</div>
            </SessionGuard>,
        );

        expect(signOutMock).toHaveBeenCalledWith({
            callbackUrl: "/?expired=true",
        });
        expect(screen.getByText("Carregando...")).toBeInTheDocument();
        expect(
            screen.queryByText("Conteúdo protegido"),
        ).not.toBeInTheDocument();
    });
});
