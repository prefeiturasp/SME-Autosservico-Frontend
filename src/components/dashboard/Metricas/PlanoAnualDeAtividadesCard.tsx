"use client";

import { usePlanoAnualDeAtividades } from "@/hooks/usePlanoAnualDeAtividades";
import type { SigEscolaFiltros } from "@/types/sigEscolaFiltros";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly filtros: SigEscolaFiltros;
  readonly className?: string;
};

export default function PlanoAnualDeAtividadesCard({
  systemName,
  filtros,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    usePlanoAnualDeAtividades({
      systemName: systemName ?? "",
      filtros,
    });

  return (
    <StatsCard
      title="Plano Anual de Atividades"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o plano anual de atividades."
      items={data?.items}
      className={className}
    />
  );
}
