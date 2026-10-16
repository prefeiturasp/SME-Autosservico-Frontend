"use client";

import { usePerfisMaisUtilizados } from "@/hooks/usePerfisMaisUtilizados";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function PerfisMaisUtilizadosCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = usePerfisMaisUtilizados({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Perfis mais utilizados"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os perfis mais utilizados."
      rows={data}
      firstColumnLabel="Tipo de perfil"
      secondColumnLabel="Acessos"
      className={className}
    />
  );
}
