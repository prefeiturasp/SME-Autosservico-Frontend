"use client";

import { useState } from "react";
import { useOrdemInscricaoPorDre } from "@/hooks/useOrdemInscricaoPorDre";
import { DEFAULT_MONTH } from "@/types/monthOption";
import MetricasTableCard from "./MetricasTableCard";
import MonthSelect from "./MonthSelect";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_DRES = 5;

export default function OrdemInscricaoPorDreCard({ systemName, className }: Props) {
  const [month, setMonth] = useState<string>(DEFAULT_MONTH);
  const { data, isLoading, isFetching, isError, refetch } = useOrdemInscricaoPorDre({
    systemName: systemName ?? "",
    month,
  });

  return (
    <MetricasTableCard
      title="Inscrições em ordens de inscrição por DRE"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as inscrições em ordens de inscrição por DRE."
      rows={data}
      firstColumnLabel="DRE"
      secondColumnLabel="Inscrições"
      action={<MonthSelect value={month} onChange={setMonth} />}
      initialVisibleRows={INITIAL_VISIBLE_DRES}
      expandLabel="Ver mais DREs"
      collapseLabel="Ver menos DREs"
      className={className}
    />
  );
}
