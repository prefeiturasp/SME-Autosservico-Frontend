"use client";

import { useConselhoDeClasse } from "@/hooks/useConselhoDeClasse";
import { usePeriodoSgp } from "@/hooks/usePeriodosSgp";
import StatsCard from "./StatsCard";
import PeriodoSgpSelect from "./PeriodoSgpSelect";

type Props = {
  readonly systemName?: string;
  readonly className?: string;
};

export default function ConselhoDeClasseCard({ systemName, className }: Props) {
  const { periodo, setPeriodo, opcoes } = usePeriodoSgp(systemName ?? "");
  const { data, isLoading, isFetching, isError, refetch } = useConselhoDeClasse({
    systemName: systemName ?? "",
    periodo,
  });

  return (
    <StatsCard
      title="Conselho de classe"
      systemName={systemName}
      isLoading={isLoading || isFetching}
      isError={isError}
      onRetry={() => refetch()}
      errorMessage="Não foi possível carregar o conselho de classe."
      items={data}
      action={
        <PeriodoSgpSelect value={periodo} onChange={setPeriodo} options={opcoes} />
      }
      className={className}
    />
  );
}
