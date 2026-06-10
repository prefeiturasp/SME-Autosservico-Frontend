"use client";

import { useState } from "react";
import JenkinsJobCard from "@/components/dashboard/JenkinsJobCard";
import { EnvironmentSelect } from "@/components/dashboard/EnvironmentSelect";
import { SubprojectSelect } from "@/components/dashboard/SubprojectSelect";
import { useJenkinsJob } from "@/hooks/useJenkinsJob";
import { useSubprojectSelection } from "@/hooks/useSubprojectSelection";
import { cn } from "@/lib/utils";
import type { JenkinsSubproject } from "@/types/jenkinsSubproject";

type Props = {
    readonly project: string;
    readonly subprojects?: JenkinsSubproject[];
    readonly title?: string;
    readonly className?: string;
};

export default function Releases({
    title = "Lançamentos",
    className,
    project,
    subprojects: subprojectsProp,
}: Props) {
    const { subprojects, hasMultipleSubprojects, selectedKey, setSelectedKey } =
        useSubprojectSelection(project, subprojectsProp);
    const [environment, setEnvironment] = useState<"prod" | "homolog">("prod");

    const query = useJenkinsJob({
        endpoint: "/api/zabbix/jenkins/job",
        keyPrefix: "zabbix-jenkins-job",
        projectName: selectedKey,
        environment,
    });

    if (!project) {
        return (
            <JenkinsJobCard
                title={title}
                className={className}
                projectName=""
                query={query}
                showEnvironmentSelect
                environment={environment}
                onEnvironmentChange={setEnvironment}
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
                <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-[14px] text-[#111827]">{title}</span>
                    <EnvironmentSelect
                        value={environment}
                        onChange={setEnvironment}
                    />
                </div>

                <SubprojectSelect
                    value={selectedKey}
                    onChange={setSelectedKey}
                    subprojects={subprojects}
                />

                <JenkinsJobCard
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
        <JenkinsJobCard
            title={title}
            className={className}
            projectName={selectedKey}
            query={query}
            emptyProjectHint="Selecione um projeto"
            showEnvironmentSelect
            environment={environment}
            onEnvironmentChange={setEnvironment}
        />
    );
}
