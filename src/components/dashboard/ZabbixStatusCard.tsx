"use client";

import { Check, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import type { UseQueryResult } from "@tanstack/react-query";
import type { ZabbixStatus } from "@/types/zabbix";

type Props = {
  readonly title: string;
  readonly className?: string;
  readonly projectName?: string;
  readonly query: UseQueryResult<ZabbixStatus, unknown>;
  readonly emptyProjectHint?: string;
};

export default function ZabbixStatusCard({
  title,
  className,
  projectName,
  query,
  emptyProjectHint = "Selecione um projeto",
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = query;

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
        <div className="text-sm text-muted-foreground">Não foi possível carregar o status.</div>
        <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-3">
          <RotateCcw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  const available = data.available;
  const subtitleMessage =
    data.message ?? (data.incidents_recent ? "Houve incidentes recentes" : "Sem incidentes recentes");

  const subtitle =
    data.message === "Houve incidentes recentes" && data.lastIncidentAt
      ? `Houve incidentes recentes - ${data.lastIncidentAt}`
      : subtitleMessage;

  return (
    <div className={cn("text-center", className)}>
      <div className="font-semibold text-xl">{title}</div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>

      <div
        className={cn(
          "mt-3 h-6 w-full rounded-full px-2",
          "flex items-center justify-center gap-2 text-xs font-medium",
          available ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        )}
        aria-label={`Status: ${available ? "Disponível" : "Indisponível"}`}
      >
        {available ? <Check className="h-5 w-5" aria-hidden="true" /> : <XCircle className="h-5 w-5" aria-hidden="true" />}
        {available ? "Disponível" : "Indisponível"}
      </div>
    </div>
  );
}
