"use client";

import { useState } from "react";
import { useSolicitacoesDietasEspeciais } from "@/hooks/useSolicitacoesDietasEspeciais";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function SolicitacoesDietasEspeciaisCard({ systemName, className }: Props) {
  const [period, setPeriod] = useState<AccessComparisonPeriod>("dia");
  const { data, isLoading, isFetching, isError, refetch } = useSolicitacoesDietasEspeciais({
    systemName: systemName ?? "",
    period,
  });

  return (
    <StatsCard
      title="Solicitações de dietas especiais"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as solicitações de dietas especiais."
      items={data}
      action={<AccessComparisonPeriodSwitcher value={period} onChange={setPeriod} />}
      className={className}
    />
  );
}
