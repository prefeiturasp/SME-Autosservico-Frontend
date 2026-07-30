/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import type { Session } from "next-auth";
import PerfilLayout from "./layout";

const mockSession: Session = {
    user: { name: "Usuário Teste", rf: "1234567" },
    expires: "2099-01-01T00:00:00.000Z",
};

vi.mock("@/lib/auth", () => ({
    auth: vi.fn(async () => mockSession),
}));

vi.mock("./PerfilShell", () => ({
    PerfilShell: ({
        children,
        session,
    }: {
        children: React.ReactNode;
        session: Session | null;
    }) => (
        <div data-testid="perfil-shell" data-has-session={session ? "true" : "false"}>
            {children}
        </div>
    ),
}));

describe("PerfilLayout", () => {
    it("busca a sessão via auth() e a repassa para o PerfilShell", async () => {
        const element = await PerfilLayout({
            children: <div data-testid="child">Conteúdo Perfil</div>,
        });

        render(element);

        expect(screen.getByTestId("child")).toBeInTheDocument();
        expect(screen.getByTestId("perfil-shell")).toHaveAttribute(
            "data-has-session",
            "true",
        );
    });
});
