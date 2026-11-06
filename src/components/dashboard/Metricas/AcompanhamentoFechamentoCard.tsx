"use client";

import { useAcompanhamentoFechamento } from "@/hooks/useAcompanhamentoFechamento";
import type { PeriodoSgpOption } from "@/types/sgpMetricas";
import StatsCard from "./StatsCard";
import PeriodoSgpSelect from "./PeriodoSgpSelect";

type Props = {
  readonly systemName?: string;
  readonly periodo: string;
  readonly opcoes: ReadonlyArray<PeriodoSgpOption>;
  readonly onPeriodoChange: (next: string) => void;
  readonly className?: string;
};

// O período vem da seção porque os gráficos por DRE usam o mesmo filtro.
export default function AcompanhamentoFechamentoCard({
  systemName,
  periodo,
  opcoes,
  onPeriodoChange,
  className,
}: Props) {
  const { data, isLoading, isFetching, isError, refetch } =
    useAcompanhamentoFechamento({ systemName: systemName ?? "", periodo });

  return (
    <StatsCard
      title="Acompanhamento de fechamento"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o acompanhamento de fechamento."
      items={data?.itens}
      action={
        <PeriodoSgpSelect
          value={periodo}
          onChange={onPeriodoChange}
          options={opcoes}
        />
      }
      className={className}
    />
  );
}
