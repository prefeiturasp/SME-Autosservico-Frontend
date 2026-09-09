"use client";

import { useOcorrenciaInterpessoal } from "@/hooks/useOcorrenciaInterpessoal";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly bare?: boolean;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function OcorrenciaInterpessoalCard({
  systemName,
  bare,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOcorrenciaInterpessoal({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Ocorrência interpessoal"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as ocorrências interpessoais."
      rows={data}
      firstColumnLabel="Tipo"
      secondColumnLabel="Ocorrências"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      bare={bare}
      className={className}
    />
  );
}
