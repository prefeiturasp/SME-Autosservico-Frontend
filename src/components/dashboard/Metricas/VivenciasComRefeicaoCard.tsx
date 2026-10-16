"use client";

import { useVivenciasComRefeicao } from "@/hooks/useVivenciasComRefeicao";
import ProgressStatsCard from "./ProgressStatsCard";

type Props = {
  readonly systemName?: string;
  readonly bare?: boolean;
  readonly className?: string;
};

export default function VivenciasComRefeicaoCard({
  systemName,
  bare,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useVivenciasComRefeicao({
    systemName: systemName ?? "",
  });

  return (
    <ProgressStatsCard
      title="Vivências com refeição"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as vivências com refeição."
      items={data?.items}
      progressPercentage={data?.progressPercentage}
      bare={bare}
      className={className}
    />
  );
}
