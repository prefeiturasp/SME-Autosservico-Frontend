"use client";

import { useOcorrenciasPorUnidadeEducacional } from "@/hooks/useOcorrenciasPorUnidadeEducacional";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function OcorrenciasPorUnidadeEducacionalCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useOcorrenciasPorUnidadeEducacional({
      systemName: systemName ?? "",
    });

  return (
    <MetricasTableCard
      title="Ocorrências por Unidade Educacional"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as ocorrências por unidade educacional."
      rows={data}
      firstColumnLabel="Unidade educacional"
      secondColumnLabel="Ocorrências"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      expandLabel="Ver mais UEs"
      collapseLabel="Ver menos UEs"
      className={className}
    />
  );
}
