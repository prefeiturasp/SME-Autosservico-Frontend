"use client";

import { useUpsQueReceberamVisita } from "@/hooks/useUpsQueReceberamVisita";
import SimpleListCard from "./SimpleListCard";

type Props = {
  readonly systemName?: string;
  readonly bare?: boolean;
  readonly className?: string;
};

const INITIAL_VISIBLE_UPS = 5;

export default function UpsQueReceberamVisitaCard({
  systemName,
  bare,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useUpsQueReceberamVisita({
    systemName: systemName ?? "",
  });

  return (
    <SimpleListCard
      title="Lista de UPs que receberam visita"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as UPs que receberam visita."
      items={data}
      initialVisibleItems={INITIAL_VISIBLE_UPS}
      expandLabel="Ver mais UPs"
      collapseLabel="Ver menos UPs"
      bare={bare}
      className={className}
    />
  );
}
