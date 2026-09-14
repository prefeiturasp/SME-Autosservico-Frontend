"use client";

import { useRelatoriosGerados } from "@/hooks/useRelatoriosGerados";
import StatsGridCard from "./StatsGridCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function RelatoriosGeradosCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useRelatoriosGerados({
    systemName: systemName ?? "",
  });

  return (
    <StatsGridCard
      title="Relatórios gerados"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os relatórios gerados."
      items={data?.items}
      columns={4}
      className={className}
    />
  );
}
