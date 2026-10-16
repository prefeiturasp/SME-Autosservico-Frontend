"use client";

import { useState } from "react";
import { useOrdemInscricaoPorGanhador } from "@/hooks/useOrdemInscricaoPorGanhador";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OrdemInscricaoPorGanhadorCard({ systemName, className }: Props) {
  const [period, setPeriod] = useState<AccessComparisonPeriod>("dia");
  const { data, isLoading, isFetching, isError, refetch } = useOrdemInscricaoPorGanhador({
    systemName: systemName ?? "",
    period,
  });

  return (
    <MetricasTableCard
      title="Resultados de ordens de inscrição por ganhador"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os resultados de ordens de inscrição por ganhador."
      rows={data}
      firstColumnLabel="Ganhador"
      secondColumnLabel="Quantidade"
      action={<AccessComparisonPeriodSwitcher value={period} onChange={setPeriod} />}
      className={className}
    />
  );
}
