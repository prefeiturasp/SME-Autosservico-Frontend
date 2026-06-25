/* @vitest-environment jsdom */
import type { BacklogResponse } from "@/types/backlog";
import type { UseQueryResult } from "@tanstack/react-query";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ui/skeleton", () => ({
    Skeleton: () => <div data-testid="skeleton" />,
}));

vi.mock("@/hooks/useAzureDevOpsBacklog", () => ({
    useAzureDevOpsBacklog: vi.fn(),
}));

vi.mock("@/components/dashboard/BacklogCard", () => ({
    default: ({
        title,
        projectName,
        query,
    }: {
        title: string;
        projectName: string;
        query: UseQueryResult<BacklogResponse>;
    }) => (
        <div
            data-testid="backlog-card"
            data-project={projectName}
            data-title={title}
        >
            {query.isLoading && <span>Carregando...</span>}
            {query.data && (
                <span data-testid="total-items">{query.data.total_items}</span>
            )}
        </div>
    ),
}));

import { useAzureDevOpsBacklog } from "@/hooks/useAzureDevOpsBacklog";
import AzureDevOpsBacklog from "./index";

const mockUseAzureDevOpsBacklog = vi.mocked(useAzureDevOpsBacklog);

function makeQuery(
    overrides: Partial<UseQueryResult<BacklogResponse>> = {},
): UseQueryResult<BacklogResponse> {
    return {
        data: undefined,
        isLoading: false,
        isFetching: false,
        isError: false,
        isSuccess: false,
        refetch: vi.fn(),
        ...overrides,
    } as unknown as UseQueryResult<BacklogResponse>;
}

const sprintItems: BacklogResponse["children"] = [
    {
        id: 1,
        title: "[SGP] Bug sprint 10",
        work_item_type: "BugFix",
        state: "New",
        iteration_path: String.raw`SME\Sprint 10`,
        tags: "SGP",
    },
    {
        id: 2,
        title: "[SGP] Bug sprint 9",
        work_item_type: "HotFix",
        state: "Active",
        iteration_path: String.raw`SME\Sprint 9`,
        tags: "SGP",
    },
];

describe("<AzureDevOpsBacklog />", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("exibe 'Selecione um projeto' quando project não é fornecido", () => {
        mockUseAzureDevOpsBacklog.mockReturnValue(makeQuery());

        render(<AzureDevOpsBacklog />);

        expect(screen.getByText("Selecione um projeto")).toBeInTheDocument();
        expect(screen.getByText("Bugs")).toBeInTheDocument();
        expect(screen.queryByTestId("backlog-card")).not.toBeInTheDocument();
    });

    it("renderiza BacklogCard quando project é fornecido e dados existem", () => {
        const mockData: BacklogResponse = {
            total_items: 2,
            parents: [],
            children: [
                {
                    id: 1,
                    title: "[SGP] Bug A",
                    work_item_type: "BugFix",
                    state: "New",
                },
                {
                    id: 2,
                    title: "[SGP] Bug B",
                    work_item_type: "HotFix",
                    state: "Active",
                },
            ],
            metadata: {},
        };

        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ data: mockData, isSuccess: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(screen.getByTestId("backlog-card")).toBeInTheDocument();
        expect(
            screen.queryByText("Selecione um projeto"),
        ).not.toBeInTheDocument();
    });

    it("exibe select de sprint quando dados têm iteration_path", () => {
        const mockData: BacklogResponse = {
            total_items: 2,
            parents: [],
            children: sprintItems,
            metadata: {},
        };

        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ data: mockData, isSuccess: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(screen.getByLabelText("Sprint:")).toBeInTheDocument();
    });

    it("filtra por sprint ao selecionar no select", () => {
        const mockData: BacklogResponse = {
            total_items: 2,
            parents: [],
            children: sprintItems,
            metadata: {},
        };

        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ data: mockData, isSuccess: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        const select = screen.getByLabelText("Sprint:");
        fireEvent.change(select, {
            target: { value: String.raw`SME\Sprint 9` },
        });

        expect(select).toHaveValue(String.raw`SME\Sprint 9`);
    });

    it("não exibe select quando não há itens para o projeto", () => {
        const mockData: BacklogResponse = {
            total_items: 0,
            parents: [],
            children: [],
            metadata: {},
        };

        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ data: mockData, isSuccess: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(screen.queryByLabelText("Sprint:")).not.toBeInTheDocument();
    });

    it("ordena sprints não numéricas alfabeticamente via localeCompare", () => {
        const mockData: BacklogResponse = {
            total_items: 2,
            parents: [],
            children: [
                {
                    id: 1,
                    title: "[SGP] Bug B",
                    work_item_type: "BugFix",
                    state: "New",
                    iteration_path: String.raw`SME\Beta`,
                    tags: "SGP",
                },
                {
                    id: 2,
                    title: "[SGP] Bug A",
                    work_item_type: "HotFix",
                    state: "Active",
                    iteration_path: String.raw`SME\Alpha`,
                    tags: "SGP",
                },
            ],
            metadata: {},
        };

        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ data: mockData, isSuccess: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        const select = screen.getByLabelText("Sprint:");
        expect(select).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: /Alpha/ }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("option", { name: /Beta/ }),
        ).toBeInTheDocument();
    });

    it("exibe 'Sem Sprint' quando iteration_path termina com barra (último segmento vazio)", () => {
        const mockData: BacklogResponse = {
            total_items: 1,
            parents: [],
            children: [
                {
                    id: 1,
                    title: "[SGP] Bug sem sprint",
                    work_item_type: "BugFix",
                    state: "New",
                    iteration_path: "SME\\",
                    tags: "SGP",
                },
            ],
            metadata: {},
        };

        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ data: mockData, isSuccess: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(
            screen.getByRole("option", { name: /Sem Sprint/ }),
        ).toBeInTheDocument();
    });

    // --- BugMetricsBar ---

    it("exibe os 5 labels de métricas quando project é fornecido", () => {
        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({
                data: { total_items: 0, parents: [], children: [], metadata: {} },
                isSuccess: true,
            }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(screen.getByText("Bugs do Ciclo")).toBeInTheDocument();
        expect(screen.getByText("Abertos")).toBeInTheDocument();
        expect(screen.getByText("Em andamento")).toBeInTheDocument();
        expect(screen.getByText("Resolvidos")).toBeInTheDocument();
        expect(
            screen.getByText("Tempo médio de atendimento"),
        ).toBeInTheDocument();
    });

    it("exibe valores de bug_metrics quando presentes", () => {
        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({
                data: {
                    total_items: 0,
                    parents: [],
                    children: [],
                    metadata: {},
                    bug_metrics: {
                        total_cycle: 15,
                        open: 5,
                        in_progress: 3,
                        resolved: 7,
                        average_resolution: "2d",
                    },
                },
                isSuccess: true,
            }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(screen.getByText("15")).toBeInTheDocument();
        expect(screen.getByText("5")).toBeInTheDocument();
        expect(screen.getByText("3")).toBeInTheDocument();
        expect(screen.getByText("7")).toBeInTheDocument();
        expect(screen.getByText("2d")).toBeInTheDocument();
    });

    it("exibe '-' para todos os campos quando bug_metrics é undefined", () => {
        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({
                data: { total_items: 0, parents: [], children: [], metadata: {} },
                isSuccess: true,
            }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(screen.getAllByText("-")).toHaveLength(5);
    });

    it("exibe '-' para average_resolution quando é null", () => {
        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({
                data: {
                    total_items: 0,
                    parents: [],
                    children: [],
                    metadata: {},
                    bug_metrics: {
                        total_cycle: 10,
                        open: 2,
                        in_progress: 1,
                        resolved: 7,
                        average_resolution: null,
                    },
                },
                isSuccess: true,
            }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(screen.getByText("-")).toBeInTheDocument();
        expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("exibe skeletons nas métricas durante loading", () => {
        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ isLoading: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        expect(screen.getAllByTestId("skeleton").length).toBeGreaterThanOrEqual(5);
        expect(screen.queryByText("Bugs do Ciclo")).not.toBeInTheDocument();
    });

    // --- iterationPaths ---

    it("chama o hook com iterationPaths ao selecionar uma sprint", () => {
        const mockData: BacklogResponse = {
            total_items: 2,
            parents: [],
            children: sprintItems,
            metadata: {},
        };

        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ data: mockData, isSuccess: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        const select = screen.getByLabelText("Sprint:");
        fireEvent.change(select, {
            target: { value: String.raw`SME\Sprint 9` },
        });

        expect(mockUseAzureDevOpsBacklog).toHaveBeenCalledWith(
            expect.objectContaining({
                filters: expect.objectContaining({
                    iterationPaths: [String.raw`SME\Sprint 9`],
                }),
            }),
        );
    });

    it("chama o hook sem iterationPaths ao selecionar 'Todas as Sprints'", () => {
        const mockData: BacklogResponse = {
            total_items: 2,
            parents: [],
            children: sprintItems,
            metadata: {},
        };

        mockUseAzureDevOpsBacklog.mockReturnValue(
            makeQuery({ data: mockData, isSuccess: true }),
        );

        render(<AzureDevOpsBacklog project="Novo SGP" />);

        const select = screen.getByLabelText("Sprint:");

        // Seleciona uma sprint e depois volta para "Todas as Sprints"
        fireEvent.change(select, {
            target: { value: String.raw`SME\Sprint 9` },
        });
        fireEvent.change(select, { target: { value: "all" } });

        expect(mockUseAzureDevOpsBacklog).toHaveBeenLastCalledWith(
            expect.objectContaining({
                filters: expect.objectContaining({
                    iterationPaths: undefined,
                }),
            }),
        );
    });
});
