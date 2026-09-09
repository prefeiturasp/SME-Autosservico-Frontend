"use client";

import { useOcorrenciasTratadasPorDre } from "@/hooks/useOcorrenciasTratadasPorDre";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function OcorrenciasTratadasPorDreCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOcorrenciasTratadasPorDre({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Ocorrências tratadas por DRE"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as ocorrências tratadas por DRE."
      rows={data}
      firstColumnLabel="DRE"
      secondColumnLabel="Ocorrências tratadas"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      expandLabel="Ver mais DREs"
      collapseLabel="Ver menos DREs"
      className={className}
    />
  );
}
