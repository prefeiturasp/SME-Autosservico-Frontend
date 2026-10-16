"use client";

import { useBaixasFisicas } from "@/hooks/useBaixasFisicas";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function BaixasFisicasCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useBaixasFisicas({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Baixas físicas"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as baixas físicas."
      items={data?.items}
      className={className}
    />
  );
}
