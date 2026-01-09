"use client";

import BacklogCard from "@/components/dashboard/BacklogCard";
import { useAzureDevOpsBacklog } from "@/hooks/useAzureDevOpsBacklog";
import { cn } from "@/lib/utils";

type Props = {
    readonly project?: string;
    readonly azureDevopsProjectName?: string;
    readonly className?: string;
};

export default function AzureDevOpsBacklog({ project, azureDevopsProjectName, className }: Props) {
    const query = useAzureDevOpsBacklog({
        endpoint: "/api/azure-devops/backlog",
        keyPrefix: "azure-devops-backlog",
        projectName: azureDevopsProjectName ?? "",
        filters: {
            workItemTypes: ["Bug"],
        },
    });

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

    if (!azureDevopsProjectName) {
        return (
            <div className={cn("text-center", className)}>
                <div className="text-sm text-muted-foreground">
                    Sem backlog disponível para este projeto.
                </div>
            </div>
        );
    }

    return (
        <BacklogCard
            title=""
            className={className}
            projectName={azureDevopsProjectName}
            query={query}
            emptyProjectHint="Selecione um projeto"
        />
    );
}
