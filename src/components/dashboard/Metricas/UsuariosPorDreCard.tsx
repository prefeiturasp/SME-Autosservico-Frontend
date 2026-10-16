"use client";

import { useUsuariosPorDre } from "@/hooks/useUsuariosPorDre";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function UsuariosPorDreCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useUsuariosPorDre({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Usuários por DRE"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os usuários por DRE."
      rows={data}
      firstColumnLabel="DRE"
      secondColumnLabel="Usuários"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      expandLabel="Ver mais DREs"
      collapseLabel="Ver menos DREs"
      className={className}
    />
  );
}
