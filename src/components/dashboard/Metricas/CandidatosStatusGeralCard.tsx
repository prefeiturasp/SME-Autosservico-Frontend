"use client";

import { useCandidatosStatusGeral } from "@/hooks/useCandidatosStatusGeral";
import StatsGridCard from "./StatsGridCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function CandidatosStatusGeralCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useCandidatosStatusGeral({
    systemName: systemName ?? "",
  });

  return (
    <StatsGridCard
      title="Status geral"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o status geral de candidatos."
      items={data?.items}
      columns={4}
      className={className}
    />
  );
}
