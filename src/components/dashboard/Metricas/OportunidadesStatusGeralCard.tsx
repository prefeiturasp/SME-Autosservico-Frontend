"use client";

import { useOportunidadesRecrutamento } from "@/hooks/useOportunidadesRecrutamento";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OportunidadesStatusGeralCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useOportunidadesRecrutamento({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Status geral"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o status geral de oportunidades e recrutamento."
      items={data?.items}
      className={className}
    />
  );
}
