"use client";

import { useEmpresasTerceirizadas } from "@/hooks/useEmpresasTerceirizadas";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function EmpresasTerceirizadasCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useEmpresasTerceirizadas({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Empresas Terceirizas"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as empresas terceirizadas."
      items={data?.items}
      className={className}
    />
  );
}
