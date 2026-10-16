"use client";

import { useConvocacoesPorConcurso } from "@/hooks/useConvocacoesPorConcurso";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function ConvocacoesPorConcursoCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useConvocacoesPorConcurso({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Convocações por concurso"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as convocações por concurso."
      rows={data}
      firstColumnLabel="Concurso"
      secondColumnLabel="Convocações"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      className={className}
    />
  );
}
