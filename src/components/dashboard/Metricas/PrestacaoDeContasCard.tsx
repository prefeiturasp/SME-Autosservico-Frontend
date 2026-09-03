"use client";

import { usePrestacaoDeContas } from "@/hooks/usePrestacaoDeContas";
import { DEFAULT_PERIODO_LETIVO } from "@/types/periodoLetivoOption";
import { useState } from "react";
import PeriodoLetivoSelect from "./PeriodoLetivoSelect";
import StatsCard from "./StatsCard";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function PrestacaoDeContasCard({ systemName, className }: Props) {
  const [periodo, setPeriodo] = useState<string>(DEFAULT_PERIODO_LETIVO);
  const { data, isLoading, isFetching, isError, refetch } = usePrestacaoDeContas({
    systemName: systemName ?? "",
    periodo,
  });

  return (
    <StatsCard
      title="Prestação de contas"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar a prestação de contas."
      items={data?.items}
      action={<PeriodoLetivoSelect value={periodo} onChange={setPeriodo} />}
      className={className}
    />
  );
}
