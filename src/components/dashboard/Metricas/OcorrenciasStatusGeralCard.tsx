"use client";

import { useOcorrenciasStatusGeral } from "@/hooks/useOcorrenciasStatusGeral";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OcorrenciasStatusGeralCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOcorrenciasStatusGeral({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Status geral"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o status geral de ocorrências."
      items={data?.items}
      className={className}
    />
  );
}
