/* @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import type { Session } from "next-auth";
import { PerfilShell } from "./PerfilShell";

const mockSession: Session = {
    user: { name: "Usuário Teste", rf: "1234567" },
    expires: "2099-01-01T00:00:00.000Z",
};

vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: vi.fn() }),
    usePathname: () => "/perfil",
}));

vi.mock("next-auth/react", () => ({
    __esModule: true,
    useSession: vi.fn(() => ({
        data: { user: { name: "Usuário Teste" } },
        status: "authenticated",
    })),
    SessionProvider: ({
        children,
        session,
    }: {
        children: React.ReactNode;
        session?: unknown;
    }) => (
        <div
            data-testid="session-provider"
            data-has-session={session ? "true" : "false"}
        >
            {children}
        </div>
    ),
}));

vi.mock("next/image", () => ({
    default: (props: Record<string, unknown>) => {
        // eslint-disable-next-line @next/next/no-img-element, @typescript-eslint/no-unused-vars
        const { priority, fetchPriority, fill, ...rest } = props || {};
        return (
            // eslint-disable-next-line @next/next/no-img-element
            <img alt={typeof rest.alt === "string" ? rest.alt : ""} {...rest} />
        );
    },
}));

beforeAll(() => {
    window.matchMedia = (query: string) =>
        ({
            matches: false,
            media: query,
            onchange: null,
            addEventListener: () => {},
            removeEventListener: () => {},
            dispatchEvent: () => {},
        } as unknown as MediaQueryList);
});

describe("PerfilShell", () => {
    it("renderiza os children junto com a sidebar", () => {
        render(
            <PerfilShell session={mockSession}>
                <div data-testid="child">Conteúdo Perfil</div>
            </PerfilShell>,
        );
        const child = screen.getByTestId("child");
        expect(child).toBeInTheDocument();
        const main = child.closest("main");
        expect(main).toBeInTheDocument();
    });

    it("passa a sessão server-side para o SessionProvider", () => {
        render(
            <PerfilShell session={mockSession}>
                <div data-testid="child">Conteúdo Perfil</div>
            </PerfilShell>,
        );

        expect(screen.getByTestId("session-provider")).toHaveAttribute(
            "data-has-session",
            "true",
        );
    });

    it("indica ausência de sessão quando session for null", () => {
        render(
            <PerfilShell session={null}>
                <div data-testid="child">Conteúdo Perfil</div>
            </PerfilShell>,
        );

        expect(screen.getByTestId("session-provider")).toHaveAttribute(
            "data-has-session",
            "false",
        );
    });
});
