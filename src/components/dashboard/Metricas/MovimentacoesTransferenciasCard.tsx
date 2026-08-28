"use client";

import { useMovimentacoesTransferencias } from "@/hooks/useMovimentacoesTransferencias";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function MovimentacoesTransferenciasCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useMovimentacoesTransferencias({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Movimentações e transferências"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as movimentações e transferências."
      items={data?.items}
      className={className}
    />
  );
}
