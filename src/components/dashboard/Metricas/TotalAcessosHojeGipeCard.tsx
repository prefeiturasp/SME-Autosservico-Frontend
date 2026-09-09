"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useTotalAcessosHojeGipe } from "@/hooks/useTotalAcessosHojeGipe";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function TotalAcessosHojeGipeCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useTotalAcessosHojeGipe({
    systemName: systemName ?? "",
  });

  return (
    <MetricCard
      title="Total de acessos ao sistema hoje"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os acessos de hoje."
      value={data ? ptBrFormatter.format(data.accessCount) : undefined}
      trend={data?.trend}
      trendLabel={data?.trendLabel}
      className={className}
    />
  );
}
