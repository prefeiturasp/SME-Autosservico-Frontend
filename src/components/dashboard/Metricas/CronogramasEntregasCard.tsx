"use client";

import { useCronogramasEntregas } from "@/hooks/useCronogramasEntregas";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function CronogramasEntregasCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useCronogramasEntregas({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Cronogramas de entregas"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os cronogramas de entregas."
      items={data?.items}
      className={className}
    />
  );
}
