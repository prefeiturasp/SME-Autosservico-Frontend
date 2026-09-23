"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useTotalAcessosHojeSigEscola } from "@/hooks/useTotalAcessosHojeSigEscola";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";

type Props = {
  readonly systemName?: string;
  readonly filtros: SigEscolaFiltros;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function TotalAcessosHojeSigEscolaCard({
  systemName,
  filtros,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useTotalAcessosHojeSigEscola({
      systemName: systemName ?? "",
      filtros,
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
