import { render, screen } from "@testing-library/react";
import type { Session } from "next-auth";
import DashboardLayout from "../dashboard/layout";
import { DashboardShell } from "./DashboardShell";

const mockSession: Session = {
    user: { name: "Usuário Teste", rf: "1234567" },
    expires: "2099-01-01T00:00:00.000Z",
};

vi.mock("@/lib/auth", () => ({
    auth: vi.fn(async () => mockSession),
}));

vi.mock("next-auth/react", () => ({
    __esModule: true,
    useSession: vi.fn(() => ({
        data: { user: { name: "Usuário Teste" } },
        status: "authenticated",
    })),
    SessionProvider: ({ children, session }: { children: React.ReactNode; session?: unknown }) => (
        <div data-testid="session-provider" data-has-session={session ? "true" : "false"}>
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

describe("Dashboard DashboardLayout", () => {
    it("renderiza o children ao lado da sidebar", () => {
        render(
            <DashboardShell session={mockSession}>
                <div data-testid="child">Conteúdo Dashboard</div>
            </DashboardShell>
        );
        const child = screen.getByTestId("child");
        expect(child).toBeInTheDocument();
        const main = child.closest("main");
        expect(main).toBeInTheDocument();
        const flexDiv = main?.closest(".flex");
        expect(flexDiv).toBeInTheDocument();
    });

    it("passa a sessão server-side para o SessionProvider", () => {
        render(
            <DashboardShell session={mockSession}>
                <div data-testid="child">Conteúdo Dashboard</div>
            </DashboardShell>
        );

        expect(screen.getByTestId("session-provider")).toHaveAttribute("data-has-session", "true");
    });

    it("layout server busca a sessão antes de renderizar a shell", async () => {
        const element = await DashboardLayout({
            children: <div data-testid="child">Conteúdo Dashboard</div>,
        });

        render(element);
        expect(screen.getByTestId("session-provider")).toHaveAttribute("data-has-session", "true");
    });
});
