"use client";

import { useState } from "react";
import { useAcompanhamentoFechamento } from "@/hooks/useAcompanhamentoFechamento";
import { DEFAULT_BIMESTRE } from "@/types/bimestreOption";
import StatsCard from "./StatsCard";
import BimestreSelect from "./BimestreSelect";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function AcompanhamentoFechamentoCard({ systemName, className }: Props) {
  const [bimestre, setBimestre] = useState<string>(DEFAULT_BIMESTRE);
  const { data, isLoading, isFetching, isError, refetch } = useAcompanhamentoFechamento({
    systemName: systemName ?? "",
    bimestre,
  });

  return (
    <StatsCard
      title="Acompanhamento de fechamento"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o acompanhamento de fechamento."
      items={data}
      action={<BimestreSelect value={bimestre} onChange={setBimestre} />}
      className={className}
    />
  );
}
