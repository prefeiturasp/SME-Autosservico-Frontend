"use client";

import { useEffect, useMemo, useState } from "react";
import JenkinsBranchBuildsCard from "@/components/dashboard/JenkinsBranchBuildsCard";
import { useJenkinsMetrics } from "@/hooks/useJenkinsMetrics";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { JenkinsSubproject } from "@/types/jenkinsSubproject";
import {
    getJenkinsEnvironmentForDeploy,
    type DeployEnvironment,
} from "@/types/deployEnvironment";

const EMPTY_SUBPROJECTS: JenkinsSubproject[] = [];

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
    const subprojects = useMemo(
        () => subprojectsProp ?? EMPTY_SUBPROJECTS,
        [subprojectsProp]
    );
    const hasMultipleSubprojects = subprojects.length > 1;

    const [selectedKey, setSelectedKey] = useState("");
    const jenkinsEnvironment = getJenkinsEnvironmentForDeploy(environment);

    useEffect(() => {
        if (!project || subprojects.length === 0) {
            setSelectedKey("");
            return;
        }

        if (subprojects.length === 1) {
            setSelectedKey(subprojects[0].key);
            return;
        }

        setSelectedKey((prev) =>
            subprojects.some((s) => s.key === prev) ? prev : subprojects[0].key
        );
    }, [project, subprojects]);

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

                <div className="mb-4">
                    <div className="text-sm font-semibold text-[#111827] mb-2">Projeto</div>
                    <Select
                        value={selectedKey}
                        onValueChange={(value) => setSelectedKey(value)}
                    >
                        <SelectTrigger
                            size="sm"
                            className="w-full"
                            aria-label="Selecionar projeto"
                        >
                            <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                            {subprojects.map((s) => (
                                <SelectItem
                                    key={s.key}
                                    value={s.key}
                                    className="focus:bg-[#3b82f6] focus:text-white"
                                >
                                    {s.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

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
