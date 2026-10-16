"use client";

import { useState } from "react";
import { useSorteiosPorDre } from "@/hooks/useSorteiosPorDre";
import type { AccessComparisonPeriod } from "@/types/accessComparisonPeriod";
import AccessComparisonPeriodSwitcher from "./AccessComparisonPeriodSwitcher";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_DRES = 5;

export default function SorteiosPorDreCard({ systemName, className }: Props) {
  const [period, setPeriod] = useState<AccessComparisonPeriod>("dia");
  const { data, isLoading, isFetching, isError, refetch } = useSorteiosPorDre({
    systemName: systemName ?? "",
    period,
  });

  return (
    <MetricasTableCard
      title="Inscrições em sorteios por DRE"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as inscrições em sorteios por DRE."
      rows={data}
      firstColumnLabel="DRE"
      secondColumnLabel="Inscrições"
      action={<AccessComparisonPeriodSwitcher value={period} onChange={setPeriod} />}
      initialVisibleRows={INITIAL_VISIBLE_DRES}
      expandLabel="Ver mais DREs"
      collapseLabel="Ver menos DREs"
      className={className}
    />
  );
}
