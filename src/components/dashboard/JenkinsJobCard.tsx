"use client";

import { useMemo, useState } from "react";
import { RotateCcw, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { UseQueryResult } from "@tanstack/react-query";
import type { JenkinsBuildInfo, JenkinsJobSummary } from "@/types/jenkins";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

type Props = {
    readonly title: string;
    readonly className?: string;
    readonly projectName?: string;
    readonly query: UseQueryResult<JenkinsJobSummary, unknown>;
    readonly emptyProjectHint?: string;
};

function StatusPill({ status }: { readonly status: string }) {
    const statusUpper = status.toUpperCase();

    const labelMap: Record<string, string> = {
        SUCCESS: "Sucesso",
        FAILURE: "Falha",
        ABORTED: "Abortada",
        IN_PROGRESS: "Em andamento",
        UNKNOWN: "Desconhecido",
    };

    const colorMap: Record<string, string> = {
        SUCCESS: "bg-emerald-500 text-white",
        FAILURE: "bg-red-500 text-white",
        IN_PROGRESS: "bg-amber-500 text-white",
    };

    const label = labelMap[statusUpper] ?? status;
    const color = colorMap[status] ?? "bg-slate-500 text-white";

    return (
        <span className={cn("inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-xs font-semibold", color)}>
            {label}
        </span>
    );
}

function BuildRow({ label, build }: { readonly label: string; readonly build?: JenkinsBuildInfo }) {
    return (
        <div className="flex items-start justify-between gap-3">
            <div className="text-sm text-muted-foreground">{label}</div>
            {build ? (
                <div className="text-right">
                    <div className="flex items-center justify-end gap-2">
                        <div className="text-sm font-semibold">#{build.number}</div>
                        <StatusPill status={build.status} />
                    </div>
                    <div className="text-xs text-muted-foreground">
                        {build.timestamp} • {build.duration}
                    </div>
                </div>
            ) : (
                <div className="text-sm text-muted-foreground">Sem dados</div>
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
}: Props) {
    const { data, isLoading, isFetching, isError, refetch } = query;
    const [selected, setSelected] = useState<{ label: string; build: JenkinsBuildInfo } | null>(null);

    // Hooks devem ser executados sempre, independente dos early-returns (evita "Rendered more hooks...")
    const currentVersion = useMemo(() => {
        return data?.lastBuild ?? data?.lastSuccessfulBuild ?? data?.lastFailedBuild;
    }, [data]);

    const historyVersions = useMemo(() => {
        if (!data) return [];
        const items = [
            { label: "Última versão com sucesso", build: data.lastSuccessfulBuild },
            { label: "Última versão com falha", build: data.lastFailedBuild },
        ] as const;
        type HistoryItem = (typeof items)[number];
        const filtered = items
            .filter((i): i is { label: HistoryItem["label"]; build: JenkinsBuildInfo } => Boolean(i.build))
            .filter((i) => (currentVersion ? i.build.number !== currentVersion.number : true));

        const deduped = new Map<number, { label: string; build: JenkinsBuildInfo }>();
        for (const item of filtered) {
            if (!deduped.has(item.build.number)) deduped.set(item.build.number, item);
        }

        return Array.from(deduped.values());
    }, [data, currentVersion]);

    if (!projectName) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">{title}</div>
                <div className="text-sm text-muted-foreground">{emptyProjectHint}</div>
            </div>
        );
    }

    if (isLoading || isFetching) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">{title}</div>
                <div className="mt-3">
                    <Skeleton className="mx-auto h-4 w-56" />
                    <Skeleton className="mx-auto mt-3 h-4 w-full" />
                    <Skeleton className="mx-auto mt-2 h-4 w-full" />
                    <Skeleton className="mx-auto mt-2 h-4 w-full" />
                </div>
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">{title}</div>
                <div className="text-sm text-muted-foreground">Não foi possível carregar os dados.</div>
                <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-3">
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Tentar novamente
                </Button>
            </div>
        );
    }

    if (!currentVersion) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">{title}</div>
                <div className="text-sm text-muted-foreground">Sem dados de versão para este projeto.</div>
            </div>
        );
    }

    return (
        <div className={cn("text-left", className)}>
            <div className="mt-1 rounded-md bg-white p-2">
                <div className="flex items-start justify-between gap-3">
                    <div>
                        <div className="text-sm font-semibold">Versão atual</div>
                        <div className="text-xs text-muted-foreground">
                            Versão #{currentVersion.number} • {currentVersion.timestamp}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <StatusPill status={currentVersion.status} />
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Ver detalhes da versão #${currentVersion.number}`}
                            onClick={() => setSelected({ label: "Versão atual", build: currentVersion })}
                        >
                            <Info className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="mt-2 rounded-md bg-white p-2">
                <div className="text-sm font-semibold">Histórico</div>
                {historyVersions.length === 0 ? (
                    <div className="text-sm text-muted-foreground">Sem histórico disponível.</div>
                ) : (
                    <div className="mt-2 space-y-1.5">
                        {historyVersions.map((v) => (
                            <div key={`${v.label}-${v.build.number}`} className="flex items-start justify-between gap-3">
                                <div>
                                    <div className="text-sm font-semibold">{v.label}</div>
                                    <div className="text-xs text-muted-foreground">
                                        Versão #{v.build.number} • {v.build.timestamp}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <StatusPill status={v.build.status} />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        aria-label={`Ver detalhes da versão #${v.build.number}`}
                                        onClick={() => setSelected(v)}
                                    >
                                        <Info className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <Dialog
                open={Boolean(selected)}
                onOpenChange={(open) => {
                    if (!open) setSelected(null);
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Detalhes da versão #{selected?.build.number}</DialogTitle>
                        <DialogDescription>{selected?.label}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        {selected ? (
                            <>
                                <BuildRow label={selected.label} build={selected.build} />
                                <div className="grid grid-cols-1 gap-2 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Timestamp (ms)</span>
                                        <span className="font-semibold">{selected.build.timestampMs}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Duração (ms)</span>
                                        <span className="font-semibold">{selected.build.durationMs}</span>
                                    </div>
                                </div>
                            </>
                        ) : null}
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
