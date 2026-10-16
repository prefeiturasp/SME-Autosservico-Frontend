"use client";

import { useOcorrenciasPorPeriodoLetivo } from "@/hooks/useOcorrenciasPorPeriodoLetivo";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OcorrenciasPorPeriodoLetivoCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useOcorrenciasPorPeriodoLetivo({
      systemName: systemName ?? "",
    });

  return (
    <MetricasTableCard
      title="Ocorrências por período letivo"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as ocorrências por período letivo."
      rows={data}
      firstColumnLabel="Período letivo"
      secondColumnLabel="Ocorrências"
      className={className}
    />
  );
}
