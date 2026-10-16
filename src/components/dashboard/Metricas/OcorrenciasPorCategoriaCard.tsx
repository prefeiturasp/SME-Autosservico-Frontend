"use client";

import { useOcorrenciasPorCategoria } from "@/hooks/useOcorrenciasPorCategoria";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OcorrenciasPorCategoriaCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOcorrenciasPorCategoria({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Ocorrências por categoria"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as ocorrências por categoria."
      items={data?.items}
      className={className}
    />
  );
}
