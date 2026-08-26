"use client";

import { useState } from "react";
import { useOrdemInscricaoPorTipo } from "@/hooks/useOrdemInscricaoPorTipo";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function OrdemInscricaoPorTipoCard({ systemName, className }: Props) {
  const [period, setPeriod] = useState<AccessComparisonPeriod>("dia");
  const { data, isLoading, isFetching, isError, refetch } = useOrdemInscricaoPorTipo({
    systemName: systemName ?? "",
    period,
  });

  return (
    <MetricasTableCard
      title="Resultados de ordens de inscrição por tipo"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os resultados de ordens de inscrição por tipo."
      rows={data}
      firstColumnLabel="Tipo de ordem de inscrição"
      secondColumnLabel="Quantidade"
      action={<AccessComparisonPeriodSwitcher value={period} onChange={setPeriod} />}
      className={className}
    />
  );
}
