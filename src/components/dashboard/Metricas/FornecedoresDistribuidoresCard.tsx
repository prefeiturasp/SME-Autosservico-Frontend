"use client";

import { useFornecedoresDistribuidores } from "@/hooks/useFornecedoresDistribuidores";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function FornecedoresDistribuidoresCard({ systemName, className }: Props) {
  const { data, isLoading, isFetching, isError, refetch } = useFornecedoresDistribuidores({
    systemName: systemName ?? "",
  });

  return (
    <StatsCard
      title="Fornecedores e Distribuidores"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar os fornecedores e distribuidores."
      items={data?.items}
      className={className}
    />
  );
}
