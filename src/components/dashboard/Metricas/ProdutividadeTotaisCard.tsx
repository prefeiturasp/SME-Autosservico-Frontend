"use client";

import { useProdutividadeTotais } from "@/hooks/useProdutividadeTotais";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function ProdutividadeTotaisCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useProdutividadeTotais({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Totais"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os totais de produtividade."
      items={data?.items}
      className={className}
    />
  );
}
