import React from "react";

import { screen, fireEvent } from "@testing-library/react";
import { render } from "@testing-library/react";
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

import useDashboardStore from "@/states/dashboard";
import { SidebarProvider } from "../../ui/sidebar";

const mockSetActiveItem = vi.fn();

describe("<AppSidebar />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
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

    it("deve renderizar todos os itens do menu corretamente", () => {
        renderWithSidebarProvider(<AppSidebar />);
        expect(screen.getByText("ASCOM")).toBeInTheDocument();
        expect(
            screen.getByText("Assessoria de comunicação")
        ).toBeInTheDocument();
        expect(screen.getByText("Sair")).toBeInTheDocument();
    });

    it("deve chamar setActiveItem ao clicar em um item", () => {
        renderWithSidebarProvider(<AppSidebar />);
        fireEvent.click(screen.getByText("ASCOM"));
        expect(mockSetActiveItem).toHaveBeenCalledWith({
            title: "ASCOM",
            subTitle: "Assessoria de comunicação",
            url: "#",
        });
    });

    it("deve marcar o item como ativo quando activeItem.title corresponder", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) => {
                return selector({
                    activeItem: { title: "ASCOM" },
                    setActiveItem: mockSetActiveItem,
                });
            }
        );

        renderWithSidebarProvider(<AppSidebar />);
        const ascomButton = screen.getByText("ASCOM").closest("a");
        expect(ascomButton).toHaveClass("!items-start");
    });

    it("renderiza corretamente quando a sidebar está fechada e abre ao clicar no ícone de hamburguer", () => {
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) => {
                return selector({
                    activeItem: { title: "ASCOM" },
                    setActiveItem: mockSetActiveItem,
                });
            }
        );

        renderWithSidebarProvider(<AppSidebar />);

        // ✅ Fecha a sidebar clicando no botão que contém o ícone de close (mockado ou real)
        const closeButton = screen.getByTestId("icon-close").closest("button")!;
        fireEvent.click(closeButton);


        // ✅ Agora abre a sidebar clicando no botão com o ícone real de open (cobre o componente SidebarMenuOpen.tsx)
        const openButton = screen.getByTestId("icon-open").closest("button")!;
        fireEvent.click(openButton);

        // 🔹 Verifica se voltou ao estado expanded e os textos reaparecem
        //expect(sidebar).toHaveAttribute("data-state", "expanded");
        expect(screen.getByText("ASCOM")).toBeInTheDocument();
        expect(
            screen.getByText("Assessoria de comunicação")
        ).toBeInTheDocument();
    });
});
