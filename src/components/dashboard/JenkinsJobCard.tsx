"use client";

import { useMemo } from "react";
import { RotateCcw, Clock, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import type { UseQueryResult } from "@tanstack/react-query";
import type { JenkinsJobSummary } from "@/types/jenkins";

type Props = {
    readonly title: string;
    readonly className?: string;
    readonly projectName?: string;
    readonly query: UseQueryResult<JenkinsJobSummary, unknown>;
    readonly emptyProjectHint?: string;
    readonly environment?: "prod" | "homolog";
    readonly onEnvironmentChange?: (env: "prod" | "homolog") => void;
    readonly showEnvironmentSelect?: boolean;
    readonly contentOnly?: boolean;
};

function EnvironmentSelect({ 
    value, 
    onChange 
}: { 
    readonly value: "prod" | "homolog"; 
    readonly onChange: (v: "prod" | "homolog") => void;
}) {
    return (
        <Select
            value={value}
            onValueChange={(v) => onChange(v === "homolog" ? "homolog" : "prod")}
        >
            <SelectTrigger
                size="sm"
                className="w-auto rounded-full border-transparent bg-slate-100 px-3 text-xs font-medium text-slate-700 shadow-none hover:bg-slate-200 gap-1"
                aria-label="Selecionar ambiente"
            >
                <SelectValue placeholder="Ambiente" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem
                    value="prod"
                    className="focus:bg-[#3b82f6] focus:text-white"
                >
                    Produção
                </SelectItem>
                <SelectItem
                    value="homolog"
                    className="focus:bg-[#3b82f6] focus:text-white"
                >
                    Homologação
                </SelectItem>
            </SelectContent>
        </Select>
    );
}

type HeaderProps = {
    readonly title: string;
    readonly contentOnly: boolean;
    readonly showEnvironmentSelect: boolean;
    readonly environment: "prod" | "homolog";
    readonly onEnvironmentChange?: (env: "prod" | "homolog") => void;
};

function Header({ title, contentOnly, showEnvironmentSelect, environment, onEnvironmentChange }: HeaderProps) {
    if (contentOnly && !title) return null;
    return (
        <div className="flex items-center justify-between mb-4">
            <span className="font-bold text-[14px] text-[#111827]">{title}</span>
            {showEnvironmentSelect && onEnvironmentChange && (
                <EnvironmentSelect value={environment} onChange={onEnvironmentChange} />
            )}
        </div>
    );
}

export default function JenkinsJobCard({
    title,
    className,
    projectName,
    query,
    emptyProjectHint = "Selecione um projeto",
    environment = "prod",
    onEnvironmentChange,
    showEnvironmentSelect = false,
    contentOnly = false,
}: Props) {
    const { data, isLoading, isFetching, isError, refetch } = query;

    const lastReleasedVersion = useMemo(() => {
        return data?.lastSuccessfulBuild ?? data?.lastBuild;
    }, [data]);

    const scheduledVersion = useMemo(() => {
        if (!data?.lastBuild || !data?.lastSuccessfulBuild) return null;
        if (data.lastBuild.number !== data.lastSuccessfulBuild.number) {
            return data.lastBuild;
        }
        return null;
    }, [data]);

    const cardClasses = contentOnly ? "" : "bg-white rounded-[5px] shadow-[3px_4px_6px_0px_rgba(0,0,0,0.1)] p-5";

    const headerProps: HeaderProps = {
        title,
        contentOnly,
        showEnvironmentSelect,
        environment,
        onEnvironmentChange,
    };

    if (!projectName) {
        return (
            <div className={cn(cardClasses, className)}>
                <Header {...headerProps} />
                <div className="text-sm text-[#6B7280] text-center">{emptyProjectHint}</div>
            </div>
        );
    }

    if (isLoading || isFetching) {
        return (
            <div className={cn(cardClasses, className)}>
                <Header {...headerProps} />
                <div className="space-y-3">
                    <div className="bg-[#F5F5F5] rounded-[5px] p-4">
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                    <div className="bg-[#F5F5F5] rounded-[5px] p-4">
                        <Skeleton className="h-5 w-24 mb-2" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className={cn(cardClasses, className)}>
                <Header {...headerProps} />
                <div className="text-sm text-[#6B7280] mb-4">Não foi possível carregar os dados.</div>
                <div className="flex justify-center">
                    <Button onClick={() => refetch()} variant="secondary" size="sm">
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Tentar novamente
                    </Button>
                </div>
            </div>
        );
    }

    if (!lastReleasedVersion) {
        return (
            <div className={cn(cardClasses, className)}>
                <Header {...headerProps} />
                <div className="text-sm text-[#6B7280]">Sem dados de versão para este projeto.</div>
            </div>
        );
    }

    return (
        <div className={cn(cardClasses, className)}>
            <Header {...headerProps} />
            
            <div className="space-y-3">
                <div className="bg-[#F5F5F5] rounded-[5px] p-4 flex items-center gap-3">
                    <Clock className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />
                    <div>
                        <div className="font-bold text-[14px] text-[#111827]">
                            v{lastReleasedVersion.number}
                        </div>
                        <div className="text-[12px] text-[#6B7280]">
                            Realizado em: {lastReleasedVersion.timestamp}
                        </div>
                    </div>
                </div>

                {scheduledVersion && (
                    <div className="bg-[#F5F5F5] rounded-[5px] p-4 flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-[#3B82F6] flex-shrink-0" />
                        <div>
                            <div className="font-bold text-[14px] text-[#111827]">
                                v{scheduledVersion.number}
                            </div>
                            <div className="text-[12px] text-[#6B7280]">
                                Agendado para: {scheduledVersion.timestamp}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
