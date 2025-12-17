"use client";

import { useEffect, useState } from "react";
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
    const [environment, setEnvironment] = useState<"prod" | "homolog">("prod");

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
        environment,
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
        <div className={cn("space-y-2", className)}>
            {subprojects.length > 0 ? (
                <div className="bg-white shadow rounded-lg">
                    <div className="px-2 py-2">
                        {hasMultipleSubprojects ? (
                            <>
                                <div className="text-sm font-semibold pb-1">Projeto</div>
                                <div className="flex flex-wrap items-center gap-2">
                                    <div className="flex-1 min-w-[200px]">
	                                        <Select value={selectedKey} onValueChange={(value) => setSelectedKey(value)}>
	                                            <SelectTrigger size="sm" className="w-full min-w-0" aria-label="Selecionar projeto">
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
	                                    </div>

	                                    <div className="shrink-0">
	                                        <Select
	                                            value={environment}
	                                            onValueChange={(value) => setEnvironment(value === "homolog" ? "homolog" : "prod")}
	                                        >
	                                            <SelectTrigger
	                                                size="sm"
	                                                className="w-full rounded-full border-transparent bg-slate-100 px-2 text-xs font-semibold text-slate-700 shadow-none hover:bg-slate-200"
	                                                aria-label="Selecionar ambiente"
	                                            >
	                                                <span className="text-[10px] font-semibold text-slate-500">Ambiente</span>
	                                                <SelectValue placeholder="Selecione" />
	                                            </SelectTrigger>
	                                            <SelectContent>
	                                                <SelectItem
	                                                    value="prod"
	                                                    className="focus:bg-[#3b82f6] focus:text-white !focus:ring-0 !focus-visible:ring-0 focus:outline-none"
	                                                >
	                                                    Produção
	                                                </SelectItem>
	                                                <SelectItem
	                                                    value="homolog"
	                                                    className="focus:bg-[#3b82f6] focus:text-white !focus:ring-0 !focus-visible:ring-0 focus:outline-none"
	                                                >
	                                                    Homologação
	                                                </SelectItem>
	                                            </SelectContent>
	                                        </Select>
	                                    </div>
	                                </div>
	                            </>
	                        ) : (
	                            <div className="flex items-center gap-2">
	                                <div className="flex-1">
	                                    <Select
	                                        value={environment}
	                                        onValueChange={(value) => setEnvironment(value === "homolog" ? "homolog" : "prod")}
	                                    >
	                                        <SelectTrigger
	                                            size="sm"
	                                            className="w-full rounded-full border-transparent bg-slate-100 px-2 text-xs font-semibold text-slate-700 shadow-none hover:bg-slate-200"
	                                            aria-label="Selecionar ambiente"
	                                        >
	                                            <span className="text-[10px] font-semibold text-slate-500">Ambiente</span>
	                                            <SelectValue placeholder="Selecione" />
	                                        </SelectTrigger>
	                                        <SelectContent>
	                                            <SelectItem
	                                                value="prod"
	                                                className="focus:bg-[#3b82f6] focus:text-white !focus:ring-0 !focus-visible:ring-0 focus:outline-none"
	                                            >
	                                                Produção
	                                            </SelectItem>
	                                            <SelectItem
	                                                value="homolog"
	                                                className="focus:bg-[#3b82f6] focus:text-white !focus:ring-0 !focus-visible:ring-0 focus:outline-none"
	                                            >
	                                                Homologação
	                                            </SelectItem>
	                                        </SelectContent>
	                                    </Select>
	                                </div>
	                            </div>
	                        )}
	                    </div>
	                </div>
	            ) : null}

	            <JenkinsJobCard
                title={title}
                className={hasMultipleSubprojects ? "" : undefined}
                projectName={selectedKey}
                query={query}
                emptyProjectHint="Selecione um projeto"
            />
        </div>
    );
}
