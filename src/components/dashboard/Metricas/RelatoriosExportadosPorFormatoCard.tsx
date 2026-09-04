"use client";

import { useRelatoriosExportadosPorFormato } from "@/hooks/useRelatoriosExportadosPorFormato";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function RelatoriosExportadosPorFormatoCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useRelatoriosExportadosPorFormato({
      systemName: systemName ?? "",
    });

  return (
    <StatsCard
      title="Relatórios exportados por formato"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os relatórios exportados por formato."
      items={data?.items}
      className={className}
    />
  );
}
