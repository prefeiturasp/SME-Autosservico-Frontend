"use client";

import { useLayoutsEmbalagens } from "@/hooks/useLayoutsEmbalagens";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function LayoutsEmbalagensCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useLayoutsEmbalagens({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Layouts de embalagens"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os layouts de embalagens."
      items={data?.items}
      className={className}
    />
  );
}
