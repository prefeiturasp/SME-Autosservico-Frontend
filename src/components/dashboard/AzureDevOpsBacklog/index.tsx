"use client";

import BacklogCard from "@/components/dashboard/BacklogCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useAzureDevOpsBacklog } from "@/hooks/useAzureDevOpsBacklog";
import { cn } from "@/lib/utils";
import type { BugMetrics, WorkItem } from "@/types/backlog";
import { useMemo, useRef, useState } from "react";
import { getProjectIdentifiers, matchesBugToProject } from "./bugFilters";

type BugMetricsBarProps = {
    readonly metrics?: BugMetrics;
    readonly isLoading: boolean;
};

const METRIC_ITEMS = [
    { key: "total_cycle" as const, label: "Bugs do Ciclo" },
    { key: "open" as const, label: "Abertos" },
    { key: "in_progress" as const, label: "Em andamento" },
    { key: "resolved" as const, label: "Resolvidos" },
    { key: "average_resolution" as const, label: "Tempo médio de atendimento" },
];

function BugMetricsBar({ metrics, isLoading }: BugMetricsBarProps) {
    return (
        <div data-testid="bug-metrics-bar" className="flex flex-1 items-stretch gap-2">
            {METRIC_ITEMS.map(({ key, label }) => (
                <div
                    key={key}
                    className="flex flex-1 flex-col items-center justify-center gap-1 bg-[#F5F5F5] px-4 py-2"
                >
                    {isLoading ? (
                        <>
                            <Skeleton className="h-6 w-10" />
                            <Skeleton className="h-3 w-16" />
                        </>
                    ) : (
                        <>
                            <span className="text-2xl font-bold text-[#3B82F6]">
                                {metrics ? (metrics[key] ?? "-") : "-"}
                            </span>
                            <span className="text-center text-xs font-normal text-[#6B7280]">
                                {label}
                            </span>
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}

type Props = {
    readonly project?: string;
    readonly className?: string;
};

function getItemStatus(state?: string): "Aberto" | "Em andamento" | "Resolvido" {
    if (!state) return "Aberto";
    const s = state.toLowerCase();
    if (s.includes("resolved") || s.includes("closed") || s.includes("done") || s.includes("resolvido") || s.includes("fechado")) return "Resolvido";
    if (s.includes("active") || s.includes("progress") || s.includes("andamento") || s.includes("ativo")) return "Em andamento";
    return "Aberto";
}

/**
 * Extrai o nome da sprint do iteration_path.
 * Ex: "SME - Sustentação\\Sprint 10" -> "Sprint 10"
 */
function getSprintName(iterationPath?: string): string {
    if (!iterationPath) return "Sem Sprint";
    const parts = iterationPath.split("\\");
    return parts.at(-1) || "Sem Sprint";
}

type SprintInfo = {
    name: string;
    iterationPath: string;
    count: number;
};

/**
 * Extrai sprints únicas dos itens com contagem, ordenadas.
 * Armazena também o iteration_path completo para uso na requisição ao backend.
 */
function extractSprintsWithCount(items: WorkItem[]): SprintInfo[] {
    const sprintMap = new Map<
        string,
        { iterationPath: string; count: number }
    >();
    for (const item of items) {
        const iterationPath = item.iteration_path ?? "";
        const name = getSprintName(iterationPath);
        const existing = sprintMap.get(name);
        if (existing) {
            existing.count += 1;
        } else {
            sprintMap.set(name, { iterationPath, count: 1 });
        }
    }

    const sprints: SprintInfo[] = Array.from(sprintMap.entries()).map(
        ([name, { iterationPath, count }]) => ({
            name,
            iterationPath,
            count,
        }),
    );

    // Ordena sprints (tenta ordenar numericamente se possível, mais recente primeiro)
    sprints.sort((a, b) => {
        const numA = Number.parseInt(a.name.replaceAll(/\D/g, ""), 10);
        const numB = Number.parseInt(b.name.replaceAll(/\D/g, ""), 10);
        if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numB - numA;
        return a.name.localeCompare(b.name);
    });

    return sprints;
}

export default function AzureDevOpsBacklog({ project, className }: Props) {
    // Armazena o iteration_path completo da sprint selecionada (null = todas as sprints)
    const [selectedIterationPath, setSelectedIterationPath] = useState<
        string | null
    >(null);

    // Cache da lista de sprints extraída na primeira carga (sem filtro de sprint)
    const cachedSprintsRef = useRef<SprintInfo[]>([]);
    const cachedTotalRef = useRef<number>(0);

    const query = useAzureDevOpsBacklog({
        endpoint: "/api/azure-devops/backlog",
        keyPrefix: "azure-devops-backlog",
        projectName: "SME - Sustentação",
        filters: {
            workItemTypes: ["BugFix", "HotFix"],
            iterationPaths: selectedIterationPath
                ? [selectedIterationPath]
                : undefined,
        },
    });

    const { filteredQuery, sprints, computedMetrics } = useMemo(() => {
        if (!query.data || !project) {
            return {
                filteredQuery: query,
                sprints: cachedSprintsRef.current,
                computedMetrics: undefined,
            };
        }

        const projectIdentifiers = getProjectIdentifiers(project);
        const filterByProject = (items: WorkItem[]) =>
            items.filter((item) =>
                matchesBugToProject(item, projectIdentifiers),
            );

        const filteredParents = filterByProject(query.data.parents);
        const filteredChildren = filterByProject(query.data.children);
        const allProjectItems = [...filteredParents, ...filteredChildren];

        // Reconstrói lista de sprints apenas na carga sem filtro de sprint
        if (!selectedIterationPath) {
            cachedSprintsRef.current = extractSprintsWithCount(allProjectItems);
            cachedTotalRef.current = allProjectItems.length;
        }

        // Calcula contadores a partir dos itens filtrados pelo projeto para que
        // os cards sempre reflitam exatamente o que aparece na listagem abaixo.
        // average_resolution vem do backend pois requer cálculo de datas.
        const computedMetrics = {
            total_cycle: allProjectItems.length,
            open: allProjectItems.filter((i) => getItemStatus(i.state) === "Aberto").length,
            in_progress: allProjectItems.filter((i) => getItemStatus(i.state) === "Em andamento").length,
            resolved: allProjectItems.filter((i) => getItemStatus(i.state) === "Resolvido").length,
            average_resolution: query.data.bug_metrics?.average_resolution ?? null,
        };

        return {
            filteredQuery: {
                ...query,
                data: {
                    ...query.data,
                    parents: filteredParents,
                    children: filteredChildren,
                },
            },
            sprints: cachedSprintsRef.current,
            computedMetrics,
        };
    }, [query, project, selectedIterationPath]);

    if (!project) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">Bugs</div>
                <div className="text-sm text-muted-foreground">
                    Selecione um projeto
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="mb-4 flex items-end gap-4">
                {/* Filtro de Sprint */}
                {sprints.length > 0 && (
                    <div className="flex items-center gap-2">
                        <label
                            htmlFor="sprint-filter"
                            className="text-sm font-medium text-gray-700"
                        >
                            Sprint:
                        </label>
                        <select
                            id="sprint-filter"
                            value={selectedIterationPath ?? "all"}
                            onChange={(e) => {
                                const val = e.target.value;
                                setSelectedIterationPath(
                                    val === "all" ? null : val,
                                );
                            }}
                            className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">Todos os ciclos</option>
                            {[...sprints].reverse().map((sprint) => (
                                <option
                                    key={sprint.iterationPath}
                                    value={sprint.iterationPath}
                                >
                                    {sprint.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <BugMetricsBar
                    metrics={computedMetrics}
                    isLoading={query.isLoading || query.isFetching}
                />
            </div>

            <BacklogCard
                title=""
                projectName="SME - Sustentação"
                query={filteredQuery}
                emptyProjectHint="Selecione um projeto"
            />
        </div>
    );
}
