"use client";

import { useMedicoesIniciais } from "@/hooks/useMedicoesIniciais";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function MedicoesIniciaisCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useMedicoesIniciais({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Medições iniciais"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as medições iniciais."
      items={data?.items}
      className={className}
    />
  );
}
