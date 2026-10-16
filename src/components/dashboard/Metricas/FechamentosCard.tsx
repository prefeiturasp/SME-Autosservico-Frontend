"use client";

import { useFechamentos } from "@/hooks/useFechamentos";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function FechamentosCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useFechamentos({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Fechamentos"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os fechamentos."
      items={data?.items}
      className={className}
    />
  );
}
