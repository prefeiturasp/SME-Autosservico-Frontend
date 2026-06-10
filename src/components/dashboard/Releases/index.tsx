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

const EMPTY_SUBPROJECTS: JenkinsSubproject[] = [];

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
    const subprojects = useMemo(
        () => subprojectsProp ?? EMPTY_SUBPROJECTS,
        [subprojectsProp]
    );
    const hasMultipleSubprojects = subprojects.length > 1;

    const [selectedKey, setSelectedKey] = useState("");
    const [environment, setEnvironment] = useState<"prod" | "homolog">("prod");

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
                    <Select
                        value={environment}
                        onValueChange={(v) => setEnvironment(v === "homolog" ? "homolog" : "prod")}
                    >
                        <SelectTrigger
                            size="sm"
                            className="w-auto rounded-full border-transparent bg-slate-100 px-3 text-xs font-medium text-slate-700 shadow-none hover:bg-slate-200 gap-1"
                            aria-label="Selecionar ambiente"
                        >
                            <SelectValue placeholder="Ambiente" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="prod" className="focus:bg-[#3b82f6] focus:text-white">
                                Produção
                            </SelectItem>
                            <SelectItem value="homolog" className="focus:bg-[#3b82f6] focus:text-white">
                                Homologação
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

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
