"use client";

import { useOrdemInscricaoStatusGeral } from "@/hooks/useOrdemInscricaoStatusGeral";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OrdemInscricaoStatusGeralCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOrdemInscricaoStatusGeral({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Status geral"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o status geral de ordem de inscrição."
      items={data?.items}
      className={className}
    />
  );
}
