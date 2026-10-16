import { fireEvent, render, screen } from "@testing-library/react";
import {
    beforeEach,
    describe,
    expect,
    it,
    vi,
    type Mock as ViMock,
} from "vitest";

import useDashboardStore from "@/states/dashboard";
import { SelectSistemas } from "./index";

import { getSistemasPorSquad } from "./getSistemasPorSquad";

// ✅ Mock do Zustand store
vi.mock("@/states/dashboard", () => {
    return {
        __esModule: true,
        default: vi.fn(),
    };
});

// ✅ Mock do hook useView
const mockHandleSelectChange = vi.fn();
vi.mock("./view", () => {
    return {
        __esModule: true,
        default: vi.fn(() => ({
            handleSelectChange: mockHandleSelectChange,
        })),
    };
});

// ✅ Mock do getSistemasPorSquad
vi.mock("./getSistemasPorSquad", () => {
    return {
        __esModule: true,
        getSistemasPorSquad: vi.fn(),
    };
});

describe("<SelectSistemas />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("não deve renderizar nada quando activeItem é null", () => {
        const setActiveProjectMock = vi.fn();
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) =>
                selector({
                    activeItem: null,
                    setActiveProject: setActiveProjectMock,
                }),
        );

        const { container } = render(<SelectSistemas />);
        expect(container.firstChild).toBeNull();
    });

    it("deve renderizar corretamente os sistemas e chamar handleSelectChange com o primeiro sistema ao montar", () => {
        const setActiveProjectMock = vi.fn();
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) =>
                selector({
                    activeItem: {
                        title: "COPED",
                        subTitle: "Coordenadoria pedagógica",
                        url: "#",
                    },
                    setActiveProject: setActiveProjectMock,
                }),
        );

        (getSistemasPorSquad as unknown as ViMock).mockReturnValue([
            {
                id: "10",
                nome: "Novo SGP",
                zabbixQueryFrontend: "PRD - Novo SGP",
                zabbixQueryBackend: "PRD - Novo SGP - API",
                zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
                zabbixQueryJenkinsJob: "SME-NovoSGP-Docs/master",
            },
            {
                id: "11",
                nome: "Serap",
                zabbixQueryFrontend: "PRD - Serap",
                zabbixQueryBackend: "PRD - Serap - API",
                zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
                zabbixQueryJenkinsJob: "SME-Serap/master",
            },
        ]);

        render(<SelectSistemas />);

        // ✅ Renderização do título e instruções
        expect(screen.getByText("Sistema")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Selecione um sistema para visualizar as informações",
            ),
        ).toBeInTheDocument();

        // ✅ Renderiza os sistemas
        expect(screen.getByText("Novo SGP")).toBeInTheDocument();

        // ✅ handleSelectChange deve ser chamado automaticamente com o primeiro sistema
        expect(setActiveProjectMock).toHaveBeenCalledWith({
            id: "10",
            nome: "Novo SGP",
            zabbixQueryFrontend: "PRD - Novo SGP",
            zabbixQueryBackend: "PRD - Novo SGP - API",
            zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
            zabbixQueryJenkinsJob: "SME-NovoSGP-Docs/master",
        });
    });

    it("deve atualizar o sistema selecionado ao escolher outro item", async () => {
        const setActiveProjectMock = vi.fn();
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) =>
                selector({
                    activeItem: {
                        title: "COPED",
                        subTitle: "Coordenadoria pedagógica",
                        url: "#",
                    },
                    setActiveProject: setActiveProjectMock,
                }),
        );

        (getSistemasPorSquad as unknown as ViMock).mockReturnValue([
            {
                id: "10",
                nome: "Novo SGP",
                zabbixQueryFrontend: "PRD - Novo SGP",
                zabbixQueryBackend: "PRD - Novo SGP - API",
                zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
                zabbixQueryJenkinsJob: "SME-NovoSGP-Docs/master",
            },
            {
                id: "11",
                nome: "Serap",
                zabbixQueryFrontend: "PRD - Serap",
                zabbixQueryBackend: "PRD - Serap - API",
                zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
                zabbixQueryJenkinsJob: "SME-Serap/master",
            },
        ]);

        render(<SelectSistemas />);

        // Abre o dropdown
        const trigger = screen.getByRole("combobox");
        fireEvent.click(trigger);

        // Clica no segundo sistema
        fireEvent.click(screen.getByText("Serap"));

        // ✅ handleSelectChange deve ser chamado com o segundo sistema
        expect(setActiveProjectMock).toHaveBeenCalledWith({
            id: "10",
            nome: "Novo SGP",
            zabbixQueryFrontend: "PRD - Novo SGP",
            zabbixQueryBackend: "PRD - Novo SGP - API",
            zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
            zabbixQueryJenkinsJob: "SME-NovoSGP-Docs/master",
        });
    });

    it("deve resetar o valor quando não houver sistemas disponíveis", () => {
        const setActiveProjectMock = vi.fn();
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) =>
                selector({
                    activeItem: {
                        title: "COTIC",
                        subTitle: "Coordenadoria de Tecnologia",
                        url: "#",
                    },
                    setActiveProject: setActiveProjectMock,
                }),
        );

        (getSistemasPorSquad as unknown as ViMock).mockReturnValue([]);

        render(<SelectSistemas />);

        expect(setActiveProjectMock).not.toHaveBeenCalled();
        expect(screen.queryByRole("combobox")).toBeInTheDocument();
        expect(screen.queryByText("Nenhum sistema")).not.toBeInTheDocument();
    });

    it("deve renderizar o rightSlot quando fornecido", () => {
        const setActiveProjectMock = vi.fn();
        (useDashboardStore as unknown as ViMock).mockImplementation(
            (selector) =>
                selector({
                    activeItem: {
                        title: "COPED",
                        subTitle: "Coordenadoria pedagógica",
                        url: "#",
                    },
                    setActiveProject: setActiveProjectMock,
                }),
        );

        (getSistemasPorSquad as unknown as ViMock).mockReturnValue([
            {
                id: "10",
                nome: "Novo SGP",
                zabbixQueryFrontend: "PRD - Novo SGP",
                zabbixQueryBackend: "PRD - Novo SGP - API",
                zabbixQueryFilasRabbitMQ: "PRD - RabbitMQ",
                zabbixQueryJenkinsJob: "SME-NovoSGP-Docs/master",
            },
        ]);

        render(<SelectSistemas rightSlot={<button>Ação extra</button>} />);

        expect(
            screen.getByRole("button", { name: "Ação extra" }),
        ).toBeInTheDocument();
    });
});
