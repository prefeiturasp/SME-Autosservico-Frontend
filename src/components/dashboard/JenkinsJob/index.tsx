"use client";

import JenkinsBranchBuildsCard from "@/components/dashboard/JenkinsBranchBuildsCard";
import { SubprojectSelect } from "@/components/dashboard/SubprojectSelect";
import { useJenkinsMetrics } from "@/hooks/useJenkinsMetrics";
import { useSubprojectSelection } from "@/hooks/useSubprojectSelection";
import { cn } from "@/lib/utils";
import type { JenkinsSubproject } from "@/types/jenkinsSubproject";
import {
    getJenkinsEnvironmentForDeploy,
    type DeployEnvironment,
} from "@/types/deployEnvironment";

type Props = {
    readonly project: string;
    readonly subprojects?: JenkinsSubproject[];
    readonly environment?: DeployEnvironment;
    readonly title?: string;
    readonly className?: string;
};

export default function JenkinsJob({
    title = "Jenkins - Branches e Builds",
    className,
    project,
    subprojects: subprojectsProp,
    environment = "producao",
}: Props) {
    const { subprojects, hasMultipleSubprojects, selectedKey, setSelectedKey } =
        useSubprojectSelection(project, subprojectsProp);
    const jenkinsEnvironment = getJenkinsEnvironmentForDeploy(environment);

    const query = useJenkinsMetrics({
        projectName: selectedKey,
        environment: jenkinsEnvironment,
    });

    if (!project) {
        return (
            <JenkinsBranchBuildsCard
                title={title}
                className={className}
                projectName=""
                query={query}
            />
        );
    }

    if (subprojects.length === 0) {
        return (
            <div className={cn("bg-white rounded-[5px] shadow-[3px_4px_6px_0px_rgba(0,0,0,0.1)] p-5", className)}>
                <div className="font-bold text-[14px] text-[#111827] mb-4">{title}</div>
                <div className="text-sm text-[#6B7280] text-center">
                    Sem lançamentos disponíveis para este projeto.
                </div>
            </div>
        );
    }

    if (hasMultipleSubprojects) {
        return (
            <div className={cn("bg-white rounded-[5px] shadow-[3px_4px_6px_0px_rgba(0,0,0,0.1)] p-5", className)}>
                <div className="font-bold text-[14px] text-[#111827] mb-4">{title}</div>

                <SubprojectSelect
                    value={selectedKey}
                    onChange={setSelectedKey}
                    subprojects={subprojects}
                />

                <JenkinsBranchBuildsCard
                    title=""
                    projectName={selectedKey}
                    query={query}
                    emptyProjectHint="Selecione um projeto"
                    contentOnly
                />
            </div>
        );
    }

    return (
        <JenkinsBranchBuildsCard
            title={title}
            className={className}
            projectName={selectedKey}
            query={query}
            emptyProjectHint="Selecione um projeto"
        />
    );
}
