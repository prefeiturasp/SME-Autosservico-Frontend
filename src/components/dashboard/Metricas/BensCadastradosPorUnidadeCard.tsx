"use client";

import { useBensCadastradosPorUnidade } from "@/hooks/useBensCadastradosPorUnidade";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly bare?: boolean;
  readonly className?: string;
};

const INITIAL_VISIBLE_UNIDADES = 5;

export default function BensCadastradosPorUnidadeCard({
  systemName,
  bare,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useBensCadastradosPorUnidade({
    systemName: systemName ?? "",
  });

  return (
    <MetricasTableCard
      title="Bens cadastrados por unidade administrativa"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os bens cadastrados por unidade administrativa."
      rows={data}
      firstColumnLabel="Unidade administrativa"
      secondColumnLabel="Bens cadastrados"
      initialVisibleRows={INITIAL_VISIBLE_UNIDADES}
      bare={bare}
      className={className}
    />
  );
}
