"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useUesAptasPrestarContasSigEscola } from "@/hooks/useUesAptasPrestarContasSigEscola";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function UesAptasPrestarContasSigEscolaCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useUesAptasPrestarContasSigEscola({
      systemName: systemName ?? "",
    });

  return (
    <MetricCard
      title="UEs aptas a prestar contas pelo sistema"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as UEs aptas a prestar contas."
      value={data ? ptBrFormatter.format(data.count) : undefined}
      trend={data?.trend}
      trendLabel={data?.trendLabel}
      className={className}
    />
  );
}
