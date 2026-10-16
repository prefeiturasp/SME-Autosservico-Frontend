"use client";

import MetricCard from "@/components/dashboard/MetricCard";
import { useAcessoAtivoSigla } from "@/hooks/useAcessoAtivoSigla";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const ptBrFormatter = new Intl.NumberFormat("pt-BR");

export default function AcessoAtivoSiglaCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useAcessoAtivoSigla({
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
