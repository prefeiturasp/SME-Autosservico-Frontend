"use client";

import { Check, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFetchSaudeDosServidoresFilas } from "@/hooks/useSaudeDosServidores";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

type ProducaoProps = {
    readonly projectName: string; // não está sendo usado, pois pegamos da store
    readonly title?: string; // default "Produção"
    readonly className?: string;
};

export default function Filas({
    title = "Produção",
    className,
    projectName,
}: ProducaoProps) {

    const { data, isLoading, isError, refetch, isFetching } =
        useFetchSaudeDosServidoresFilas(projectName ?? "");

    if (!projectName) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">{title}</div>
                <div className="text-sm text-muted-foreground">
                    Selecione um projeto
                </div>
            </div>
        );
    }

    if (isLoading || isFetching) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">{title}</div>
                <div className="mt-1 text-sm text-muted-foreground">
                    <Skeleton className="mx-auto h-4 w-44" />
                </div>
                <Skeleton className="mx-auto mt-3 h-6 w-full rounded-full" />
            </div>
        );
    }

    if (isError || !data) {
        return (
            <div className={cn("text-center", className)}>
                <div className="font-semibold text-xl">{title}</div>
                <div className="text-sm text-muted-foreground">
                    Não foi possível carregar o status.
                </div>
                <Button
                    onClick={() => refetch()}
                    variant="secondary"
                    size="sm"
                    className="mt-3"
                >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Tentar novamente
                </Button>
            </div>
        );
    }

    const available = data.available;
    let subtitleMessage: string;
    if (data.message !== undefined && data.message !== null) {
        subtitleMessage = data.message;
    } else {
        subtitleMessage = data.incidents_recent
            ? "Houve incidentes recentes"
            : "Sem incidentes recentes";
    }

    const subtitle =
        data.message === "Houve incidentes recentes" && data.lastIncidentAt
            ? `Houve incidentes recentes - ${data.lastIncidentAt}`
            : subtitleMessage;

    return (
        <div className={cn("text-center", className)}>
            <div className="font-semibold text-xl">{title}</div>
            <div className="text-sm text-muted-foreground">{subtitle}</div>

            {/* pílula */}
            <div
                className={cn(
                    "mt-3 h-6 w-full rounded-full px-2",
                    "flex items-center justify-center gap-2 text-xs font-medium",
                    available
                        ? "bg-emerald-500 text-white"
                        : "bg-red-500 text-white"
                )}
                aria-label={`Status: ${
                    available ? "Disponível" : "Indisponível"
                }`}
            >
                {available ? (
                    <Check className="h-5 w-5" aria-hidden="true" />
                ) : (
                    <XCircle className="h-5 w-5" aria-hidden="true" />
                )}
                {available ? "Disponível" : "Indisponível"}
            </div>
        </div>
    );
}
