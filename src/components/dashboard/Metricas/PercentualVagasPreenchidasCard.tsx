"use client";

import { usePercentualVagasPreenchidas } from "@/hooks/usePercentualVagasPreenchidas";
import ProgressStatsCard from "./ProgressStatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function PercentualVagasPreenchidasCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    usePercentualVagasPreenchidas({
      systemName: systemName ?? "",
    });

  return (
    <ProgressStatsCard
      title="Percentual de vagas preenchidas"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o percentual de vagas preenchidas."
      items={data?.items}
      progressPercentage={data?.progressPercentage}
      className={className}
    />
  );
}
