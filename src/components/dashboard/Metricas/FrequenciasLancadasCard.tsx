"use client";

import { useState } from "react";
import { useFrequenciasLancadas } from "@/hooks/useFrequenciasLancadas";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";
import ProgressStatsCard from "./ProgressStatsCard";
import BimestreSelect from "./BimestreSelect";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function FrequenciasLancadasCard({ systemName, className }: Props) {
  const [bimestre, setBimestre] = useState<string>(DEFAULT_BIMESTRE);
  const { data, isLoading, isFetching, isError, refetch } = useFrequenciasLancadas({
    systemName: systemName ?? "",
    bimestre,
  });

  return (
    <ProgressStatsCard
      title="Frequências lançadas"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as frequências lançadas."
      items={data?.items}
      progressPercentage={data?.progressPercentage}
      action={<BimestreSelect value={bimestre} onChange={setBimestre} />}
      className={className}
    />
  );
}
