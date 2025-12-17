"use client";

import { useEffect, useMemo, useState } from "react";
import JenkinsJobCard from "@/components/dashboard/JenkinsJobCard";
import { useJenkinsJob } from "@/hooks/useJenkinsJob";
import { cn } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { JenkinsSubproject } from "@/types/jenkinsSubproject";

type Props = {
    readonly squad: string;
    readonly project: string;
    readonly subprojects?: JenkinsSubproject[];
    readonly title?: string;
    readonly className?: string;
};

export default function JenkinsJob({
    title = "Lançamento de Versões",
    className,
    project,
    subprojects: subprojectsProp,
}: Props) {
    const subprojects = subprojectsProp ?? [];
    const hasMultipleSubprojects = subprojects.length > 1;

    const [selectedKey, setSelectedKey] = useState("");

    const selectedOptionLabel = useMemo(() => {
        return subprojects.find((s) => s.key === selectedKey)?.label ?? "";
    }, [subprojects, selectedKey]);

    useEffect(() => {
        if (!project) return setSelectedKey("");
        if (subprojects.length === 0) return setSelectedKey("");
        if (subprojects.length === 1) return setSelectedKey(subprojects[0].key);

        setSelectedKey((prev) => (subprojects.some((s) => s.key === prev) ? prev : subprojects[0].key));
    }, [project, subprojects]);

    const query = useJenkinsJob({
        endpoint: "/api/zabbix/jenkins/job",
        keyPrefix: "zabbix-jenkins-job",
        projectName: selectedKey,
    });

    if (!project) {
        return <JenkinsJobCard title={title} className={className} projectName="" query={query} />;
    }

    if (subprojects.length === 0) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">{title}</div>
                <div className="text-sm text-muted-foreground">
                    Sem lançamentos disponíveis para este projeto.
                </div>
            </div>
        );
    }

    return (
        <div className={cn("space-y-3", className)}>
            {hasMultipleSubprojects ? (
                <div className="bg-white shadow rounded-lg">
                    <div className="px-4 py-4">
                        <div className="text-sm font-semibold pb-2">Projeto</div>
                        <Select
                            value={selectedKey}
                            onValueChange={(value) => setSelectedKey(value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                                {subprojects.map((s) => (
                                    <SelectItem
                                        key={s.key}
                                        value={s.key}
                                        className="focus:bg-[#3b82f6] focus:text-white !focus:ring-0 !focus-visible:ring-0 focus:outline-none"
                                    >
                                        {s.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {selectedOptionLabel ? (
                            <div className="pt-2 text-xs text-muted-foreground">
                                Exibindo: {selectedOptionLabel}
                            </div>
                        ) : null}
                    </div>
                </div>
            ) : null}

            <JenkinsJobCard
                title={title}
                className={hasMultipleSubprojects ? "" : undefined}
                projectName={selectedKey}
                query={query}
                emptyProjectHint="Selecione um subprojeto"
            />
        </div>
    );
}
