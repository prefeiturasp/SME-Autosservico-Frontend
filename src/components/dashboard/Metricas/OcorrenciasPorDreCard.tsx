"use client";

import { useOcorrenciasPorDre } from "@/hooks/useOcorrenciasPorDre";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function OcorrenciasPorDreCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOcorrenciasPorDre({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Ocorrências por DRE"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as ocorrências por DRE."
      rows={data}
      firstColumnLabel="DRE"
      secondColumnLabel="Ocorrências"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      expandLabel="Ver mais DREs"
      collapseLabel="Ver menos DREs"
      className={className}
    />
  );
}
