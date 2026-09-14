"use client";

import { useRelatoriosTotais } from "@/hooks/useRelatoriosTotais";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function RelatoriosTotaisCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useRelatoriosTotais({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Totais"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os totais de relatórios."
      items={data?.items}
      className={className}
    />
  );
}
