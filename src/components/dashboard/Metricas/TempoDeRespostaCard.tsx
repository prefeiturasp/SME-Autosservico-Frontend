"use client";

import { useTempoDeResposta } from "@/hooks/useTempoDeResposta";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function TempoDeRespostaCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useTempoDeResposta({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Tempo de resposta"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o tempo de resposta."
      items={data?.items}
      className={className}
    />
  );
}
