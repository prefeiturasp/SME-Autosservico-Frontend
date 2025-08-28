/* @vitest-environment jsdom */
// tests/components/Producao.test.tsx
import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";

// mocks configuráveis
type MockStoreState = {
    activeProject: {
        zabbixQueryFrontend: string;
    };
};

let mockStoreState: MockStoreState = {
    activeProject: { zabbixQueryFrontend: "Portal Educação" },
};
type HookReturnType = {
    data: {
        available: boolean;
        incidents_recent: boolean;
        message?: string;
        lastIncidentAt?: string;
    };
    isLoading: boolean;
    isFetching: boolean;
    isError: boolean;
    refetch: () => void;
};

let hookReturn: HookReturnType = {
    data: {
        available: true,
        incidents_recent: false,
        message: "Sem incidentes recentes",
    },
    isLoading: false,
    isFetching: false,
    isError: false,
    refetch: vi.fn(),
};

vi.mock("@/states/dashboard", () => ({
    __esModule: true,
    default: (selector: (state: MockStoreState) => unknown) =>
        selector(mockStoreState),
}));

vi.mock("@/hooks/useDisponibilidadeDosAmbientes", () => ({
    __esModule: true,
    useFetchDisponibilidadeDosAmbientesProducao: () => hookReturn,
}));

import Producao from "@/components/dashboard/DisponibilidadeDosAmbientes/Producao";

describe("<Producao />", () => {
    beforeEach(() => {
        hookReturn = {
            data: {
                available: true,
                incidents_recent: false,
                message: "Sem incidentes recentes",
            },
            isLoading: false,
            isFetching: false,
            isError: false,
            refetch: vi.fn(),
        };
        mockStoreState = {
            activeProject: { zabbixQueryFrontend: "Portal Educação" },
        };
    });

    it("pede seleção quando não há projeto ativo", () => {
        mockStoreState = { activeProject: { zabbixQueryFrontend: "" } };
        render(<Producao />);
        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    });

    it("renderiza loading (skeleton) quando isLoading", () => {
        hookReturn.isLoading = true;
        render(<Producao />);
        expect(screen.getByText("Produção")).toBeInTheDocument();
        // não deve mostrar 'Disponível' ainda
        expect(screen.queryByText("Disponível")).not.toBeInTheDocument();
    });

    it("renderiza erro e botão 'Tentar novamente'", () => {
        hookReturn.isError = true;
        render(<Producao />);
        expect(
            screen.getByText(/Não foi possível carregar o status/i)
        ).toBeInTheDocument();
        const btn = screen.getByRole("button", { name: /Tentar novamente/i });
        expect(btn).toBeInTheDocument();
        fireEvent.click(btn);
        expect(hookReturn.refetch).toHaveBeenCalled();
    });

    it("renderiza sucesso: disponível", () => {
        render(<Producao />);
        expect(screen.getByText("Sem incidentes recentes")).toBeInTheDocument();
        expect(screen.getByText("Disponível")).toBeInTheDocument();
    });

    it("renderiza sucesso: indisponível", () => {
        hookReturn.data = {
            available: false,
            incidents_recent: true,
            message: "Há incidentes ativos",
        };
        render(<Producao />);
        expect(screen.getByText("Há incidentes ativos")).toBeInTheDocument();
        expect(screen.getByText("Indisponível")).toBeInTheDocument();
    });

    it("mostra 'Houve incidentes recentes' quando message é undefined e incidents_recent=true", () => {
        hookReturn.data = {
            available: true,
            incidents_recent: true,
            message: undefined,
        };
        render(<Producao />);
        expect(
            screen.getByText("Houve incidentes recentes")
        ).toBeInTheDocument();
        expect(screen.getByText("Disponível")).toBeInTheDocument();
    });

    it("mostra 'Sem incidentes recentes' quando message é undefined e incidents_recent=false", () => {
        hookReturn.data = {
            available: true,
            incidents_recent: false,
            message: undefined,
        };

        render(<Producao />);
        expect(screen.getByText("Sem incidentes recentes")).toBeInTheDocument();
        expect(screen.getByText("Disponível")).toBeInTheDocument();
    });

    it("quando houve incidentes recentes e lastIncidentAt existe → mostra 'Houve incidentes recentes — dd/mm/aaaa HH:mm'", () => {
        hookReturn.data = {
            available: true,
            incidents_recent: true,
            message: "Houve incidentes recentes",
            lastIncidentAt: "01/02/2025 13:45",
        };

        render(<Producao />);

        expect(
            screen.getByText("Houve incidentes recentes - 01/02/2025 13:45")
        ).toBeInTheDocument();
        expect(screen.getByText("Disponível")).toBeInTheDocument();
    });

    it("quando há incidentes ATIVOS não deve anexar data/hora ao subtítulo", () => {
        hookReturn.data = {
            available: false,
            incidents_recent: true,
            message: "Há incidentes ativos",
            lastIncidentAt: "01/02/2025 13:45", // mesmo presente, regra do componente não anexa
        };

        render(<Producao />);

        expect(screen.getByText("Há incidentes ativos")).toBeInTheDocument();
        expect(
            screen.queryByText(/— 01\/02\/2025 13:45/)
        ).not.toBeInTheDocument();
        expect(screen.getByText("Indisponível")).toBeInTheDocument();
    });
});
