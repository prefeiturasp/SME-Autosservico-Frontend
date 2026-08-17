"use client";

import { useProdutosHomologados } from "@/hooks/useProdutosHomologados";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function ProdutosHomologadosCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useProdutosHomologados({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Produtos Homologados"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os produtos homologados."
      items={data?.items}
      className={className}
    />
  );
}
