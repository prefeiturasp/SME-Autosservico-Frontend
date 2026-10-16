"use client";

import { useConvocacoesPorDre } from "@/hooks/useConvocacoesPorDre";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function ConvocacoesPorDreCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useConvocacoesPorDre({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Convocações por DRE"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as convocações por DRE."
      rows={data}
      firstColumnLabel="DRE"
      secondColumnLabel="Convocações"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      expandLabel="Ver mais DREs"
      collapseLabel="Ver menos DREs"
      className={className}
    />
  );
}
