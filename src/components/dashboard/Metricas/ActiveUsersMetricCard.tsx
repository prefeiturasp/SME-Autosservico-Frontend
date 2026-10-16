"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useActiveAccessUsers } from "@/hooks/useActiveAccessUsers";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function ActiveUsersMetricCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useActiveAccessUsers({
    systemName: systemName ?? "",
  });

  return (
    <MetricCard
      title="Usuários com acesso ativo"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os usuários com acesso ativo."
      value={data ? ptBrFormatter.format(data.activeCount) : undefined}
      trend={data?.trend}
      trendLabel={data?.trendLabel}
      className={className}
    />
  );
}
