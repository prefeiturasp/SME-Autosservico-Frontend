import React from "react";

import { render, screen, fireEvent } from "@testing-library/react";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
    type Mock as ViMock,
} from "vitest";
import { AppSidebar } from "./app-sidebar";

// ✅ Mock do matchMedia diretamente no teste
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// ✅ Mock do Next/Image

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

// ✅ Mock do LogoDevops com width e height
vi.mock("@/assets/images/logo_devops.webp", () => ({
    default: {
        src: "/logo_devops.webp",
        width: 108,
        height: 80,
    },
}));

// 🔹 Mock do Zustand store
vi.mock("@/states/dashboard", () => {
    return {
        __esModule: true,
        default: vi.fn(),
    };
});

// 🔹 Mock dos ícones
vi.mock("@/assets/icons/SidebarAscom", () => ({
    default: () => <div>IconASCOM</div>,
}));
vi.mock("@/assets/icons/SidebarCoceu", () => ({
    default: () => <div>IconCOCEU</div>,
}));
vi.mock("@/assets/icons/SidebarCodae", () => ({
    default: () => <div>IconCODAE</div>,
}));
vi.mock("@/assets/icons/SidebarCoped", () => ({
    default: () => <div>IconCOPED</div>,
}));
vi.mock("@/assets/icons/SidebarCoplan", () => ({
    default: () => <div>IconCOPLAN</div>,
}));
vi.mock("@/assets/icons/SidebarCotic", () => ({
    default: () => <div>IconCOTIC</div>,
}));


// ✅ Mock do next/navigation (App Router)
const mockRouterPush = vi.fn();
let mockPathname = "/dashboard";
vi.mock("next/navigation", () => ({
    useRouter: () => ({ push: mockRouterPush }),
    usePathname: () => mockPathname,
}));

// ✅ Mock do NextAuth/useSession com perfis válidos
vi.mock("next-auth/react", () => {
    return {
        __esModule: true,
        useSession: vi.fn(() => ({
            data: {
                user: {
                    nome: "Usuário Teste",
                    cpf: "00000000000",
                    email: "teste@teste.com",
                    login: "123456",
                    situacaoUsuario: 1,
                    situacaoGrupo: 1,
                    visoes: ["UE"],
                    perfis_por_sistema: [
                        {
                            sistema: 1008,
                            perfis: ["COPED", "COPLAN"],
                        },
                    ],
                },
            },
            status: "authenticated",
        })),
    };
});


import useDashboardStore from "@/states/dashboard";
import { SidebarProvider } from "../../ui/sidebar";

const mockSetActiveItem = vi.fn();

describe("<AppSidebar />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockPathname = "/dashboard";
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) => {
                return selector({
                    activeItem: null,
                    setActiveItem: mockSetActiveItem,
                });
            }
        );
    });

    const renderWithSidebarProvider = (ui: React.ReactNode) =>
        render(<SidebarProvider>{ui}</SidebarProvider>);

    it("deve renderizar apenas os itens permitidos (baseado nos perfis do sistema 1008)", () => {
        renderWithSidebarProvider(<AppSidebar />);
        expect(screen.getByText("COPED")).toBeInTheDocument();
        expect(
            screen.getByText("Coordenadoria pedagógica")
        ).toBeInTheDocument();
        expect(screen.getByText("COPLAN")).toBeInTheDocument();
        expect(
            screen.getByText("Coordenadoria de Planejamento e Orçamento")
        ).toBeInTheDocument();
        expect(screen.getByText("Sair")).toBeInTheDocument();
    });

    it("deve chamar setActiveItem ao clicar em um item permitido", () => {
        renderWithSidebarProvider(<AppSidebar />);
        fireEvent.click(screen.getByText("COPED"));
        expect(mockSetActiveItem).toHaveBeenCalledWith(
            expect.objectContaining({
                title: "COPED",
                subTitle: "Coordenadoria pedagógica",
                url: "#",
            })
        );
    });

    it("não navega ao clicar em um item quando já está no dashboard", () => {
        mockPathname = "/dashboard";
        renderWithSidebarProvider(<AppSidebar />);
        fireEvent.click(screen.getByText("COPED"));
        expect(mockRouterPush).not.toHaveBeenCalled();
    });

    it("navega para /dashboard ao clicar em um item fora do dashboard", () => {
        mockPathname = "/perfil";
        renderWithSidebarProvider(<AppSidebar />);
        fireEvent.click(screen.getByText("COPED"));
        expect(mockRouterPush).toHaveBeenCalledWith("/dashboard");
    });

    it("deve marcar o item como ativo quando activeItem.title corresponder", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) => {
                return selector({
                    activeItem: { title: "COPED" },
                    setActiveItem: mockSetActiveItem,
                });
            }
        );

        renderWithSidebarProvider(<AppSidebar />);
        const button = screen.getByTestId("sidebar-button-coped");
        expect(button).toHaveClass("bg-[#3B82F6]", "text-white");
    });

    it("renderiza corretamente quando a sidebar está fechada e abre ao clicar no ícone de hamburguer", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) => {
                return selector({
                    activeItem: { title: "COPED" },
                    setActiveItem: mockSetActiveItem,
                });
            }
        );

        renderWithSidebarProvider(<AppSidebar />);

        const closeButton = screen.getByTestId("icon-close").closest("button")!;
        fireEvent.click(closeButton);

        const openButton = screen.getByTestId("icon-open").closest("button")!;
        fireEvent.click(openButton);

        expect(screen.getByText("COPED")).toBeInTheDocument();
        expect(
            screen.getByText("Coordenadoria pedagógica")
        ).toBeInTheDocument();
    });
});
