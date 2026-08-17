"use client";

import { useFichasTecnicasProdutos } from "@/hooks/useFichasTecnicasProdutos";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function FichasTecnicasProdutosCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useFichasTecnicasProdutos({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Fichas Técnicas de Produtos"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar as fichas técnicas de produtos."
      items={data?.items}
      className={className}
    />
  );
}
