"use client";

import { useSituacaoPatrimonial } from "@/hooks/useSituacaoPatrimonial";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly filtros: SigEscolaFiltros;
  readonly className?: string;
};

export default function SituacaoPatrimonialCard({
  systemName,
  filtros,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useSituacaoPatrimonial({
      systemName: systemName ?? "",
      filtros,
    });

  return (
    <StatsCard
      title="Situação Patrimonial"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar a situação patrimonial."
      items={data?.items}
      className={className}
    />
  );
}
