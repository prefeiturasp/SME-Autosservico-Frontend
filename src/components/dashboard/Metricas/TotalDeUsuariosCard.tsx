"use client";

import { useTotalDeUsuarios } from "@/hooks/useTotalDeUsuarios";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function TotalDeUsuariosCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useTotalDeUsuarios({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Total de usuários"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o total de usuários."
      items={data?.items}
      className={className}
    />
  );
}
