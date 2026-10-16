"use client";

import { useConvocacoesPorAno } from "@/hooks/useConvocacoesPorAno";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function ConvocacoesPorAnoCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useConvocacoesPorAno({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Convocações por ano"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as convocações por ano."
      rows={data}
      firstColumnLabel="Ano"
      secondColumnLabel="Convocações"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      className={className}
    />
  );
}
