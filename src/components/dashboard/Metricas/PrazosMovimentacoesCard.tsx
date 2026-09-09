"use client";

import { usePrazosMovimentacoes } from "@/hooks/usePrazosMovimentacoes";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function PrazosMovimentacoesCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = usePrazosMovimentacoes({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Prazos e movimentações"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os prazos e movimentações."
      items={data?.items}
      className={className}
    />
  );
}
