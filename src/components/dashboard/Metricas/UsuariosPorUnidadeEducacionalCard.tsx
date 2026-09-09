"use client";

import { useUsuariosPorUnidadeEducacional } from "@/hooks/useUsuariosPorUnidadeEducacional";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function UsuariosPorUnidadeEducacionalCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useUsuariosPorUnidadeEducacional({
      systemName: systemName ?? "",
    });

  return (
    <MetricasTableCard
      title="Usuários por Unidade Educacional"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os usuários por unidade educacional."
      rows={data}
      firstColumnLabel="Unidade educacional"
      secondColumnLabel="Usuários"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      expandLabel="Ver mais UEs"
      collapseLabel="Ver menos UEs"
      className={className}
    />
  );
}
