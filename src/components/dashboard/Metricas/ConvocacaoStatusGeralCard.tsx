"use client";

import { useConvocacaoStatusGeral } from "@/hooks/useConvocacaoStatusGeral";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function ConvocacaoStatusGeralCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useConvocacaoStatusGeral({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Status geral"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o status geral de convocação."
      items={data?.items}
      className={className}
    />
  );
}
