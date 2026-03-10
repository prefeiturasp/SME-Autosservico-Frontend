"use client";

import { Check, XCircle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useDatabaseStatus } from "@/hooks/useDatabaseStatus";
import type { DatabaseInstanceStatus } from "@/types/database";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

function InstanceBadge({ instance }: { readonly instance: DatabaseInstanceStatus }) {
  const available = instance.available;
  const title = instance.role
    ? `Banco de dados principal (${instance.role === "escrita" ? "Escrita" : "Leitura"})`
    : "Banco de dados principal";

  return (
    <div className="mb-2 last:mb-0 text-center">
      <div className="font-semibold text-xl">{title}</div>
      <div className="text-sm text-muted-foreground">Sem incidentes recentes</div>
      <div
        className={cn(
          "mt-1 h-6 w-full rounded-full px-2",
          "flex items-center justify-center gap-2 text-xs font-medium",
          available ? "bg-emerald-500 text-white" : "bg-red-500 text-white"
        )}
        aria-label={`Status: ${available ? "Disponível" : "Indisponível"}`}
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

export default function DatabaseStatusCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useDatabaseStatus({
    systemName: systemName ?? "",
  });

  if (!systemName) {
    return (
      <div className={cn("text-center", className)}>
        <div className="text-sm text-muted-foreground">Selecione um projeto</div>
      </div>
    );
  }

  if (isLoading || isFetching) {
    return (
      <div className={cn("text-center", className)}>
        <Skeleton className="mx-auto h-4 w-44" />
        <Skeleton className="mx-auto mt-3 h-6 w-full rounded-full" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className={cn("text-center", className)}>
        <div className="text-sm text-muted-foreground">Não foi possível carregar o status.</div>
        <Button onClick={() => refetch()} variant="secondary" size="sm" className="mt-3">
          <RotateCcw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
      </div>
    );
  }

  if (!data.hasDatabase) {
    return (
      <div className={cn("text-center", className)}>
        <div className="text-sm text-muted-foreground">Sem banco de dados</div>
      </div>
    );
  }

  return (
    <div className={cn(className)}>
      {data.instances.map((instance) => (
        <InstanceBadge key={instance.label} instance={instance} />
      ))}
    </div>
  );
}
