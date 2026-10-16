"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useAcessoAtivoSigEscola } from "@/hooks/useAcessoAtivoSigEscola";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";

type Props = {
  readonly systemName?: string;
  readonly filtros: SigEscolaFiltros;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function AcessoAtivoSigEscolaCard({
  systemName,
  filtros,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useAcessoAtivoSigEscola({
    systemName: systemName ?? "",
    filtros,
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
