"use client";

import { useOcorrenciaPatrimonial } from "@/hooks/useOcorrenciaPatrimonial";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly bare?: boolean;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function OcorrenciaPatrimonialCard({
  systemName,
  bare,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOcorrenciaPatrimonial({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Ocorrência patrimonial"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as ocorrências patrimoniais."
      rows={data}
      firstColumnLabel="Tipo"
      secondColumnLabel="Ocorrências"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      bare={bare}
      className={className}
    />
  );
}
