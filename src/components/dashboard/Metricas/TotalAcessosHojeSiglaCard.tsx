"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useTotalAcessosHojeSigla } from "@/hooks/useTotalAcessosHojeSigla";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function TotalAcessosHojeSiglaCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useTotalAcessosHojeSigla({
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
