"use client";

import { useMemo } from "react";
import BacklogCard from "@/components/dashboard/BacklogCard";
import { useAzureDevOpsBacklog } from "@/hooks/useAzureDevOpsBacklog";
import { cn } from "@/lib/utils";
import type { WorkItem } from "@/types/backlog";
import { getProjectIdentifiers, matchesBugToProject } from "./bugFilters";

type Props = {
    readonly project?: string;
    readonly azureDevopsProjectName?: string;
    readonly className?: string;
};

export default function AzureDevOpsBacklog({ project, className }: Props) {
    const query = useAzureDevOpsBacklog({
        endpoint: "/api/azure-devops/backlog",
        keyPrefix: "azure-devops-backlog",
        projectName: "SME - Sustentação",
        filters: {
            workItemTypes: ["BugFix", "HotFix"],
        },
    });

    const filteredQuery = useMemo(() => {
        if (!query.data || !project) return query;

        const projectIdentifiers = getProjectIdentifiers(project);

        const filterItems = (items: WorkItem[]) =>
            items.filter((item) => matchesBugToProject(item, projectIdentifiers));

        return {
            ...query,
            data: {
                ...query.data,
                parents: filterItems(query.data.parents),
                children: filterItems(query.data.children),
            },
        };
    }, [query, project]);

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
        <BacklogCard
            title=""
            className={className}
            projectName="SME - Sustentação"
            query={filteredQuery}
            emptyProjectHint="Selecione um projeto"
        />
    );
}
