"use client";

import { useOcorrenciasPorPrestador } from "@/hooks/useOcorrenciasPorPrestador";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function OcorrenciasPorPrestadorCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useOcorrenciasPorPrestador({
      systemName: systemName ?? "",
    });

  return (
    <MetricasTableCard
      title="Ocorrências por prestador"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as ocorrências por prestador."
      rows={data}
      firstColumnLabel="Prestador"
      secondColumnLabel="Quantidade de ocorrências"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      expandLabel="Ver mais prestadores"
      collapseLabel="Ver menos prestadores"
      className={className}
    />
  );
}
