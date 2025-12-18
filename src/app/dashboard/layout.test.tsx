import { render, screen } from "@testing-library/react";
import DashboardLayout from "../dashboard/layout";

vi.mock("next-auth/react", () => ({
    __esModule: true,
    useSession: vi.fn(() => ({
        data: { user: { name: "Usuário Teste" } },
        status: "authenticated",
    })),
    SessionProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
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
            <DashboardLayout>
                <div data-testid="child">Conteúdo Dashboard</div>
            </DashboardLayout>
        );
        const child = screen.getByTestId("child");
        expect(child).toBeInTheDocument();
        const main = child.closest("main");
        expect(main).toBeInTheDocument();
        const flexDiv = main?.closest(".flex");
        expect(flexDiv).toBeInTheDocument();
    });
});
