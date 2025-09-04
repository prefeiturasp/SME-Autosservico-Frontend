// src/components/dashboard/DisponibilidadeDosAmbientes/Producao/index.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import Producao from "./index";

vi.mock("@/components/ui/skeleton", () => ({
    __esModule: true,
    Skeleton: ({ className }: { className?: string }) => (
        <div data-testid="skeleton" className={className} />
    ),
}));
vi.mock("@/components/ui/button", () => ({
    __esModule: true,
    Button: ({
        children,
        onClick,
        className,
    }: React.PropsWithChildren<{
        onClick?: () => void;
        className?: string;
    }>) => (
        <button data-testid="button" className={className} onClick={onClick}>
            {children}
        </button>
    ),
}));

const mockHook = vi.fn();
vi.mock("@/hooks/useDisponibilidadeDosAmbientes", () => ({
    __esModule: true,
    useFetchDisponibilidadeDosAmbientesProducao: (...args: unknown[]) =>
        mockHook(...args),
}));

describe("<Producao />", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // ✅ Retorno padrão para evitar erro de destructuring quando projectName = ""
        mockHook.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });
    });

    it("exibe mensagem para selecionar projeto quando projectName está vazio", () => {
        // usa o retorno padrão acima
        render(<Producao projectName="" />);
        expect(screen.getByText("Produção")).toBeInTheDocument();
        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
    });

    it("exibe skeleton quando isLoading=true", () => {
        mockHook.mockReturnValue({
            data: undefined,
            isLoading: true,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });
        render(<Producao projectName="Portal SME" />);
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(
            2
        );
    });

    it("exibe skeleton quando isFetching=true", () => {
        mockHook.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            isFetching: true,
            refetch: vi.fn(),
        });
        render(<Producao projectName="Portal SME" />);
        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(
            2
        );
    });

    it("exibe erro quando isError=true e permite refetch", () => {
        const refetch = vi.fn();
        mockHook.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: true,
            isFetching: false,
            refetch,
        });
        render(<Producao projectName="Portal SME" />);
        fireEvent.click(screen.getByTestId("button"));
        expect(refetch).toHaveBeenCalledTimes(1);
    });

    it("exibe erro quando !data (mesmo sem isError)", () => {
        mockHook.mockReturnValue({
            data: undefined,
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });
        render(<Producao projectName="Portal SME" />);
        expect(
            screen.getByText("Não foi possível carregar o status.")
        ).toBeInTheDocument();
    });

    it("sucesso: incidents_recent=false → 'Sem incidentes recentes' + Disponível", () => {
        mockHook.mockReturnValue({
            data: {
                available: true,
                message: undefined,
                incidents_recent: false,
                lastIncidentAt: null,
            },
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });
        render(<Producao projectName="Portal SME" />);
        expect(screen.getByText("Sem incidentes recentes")).toBeInTheDocument();
        expect(screen.getByLabelText("Status: Disponível")).toHaveTextContent(
            "Disponível"
        );
    });

    it("sucesso: incidents_recent=true → 'Houve incidentes recentes' + Indisponível", () => {
        mockHook.mockReturnValue({
            data: {
                available: false,
                message: undefined,
                incidents_recent: true,
                lastIncidentAt: null,
            },
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });
        render(<Producao projectName="Portal SME" />);
        expect(
            screen.getByText("Houve incidentes recentes")
        ).toBeInTheDocument();
        expect(screen.getByLabelText("Status: Indisponível")).toHaveTextContent(
            "Indisponível"
        );
    });

    it('sucesso: message === "Houve incidentes recentes" + lastIncidentAt', () => {
        mockHook.mockReturnValue({
            data: {
                available: false,
                message: "Houve incidentes recentes",
                incidents_recent: true,
                lastIncidentAt: "2025-09-03 10:00",
            },
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });
        render(<Producao title="API Service" projectName="API SME" />);
        expect(
            screen.getByText("Houve incidentes recentes - 2025-09-03 10:00")
        ).toBeInTheDocument();
        expect(
            screen.getByLabelText("Status: Indisponível")
        ).toBeInTheDocument();
    });

    it('sucesso: message customizada (≠ "Houve incidentes recentes") → usa exatamente a mensagem', () => {
        mockHook.mockReturnValue({
            data: {
                available: true,
                message: "Sistema em manutenção programada",
                incidents_recent: true, // irrelevante porque message está definido
                lastIncidentAt: "2025-09-03 10:00", // não deve ser concatenado
            },
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });

        render(<Producao projectName="Portal SME" />);
        // deve exibir exatamente a message, sem sufixo de data
        expect(
            screen.getByText("Sistema em manutenção programada")
        ).toBeInTheDocument();

        // pílula continua funcionando normalmente
        expect(screen.getByLabelText("Status: Disponível")).toBeInTheDocument();
    });

    it('sucesso: message === "Houve incidentes recentes" mas sem lastIncidentAt → NÃO concatena', () => {
        mockHook.mockReturnValue({
            data: {
                available: true,
                message: "Houve incidentes recentes",
                incidents_recent: true, // irrelevante pq message está definido
                lastIncidentAt: null, // 👈 força o branch true && false
            },
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });

        render(<Producao projectName="Portal SME" />);

        // Deve exibir exatamente "Houve incidentes recentes" (sem " - data")
        expect(
            screen.getByText("Houve incidentes recentes")
        ).toBeInTheDocument();
        // E não deve existir a versão concatenada
        expect(
            screen.queryByText(/Houve incidentes recentes\s*-\s*/i)
        ).not.toBeInTheDocument();

        // Pílula segue normal
        expect(screen.getByLabelText("Status: Disponível")).toBeInTheDocument();
    });

    it("usa fallback do ?? e chama o hook com string vazia quando projectName é undefined", () => {
        // retorno padrão já vem do beforeEach
        render(<Producao projectName={undefined as unknown as string} />);

        // Continua mostrando o estado 'selecione um projeto'
        expect(screen.getByText("Produção")).toBeInTheDocument();
        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();

        // ✅ garante que o branch do ?? foi exercitado (arg = "")
        expect(mockHook).toHaveBeenCalledWith("");
    });

    it("sucesso: message === null cai no else do && e usa incidents_recent (false → 'Sem incidentes recentes')", () => {
        mockHook.mockReturnValue({
            data: {
                available: true,
                message: null, // 👈 cobre o ramo (message !== undefined) true e (message !== null) false
                incidents_recent: false, // cai no fallback "Sem incidentes recentes"
                lastIncidentAt: "2025-09-03 10:00", // ignorado nesse ramo
            },
            isLoading: false,
            isError: false,
            isFetching: false,
            refetch: vi.fn(),
        });

        render(<Producao projectName="Portal SME" />);
        expect(screen.getByText("Sem incidentes recentes")).toBeInTheDocument();
        expect(screen.getByLabelText("Status: Disponível")).toBeInTheDocument();
    });
});
