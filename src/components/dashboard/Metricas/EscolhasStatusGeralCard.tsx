"use client";

import { useEscolhasStatusGeral } from "@/hooks/useEscolhasStatusGeral";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function EscolhasStatusGeralCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useEscolhasStatusGeral({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Status geral"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o status geral de escolhas."
      items={data?.items}
      className={className}
    />
  );
}
