"use client";

import { useUesParticipantesPorDre } from "@/hooks/useUesParticipantesPorDre";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly bare?: boolean;
  readonly className?: string;
};

const INITIAL_VISIBLE_DRES = 5;

export default function UesParticipantesPorDreCard({
  systemName,
  bare,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useUesParticipantesPorDre({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Quantidade de UEs participantes por DRE"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as UEs participantes por DRE."
      rows={data}
      firstColumnLabel="DRE"
      secondColumnLabel="UEs participantes"
      initialVisibleRows={INITIAL_VISIBLE_DRES}
      expandLabel="Ver mais DREs"
      collapseLabel="Ver menos DREs"
      bare={bare}
      className={className}
    />
  );
}
