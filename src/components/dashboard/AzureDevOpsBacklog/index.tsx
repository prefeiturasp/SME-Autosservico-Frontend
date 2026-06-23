"use client";

import { useMemo, useState } from "react";
import BacklogCard from "@/components/dashboard/BacklogCard";
import { useAzureDevOpsBacklog } from "@/hooks/useAzureDevOpsBacklog";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/types/backlog";
import { getProjectIdentifiers, matchesBugToProject } from "./bugFilters";

type Props = {
    readonly project?: string;
    readonly className?: string;
};

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
    count: number;
};

/**
 * Extrai sprints únicas dos itens com contagem, ordenadas.
 */
function extractSprintsWithCount(items: WorkItem[]): SprintInfo[] {
    const sprintCounts = new Map<string, number>();
    for (const item of items) {
        const sprintName = getSprintName(item.iteration_path);
        sprintCounts.set(sprintName, (sprintCounts.get(sprintName) ?? 0) + 1);
    }

    const sprints: SprintInfo[] = Array.from(sprintCounts.entries()).map(([name, count]) => ({
        name,
        count,
    }));

    // Ordena sprints (tenta ordenar numericamente se possível)
    sprints.sort((a, b) => {
        const numA = Number.parseInt(a.name.replaceAll(/\D/g, ""), 10);
        const numB = Number.parseInt(b.name.replaceAll(/\D/g, ""), 10);
        if (!Number.isNaN(numA) && !Number.isNaN(numB)) return numB - numA; // Mais recente primeiro
        return a.name.localeCompare(b.name);
    });

    return sprints;
}

export default function AzureDevOpsBacklog({ project, className }: Props) {
    const [selectedSprint, setSelectedSprint] = useState<string | null>(null);

    const query = useAzureDevOpsBacklog({
        endpoint: "/api/azure-devops/backlog",
        keyPrefix: "azure-devops-backlog",
        projectName: "SME - Sustentação",
        filters: {
            workItemTypes: ["BugFix", "HotFix"],
        },
    });

    // Primeiro filtra por projeto, depois extrai sprints e aplica filtro de sprint
    const { filteredQuery, sprintsWithCount, activeSprint, totalItems } = useMemo(() => {
        if (!query.data || !project) {
            return { filteredQuery: query, sprintsWithCount: [], activeSprint: "all", totalItems: 0 };
        }

        const projectIdentifiers = getProjectIdentifiers(project);

        // Filtra por projeto
        const filterByProject = (items: WorkItem[]) =>
            items.filter((item) => matchesBugToProject(item, projectIdentifiers));

        const projectFilteredParents = filterByProject(query.data.parents);
        const projectFilteredChildren = filterByProject(query.data.children);
        const allProjectItems = [...projectFilteredParents, ...projectFilteredChildren];

        // Extrai sprints disponíveis com contagem
        const sprints = extractSprintsWithCount(allProjectItems);

        // Define sprint padrão como a mais recente (primeira da lista ordenada)
        const currentSprint = selectedSprint ?? sprints[0]?.name ?? "all";

        // Filtra por sprint se selecionada
        const filterBySprint = (items: WorkItem[]) => {
            if (currentSprint === "all") return items;
            return items.filter((item) => getSprintName(item.iteration_path) === currentSprint);
        };

        return {
            filteredQuery: {
                ...query,
                data: {
                    ...query.data,
                    parents: filterBySprint(projectFilteredParents),
                    children: filterBySprint(projectFilteredChildren),
                },
            },
            sprintsWithCount: sprints,
            activeSprint: currentSprint,
            totalItems: allProjectItems.length,
        };
    }, [query, project, selectedSprint]);

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
            {/* Filtro de Sprint */}
            {sprintsWithCount.length > 0 && (
                <div className="mb-4 flex items-center gap-2">
                    <label htmlFor="sprint-filter" className="text-sm font-medium text-gray-700">
                        Sprint:
                    </label>
                    <select
                        id="sprint-filter"
                        value={activeSprint}
                        onChange={(e) => setSelectedSprint(e.target.value)}
                        className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                        <option value="all">Todas as Sprints ({totalItems})</option>
                        {sprintsWithCount.map((sprint) => (
                            <option key={sprint.name} value={sprint.name}>
                                {sprint.name} ({sprint.count})
                            </option>
                        ))}
                    </select>
                </div>
            )}

            <BacklogCard
                title=""
                projectName="SME - Sustentação"
                query={filteredQuery}
                emptyProjectHint="Selecione um projeto"
            />
        </div>
    );
}
