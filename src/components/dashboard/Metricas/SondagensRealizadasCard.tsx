"use client";

import { useState } from "react";
import { useSondagensRealizadas } from "@/hooks/useSondagensRealizadas";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";
import ProgressStatsCard from "./ProgressStatsCard";
import BimestreSelect from "./BimestreSelect";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function SondagensRealizadasCard({ systemName, className }: Props) {
  const [bimestre, setBimestre] = useState<string>(DEFAULT_BIMESTRE);
  const { data, isLoading, isFetching, isError, refetch } = useSondagensRealizadas({
    systemName: systemName ?? "",
    bimestre,
  });

  return (
    <ProgressStatsCard
      title="Sondagens realizadas"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as sondagens realizadas."
      items={data?.items}
      progressPercentage={data?.progressPercentage}
      action={<BimestreSelect value={bimestre} onChange={setBimestre} />}
      className={className}
    />
  );
}
