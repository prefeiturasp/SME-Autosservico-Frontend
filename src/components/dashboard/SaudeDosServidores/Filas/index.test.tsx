import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";

// SUT
import Filas from "./index";

// --- Mocks ---
const mockUseZabbixStatus = vi.fn();

// 1) mock do hook
vi.mock("@/hooks/useZabbixStatus", () => ({
  useZabbixStatus: (...args: unknown[]) => mockUseZabbixStatus(...args),
}));

// 2) mock do ZabbixStatusCard para inspecionar props recebidas
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

// --- Helper para estado do hook ---
interface QueryState {
  data?: unknown;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  refetch: () => void;
}

const makeQueryState = (overrides: Partial<QueryState> = {}) => ({
  data: undefined,
  isLoading: false,
  isFetching: false,
  isError: false,
  refetch: vi.fn(),
  ...overrides,
});

describe("<Filas />", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usa o título padrão 'Fila' e repassa o projectName", () => {
    mockUseZabbixStatus.mockReturnValue(makeQueryState());

    render(
      <Filas
        // sem title -> usa default
        className="mb-5 bg-[#F5F5F5] p-3"
        projectName="SIG Escola - Filas RabbitMQ"
      />
    );

    // Hook chamado com endpoint e keyPrefix corretos
    expect(mockUseZabbixStatus).toHaveBeenCalledTimes(1);
    expect(mockUseZabbixStatus).toHaveBeenCalledWith({
      endpoint: "/api/zabbix/status/filas",
      keyPrefix: "zabbix-status-filas",
      projectName: "SIG Escola - Filas RabbitMQ",
    });

    // Props repassadas ao Card
    expect(screen.getByTestId("zabbix-card")).toBeInTheDocument();
    expect(screen.getByTestId("title").textContent).toBe("Fila"); // default
    expect(screen.getByTestId("className").textContent).toBe(
      "mb-5 bg-[#F5F5F5] p-3"
    );
    expect(screen.getByTestId("projectName").textContent).toBe(
      "SIG Escola - Filas RabbitMQ"
    );
  });

  it("aceita title e className customizados", () => {
    mockUseZabbixStatus.mockReturnValue(makeQueryState());

    render(
      <Filas
        title="Workload Fila"
        className="rounded-md shadow"
        projectName="Projeto Y - Fila"
      />
    );

    expect(mockUseZabbixStatus).toHaveBeenCalledWith({
      endpoint: "/api/zabbix/status/filas",
      keyPrefix: "zabbix-status-filas",
      projectName: "Projeto Y - Fila",
    });

    expect(screen.getByTestId("title").textContent).toBe("Workload Fila");
    expect(screen.getByTestId("className").textContent).toBe(
      "rounded-md shadow"
    );
    expect(screen.getByTestId("projectName").textContent).toBe(
      "Projeto Y - Fila"
    );
  });

  it("repassa o resultado do hook (ex.: isLoading) para o Card", () => {
    mockUseZabbixStatus.mockReturnValue(makeQueryState({ isLoading: true }));

    render(<Filas projectName="Projeto Z" />);

    // Nosso mock do Card imprime isLoading
    expect(screen.getByTestId("query-is-loading").textContent).toBe("true");
  });

  it("quando projectName é string vazia, o hook recebe string vazia", () => {
    mockUseZabbixStatus.mockReturnValue(makeQueryState());

    render(<Filas projectName="" />);

    expect(mockUseZabbixStatus).toHaveBeenCalledWith({
      endpoint: "/api/zabbix/status/filas",
      keyPrefix: "zabbix-status-filas",
      projectName: "",
    });

    expect(screen.getByTestId("projectName").textContent).toBe("");
  });

  it("quando projectName é undefined, o hook recebe string vazia (ramo do ??)", () => {
    mockUseZabbixStatus.mockReturnValue(makeQueryState());

    // forçando undefined apesar do tipo exigir string
    render(<Filas projectName={undefined as unknown as string} />);

    expect(mockUseZabbixStatus).toHaveBeenCalledWith({
      endpoint: "/api/zabbix/status/filas",
      keyPrefix: "zabbix-status-filas",
      projectName: "", // cai no lado direito do ??
    });

    expect(screen.getByTestId("projectName").textContent).toBe("");
  });
});
