"use client";

import { useState } from "react";
import { useConselhoDeClasse } from "@/hooks/useConselhoDeClasse";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";
import StatsCard from "./StatsCard";
import BimestreSelect from "./BimestreSelect";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function ConselhoDeClasseCard({ systemName, className }: Props) {
  const [bimestre, setBimestre] = useState<string>(DEFAULT_BIMESTRE);
  const { data, isLoading, isFetching, isError, refetch } = useConselhoDeClasse({
    systemName: systemName ?? "",
    bimestre,
  });

  return (
    <StatsCard
      title="Conselho de classe"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o conselho de classe."
      items={data}
      action={<BimestreSelect value={bimestre} onChange={setBimestre} />}
      className={className}
    />
  );
}
