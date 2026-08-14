"use client";

import { useState } from "react";
import { useSolicitacoesAlimentacoes } from "@/hooks/useSolicitacoesAlimentacoes";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function SolicitacoesAlimentacoesCard({ systemName, className }: Props) {
  const [period, setPeriod] = useState<AccessComparisonPeriod>("trimestre");
  const { data, isLoading, isFetching, isError, refetch } = useSolicitacoesAlimentacoes({
    systemName: systemName ?? "",
    period,
  });

  return (
    <StatsCard
      title="Solicitações de alimentações"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as solicitações de alimentações."
      items={data}
      action={<AccessComparisonPeriodSwitcher value={period} onChange={setPeriod} />}
      className={className}
    />
  );
}
