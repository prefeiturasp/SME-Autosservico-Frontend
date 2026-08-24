"use client";

import { useState } from "react";
import { useSorteiosPorGanhador } from "@/hooks/useSorteiosPorGanhador";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function SorteiosPorGanhadorCard({ systemName, className }: Props) {
  const [period, setPeriod] = useState<AccessComparisonPeriod>("dia");
  const { data, isLoading, isFetching, isError, refetch } = useSorteiosPorGanhador({
    systemName: systemName ?? "",
    period,
  });

  return (
    <MetricasTableCard
      title="Resultados de sorteios por ganhador"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os resultados de sorteios por ganhador."
      rows={data}
      firstColumnLabel="Ganhador"
      secondColumnLabel="Quantidade"
      action={<AccessComparisonPeriodSwitcher value={period} onChange={setPeriod} />}
      className={className}
    />
  );
}
