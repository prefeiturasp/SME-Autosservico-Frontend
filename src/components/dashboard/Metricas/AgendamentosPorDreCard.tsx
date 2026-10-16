"use client";

import { useAgendamentosPorDre } from "@/hooks/useAgendamentosPorDre";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly bare?: boolean;
  readonly className?: string;
};

const INITIAL_VISIBLE_DRES = 5;

export default function AgendamentosPorDreCard({
  systemName,
  bare,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useAgendamentosPorDre({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Agendamentos por DRE"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os agendamentos por DRE."
      rows={data}
      firstColumnLabel="DRE"
      secondColumnLabel="Agendamentos"
      initialVisibleRows={INITIAL_VISIBLE_DRES}
      expandLabel="Ver mais DREs"
      collapseLabel="Ver menos DREs"
      bare={bare}
      className={className}
    />
  );
}
