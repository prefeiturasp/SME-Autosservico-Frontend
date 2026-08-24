"use client";

import { useState } from "react";
import { useSorteiosPorTipo } from "@/hooks/useSorteiosPorTipo";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function SorteiosPorTipoCard({ systemName, className }: Props) {
  const [period, setPeriod] = useState<AccessComparisonPeriod>("dia");
  const { data, isLoading, isFetching, isError, refetch } = useSorteiosPorTipo({
    systemName: systemName ?? "",
    period,
  });

  return (
    <MetricasTableCard
      title="Resultados de sorteios por tipo"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os resultados de sorteios por tipo."
      rows={data}
      firstColumnLabel="Tipo de sorteio"
      secondColumnLabel="Quantidade"
      action={<AccessComparisonPeriodSwitcher value={period} onChange={setPeriod} />}
      className={className}
    />
  );
}
