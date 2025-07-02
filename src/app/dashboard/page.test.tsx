import { render, screen } from "@testing-library/react";
import Dashboard from "./page";
import { vi } from "vitest";

// Mock de Navbar
vi.mock("@/components/ui/Navbar", () => ({
    __esModule: true,
    default: () => <nav data-testid="navbar">Mocked Navbar</nav>,
}));

// Mock da função `auth()` para simular login
vi.mock("@/lib/auth", async () => {
    return {
        auth: vi.fn(),
    };
});

// Mock da função `redirect` do next/navigation
vi.mock("next/navigation", () => ({
    redirect: vi.fn(),
}));

import { auth } from "@/lib/auth";
const mockedAuth = auth as unknown as ReturnType<typeof vi.fn>;

import { redirect } from "next/navigation";

describe("Dashboard page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test("renderiza informações da sessão quando logado", async () => {
        // Simula usuário autenticado
        mockedAuth.mockResolvedValueOnce({
            user: {
                id: "1",
                name: "Admin User",
                email: "admin@example.com",
                image: null,
                abrangencia: {
                    nome: "Admin Area",
                    descricao: "Acesso total",
                },
            },
        });

        render(await Dashboard());

        expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
        expect(screen.getByText(/Nome/i)).toBeInTheDocument();
        expect(screen.getByText(/Email/i)).toBeInTheDocument();
        expect(screen.getByText(/admin@example.com/i)).toBeInTheDocument();
    });

    test("redireciona para /login quando não autenticado", async () => {
        (auth as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(
            null
        );

        await Dashboard();

        expect(redirect).toHaveBeenCalledWith("/login");
    });
});
