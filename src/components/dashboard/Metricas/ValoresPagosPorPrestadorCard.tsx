"use client";

import { useValoresPagosPorPrestador } from "@/hooks/useValoresPagosPorPrestador";
import MetricasTableCard from "./MetricasTableCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

const INITIAL_VISIBLE_ROWS = 5;

export default function ValoresPagosPorPrestadorCard({
  systemName,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useValoresPagosPorPrestador({
      systemName: systemName ?? "",
    });

  return (
    <MetricasTableCard
      title="Valores pagos no mês por prestador"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os valores pagos por prestador."
      rows={data}
      firstColumnLabel="Prestador"
      secondColumnLabel="Valor pago"
      valueFormat="currency"
      initialVisibleRows={INITIAL_VISIBLE_ROWS}
      expandLabel="Ver mais prestadores"
      collapseLabel="Ver menos prestadores"
      className={className}
    />
  );
}
