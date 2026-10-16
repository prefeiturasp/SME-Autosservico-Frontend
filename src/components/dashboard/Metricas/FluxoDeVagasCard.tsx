"use client";

import { useFluxoDeVagas } from "@/hooks/useFluxoDeVagas";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function FluxoDeVagasCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useFluxoDeVagas({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Fluxo de vagas"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o fluxo de vagas."
      items={data?.items}
      className={className}
    />
  );
}
