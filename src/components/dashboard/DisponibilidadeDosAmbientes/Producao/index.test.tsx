import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// SUT
import Producao from "./index";

// --- Mocks ---
const mockUseZabbixStatus = vi.fn();

// 1) mock do hook
vi.mock("@/hooks/useZabbixStatus", () => ({
    useZabbixStatus: (...args: unknown[]) => mockUseZabbixStatus(...args),
}));

// 2) mock do ZabbixStatusCard para inspecionar props recebidas
//    Renderiza algo simples com data-testid e exibe props importantes
vi.mock("@/components/dashboard/ZabbixStatusCard", () => {
    return {
        default: ({
            title,
            className,
            projectName,
            query,
        }: {
            title: string;
            className?: string;
            projectName?: string;
            query?: { isLoading?: boolean };
        }) => (
            <div data-testid="zabbix-card">
                <span data-testid="title">{title}</span>
                <span data-testid="className">{className ?? ""}</span>
                <span data-testid="projectName">{projectName ?? ""}</span>
                <span data-testid="query-is-loading">
                    {String(query?.isLoading ?? false)}
                </span>
            </div>
        ),
    };
});

// --- Helpers de estado do hook ---
type QueryState = {
    data?: unknown;
    isLoading?: boolean;
    isFetching?: boolean;
    isError?: boolean;
    refetch?: () => void;
};

const makeQueryState = (overrides: Partial<QueryState> = {}) => ({
    data: undefined,
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
    ...overrides,
});

describe("<Producao />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("usa o título padrão 'Produção' e repassa o projectName", () => {
        mockUseZabbixStatus.mockReturnValue(makeQueryState());

        render(
            <Producao
                // sem title -> usa default
                className="bg-[#F5F5F5] p-3"
                projectName="SIG Escola - Frontend"
            />
        );

        // Verifica chamada do hook com endpoint e keyPrefix corretos
        expect(mockUseZabbixStatus).toHaveBeenCalledTimes(1);
        expect(mockUseZabbixStatus).toHaveBeenCalledWith({
            endpoint: "/api/zabbix/status/producao",
            keyPrefix: "zabbix-status-producao",
            projectName: "SIG Escola - Frontend",
        });

        // Verifica props repassadas ao Card
        expect(screen.getByTestId("zabbix-card")).toBeInTheDocument();
        expect(screen.getByTestId("title").textContent).toBe("Produção"); // default title
        expect(screen.getByTestId("className").textContent).toBe(
            "bg-[#F5F5F5] p-3"
        );
        expect(screen.getByTestId("projectName").textContent).toBe(
            "SIG Escola - Frontend"
        );
    });

    it("aceita title customizado e className customizada", () => {
        mockUseZabbixStatus.mockReturnValue(makeQueryState());

        render(
            <Producao
                title="API Service"
                className="rounded-md shadow"
                projectName="SIG Escola - Backend"
            />
        );

        expect(mockUseZabbixStatus).toHaveBeenCalledWith({
            endpoint: "/api/zabbix/status/producao",
            keyPrefix: "zabbix-status-producao",
            projectName: "SIG Escola - Backend",
        });

        expect(screen.getByTestId("title").textContent).toBe("API Service");
        expect(screen.getByTestId("className").textContent).toBe(
            "rounded-md shadow"
        );
        expect(screen.getByTestId("projectName").textContent).toBe(
            "SIG Escola - Backend"
        );
    });

    it("repassa o resultado do hook (ex.: isLoading) para o Card", () => {
        mockUseZabbixStatus.mockReturnValue(
            makeQueryState({ isLoading: true })
        );

        render(<Producao projectName="Projeto X" />);

        // Nosso mock do Card imprime isLoading
        expect(screen.getByTestId("query-is-loading").textContent).toBe("true");
    });

    it("funciona com projectName vazio (continua chamando o hook com string vazia)", () => {
        mockUseZabbixStatus.mockReturnValue(makeQueryState());

        render(<Producao projectName={""} />);

        expect(mockUseZabbixStatus).toHaveBeenCalledWith({
            endpoint: "/api/zabbix/status/producao",
            keyPrefix: "zabbix-status-producao",
            projectName: "",
        });

        expect(screen.getByTestId("projectName").textContent).toBe("");
    });
    it("quando projectName é undefined, o hook recebe string vazia (ramo do ??)", () => {
        mockUseZabbixStatus.mockReturnValue(makeQueryState());

        // forçando undefined apesar do tipo exigir string
        render(<Producao projectName={undefined as unknown as string} />);

        expect(mockUseZabbixStatus).toHaveBeenCalledWith({
            endpoint: "/api/zabbix/status/producao",
            keyPrefix: "zabbix-status-producao",
            projectName: "", // <- cai no lado direito do ??
        });

        // nosso mock do Card trata projectName ?? ""
        expect(screen.getByTestId("projectName").textContent).toBe("");
    });
});
